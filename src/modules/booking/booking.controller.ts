import { Request, Response } from "express";
import { bookingServices } from "./booking.service";

const addBooking = async (req: Request, res: Response) => {
  try {
    const {booking, vehicle} = await bookingServices.addBooking(req.body);
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: {
        ...booking,
        vehicle
      }
    });
  } catch (err: any) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};


const getBookings = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const result = await bookingServices.getBookings(user);
    
    res.status(200).json({
      success: true,
      message: user.role === 'admin' ? "Bookings retrieved successfully" : "Your bookings retrieved successfully",
      data: result.rows
    });
  } catch (err: any) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

const updateBooking = async (req: Request, res: Response) => {
    try {
        const { bookingId } = req.params;
        const user = (req as any).user;
        const result = await bookingServices.updateBooking(bookingId as string, req.body, user);
        
        const message = req.body.status === 'returned' 
            ? "Booking marked as returned. Vehicle is now available"
            : "Booking cancelled successfully";

        res.status(200).json({
            success: true,
            message: message,
            data: result
        });
    } catch (err: any) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
}

export const bookingControllers = {
    addBooking,
    getBookings,
    updateBooking
};
