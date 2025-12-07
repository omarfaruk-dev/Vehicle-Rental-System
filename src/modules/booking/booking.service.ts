import { pool } from "../../config/db";

const addBooking = async (payload: any) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  // Get vehicle data
  const vehicle = await pool.query(
    `SELECT vehicle_name, daily_rent_price, availability_status FROM vehicles WHERE id = $1`,
    [vehicle_id]
  );

  if (vehicle.rows.length === 0) throw new Error("Vehicle not found");

  const { vehicle_name, daily_rent_price, availability_status } = vehicle.rows[0];

  if (availability_status !== "available") {
      throw new Error("Vehicle is not available for booking");
  }

  // Calculate total price
  const start = new Date(rent_start_date);
  const end = new Date(rent_end_date);
  const days = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
  const total_price = days * daily_rent_price;

  // Insert booking
  const result = await pool.query(
    `INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
     VALUES($1, $2, $3, $4, $5, 'active')
     RETURNING *`,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
  );

  // Update vehicle status
  await pool.query(
      `UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`,
      [vehicle_id]
  );

  return {
    booking: result.rows[0],
    vehicle: {
      vehicle_name,
      daily_rent_price,
    },
  };
};

const getBookings = async (user: any) => {
  if (user.role === "admin") {
      const result = await pool.query(`
          SELECT 
            b.*, 
            json_build_object(
                'vehicle_name', v.vehicle_name, 
                'registration_number', v.registration_number,
                'daily_rent_price', v.daily_rent_price,
                'type', v.type
            ) as vehicle,
            json_build_object(
                'name', u.name, 
                'email', u.email
            ) as customer
        FROM bookings b
        JOIN vehicles v ON b.vehicle_id = v.id
        JOIN users u ON b.customer_id = u.id
      `);
      return result;
  }
  
  const result = await pool.query(`
      SELECT 
        b.*, 
        json_build_object(
            'vehicle_name', v.vehicle_name, 
            'registration_number', v.registration_number,
            'daily_rent_price', v.daily_rent_price,
            'type', v.type
        ) as vehicle,
        json_build_object(
            'name', u.name, 
            'email', u.email
        ) as customer
    FROM bookings b
    JOIN vehicles v ON b.vehicle_id = v.id
    JOIN users u ON b.customer_id = u.id
    WHERE b.customer_id = $1
  `, [user.id]);
  
  return result;
};

const updateBooking = async (bookingId: string, payload: any, user: any) => {
    const { status } = payload;
    
    // Check if booking exists
    const bookingRes = await pool.query(`SELECT * FROM bookings WHERE id = $1`, [bookingId]);
    if (bookingRes.rows.length === 0) {
      throw new Error("Booking not found");
    }
    const booking = bookingRes.rows[0];

    // Logic for returning a vehicle (Admin)
    if (status === "returned") {
      if (user.role !== "admin") {
        throw new Error("Only admin can mark bookings as returned");
      }
      
      const updateRes = await pool.query(
        `UPDATE bookings SET status = 'returned' WHERE id = $1 RETURNING *`,
        [bookingId]
      );
      
      await pool.query(
        `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
        [booking.vehicle_id]
      );
      
      // Fetch vehicle for response
      const vehicleRes = await pool.query(`SELECT availability_status FROM vehicles WHERE id = $1`, [booking.vehicle_id]);

      return {
        ...updateRes.rows[0],
        vehicle: vehicleRes.rows[0],
      };
    }

    // Logic for cancelling a booking (Customer)
    if (status === "cancelled") {
      // Check for customer ownership (using specific equality for potentially different types)
      if (user.role === "customer" && Number(booking.customer_id) !== Number(user.id)) {
         throw new Error("You are not authorized to cancel this booking");
      }

      if (user.role === "customer") {
          const startDate = new Date(booking.rent_start_date);
          const now = new Date();
          // Assuming strict time comparison.
          if (now.getTime() >= startDate.getTime()) {
              throw new Error("Cannot cancel booking after it has started");
          }
      }

      const updateRes = await pool.query(
        `UPDATE bookings SET status = 'cancelled' WHERE id = $1 RETURNING *`,
        [bookingId]
      );

      // If it was 'active', we should free up the vehicle.
      if (booking.status === 'active') {
          await pool.query(
            `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
            [booking.vehicle_id]
          );
      }

      return updateRes.rows[0];
    }
    
    throw new Error("Invalid status update");
};

export const bookingServices = {
  addBooking,
  getBookings,
  updateBooking
};
