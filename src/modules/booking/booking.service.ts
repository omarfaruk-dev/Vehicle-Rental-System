import { pool } from "../../config/db";

const createBooking = async (payload: any) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

    // 1. Check vehicle availability
    const vehicleResult = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [vehicle_id]);
    if (vehicleResult.rows.length === 0) throw new Error("Vehicle not found");
    const vehicle = vehicleResult.rows[0];

    if (vehicle.availability_status !== 'available') throw new Error("Vehicle is not available");

    // 2. Calculate total price
    const dailyPrice = parseFloat(vehicle.daily_rent_price);
    const start = new Date(rent_start_date);
    const end = new Date(rent_end_date);
    const duration = (end.getTime() - start.getTime()) / (1000 * 3600 * 24); // Difference in days

    if (duration <= 0) throw new Error("End date must be after start date");

    const total_price = (duration * dailyPrice).toFixed(2);

    // 3. Create Booking
    const result = await pool.query(
        `INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) 
         VALUES($1, $2, $3, $4, $5, 'active') RETURNING *`,
        [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
    );

    // 4. Update Vehicle Status
    await pool.query(`UPDATE vehicles SET availability_status='booked' WHERE id=$1`, [vehicle_id]);

    const booking = result.rows[0];

    // Format Response as per API Spec
    return {
        ...booking,
        vehicle: {
            vehicle_name: vehicle.vehicle_name,
            daily_rent_price: vehicle.daily_rent_price
        }
    };
};

const getAllBookings = async (user_id: string, role: string) => {
    let query = `
        SELECT 
            b.*, 
            v.vehicle_name, v.registration_number, v.type as vehicle_type, v.daily_rent_price,
            u.name as customer_name, u.email as customer_email, u.phone as customer_phone
        FROM bookings b
        JOIN vehicles v ON b.vehicle_id = v.id
        JOIN users u ON b.customer_id = u.id
    `;

    let params: any[] = [];

    if (role === 'customer') {
        query += ` WHERE b.customer_id=$1`;
        params.push(user_id);
    }

    const result = await pool.query(query, params);

    // Map to nested structure
    return result.rows.map(row => {
        const {
            vehicle_name, registration_number, vehicle_type, daily_rent_price,
            customer_name, customer_email, customer_phone,
            ...bookingData
        } = row;

        const response: any = {
            ...bookingData,
            vehicle: {
                vehicle_name,
                registration_number,
                type: vehicle_type,
                daily_rent_price // Optional, included in some specs
            }
        };

        // Admin sees customer info
        if (role === 'admin') {
            response.customer = {
                name: customer_name,
                email: customer_email,
                phone: customer_phone
            };
        }

        return response;
    });
};

const returnBooking = async (bookingId: string) => {
    // 1. Get booking to find vehicle_id
    const bookingQuery = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [bookingId]);
    if (bookingQuery.rows.length === 0) throw new Error("Booking not found");

    const { vehicle_id, status } = bookingQuery.rows[0];

    // 2. Update Booking Status
    const result = await pool.query(
        `UPDATE bookings SET status='returned', updated_at=CURRENT_TIMESTAMP WHERE id=$1 RETURNING *`,
        [bookingId]
    );

    // 3. Update Vehicle Status
    await pool.query(`UPDATE vehicles SET availability_status='available' WHERE id=$1`, [vehicle_id]);

    // Format Response
    return {
        ...result.rows[0],
        vehicle: {
            availability_status: "available"
        }
    };
};

const cancelBooking = async (bookingId: string, user_id: string) => {
    // 1. Get Booking
    const bookingQuery = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [bookingId]);
    if (bookingQuery.rows.length === 0) throw new Error("Booking not found");
    const booking = bookingQuery.rows[0];

    if (booking.customer_id !== parseInt(user_id)) throw new Error("Unauthorized to cancel this booking");
    if (booking.status !== 'active') throw new Error("Booking cannot be cancelled");

    const { vehicle_id } = booking;

    // 2. Update Booking
    const result = await pool.query(
        `UPDATE bookings SET status='cancelled', updated_at=CURRENT_TIMESTAMP WHERE id=$1 RETURNING *`,
        [bookingId]
    );

    // 3. Status back to available
    await pool.query(`UPDATE vehicles SET availability_status='available' WHERE id=$1`, [vehicle_id]);

    return result.rows[0];
}

export const bookingServices = {
    createBooking,
    getAllBookings,
    returnBooking,
    cancelBooking
};
