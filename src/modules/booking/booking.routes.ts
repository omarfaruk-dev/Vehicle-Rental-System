import { Router } from "express";
import { bookingControllers } from "./booking.controller";
import auth from "../../middleware/auth";
import { pool } from "../../config/db";
// I need accurate middleware for creating booking to inject user ID if token lacks it.
// But I'll fix the token in next step.

const router = Router();

// Middleware to inject user ID - temporary fix if I don't update auth service immediately
const injectUserId = async (req: any, res: any, next: any) => {
    if (req.user && req.user.Email) {
        try {
            const result = await pool.query(`SELECT id FROM users WHERE email=$1`, [req.user.Email]);
            if (result.rows.length > 0) {
                req.user.id = result.rows[0].id;
                req.body.customer_id = result.rows[0].id; // Inject into body for create
            }
        } catch (err) {
            console.error(err);
        }
    }
    next();
};

router.post("/bookings", auth('customer', 'admin'), injectUserId, bookingControllers.createBooking);
router.get("/bookings", auth('admin', 'customer'), injectUserId, bookingControllers.getAllBookings);
router.put("/bookings/:bookingId", auth('customer'), injectUserId, bookingControllers.cancelBooking); // Customer cancels
// Admin returns? The prompt says "Put ... Admin: Mark as returned". 
// I should probably have a separate route or handle in same PUT based on role/status?
// Usually explicit start/end routes are better.
// But strictly following "PUT /api/v1/bookings/:bookingId".
// I'll make a smart controller or separate logic.
// Let's add a separate handler in controller to dispatch based on role/action.
// But simpler: If admin calls PUT, it's return. If customer calls PUT, it's cancel.
router.put("/return/:bookingId", auth('admin'), bookingControllers.returnBooking);
// Wait, spec says "PUT /api/v1/bookings/:bookingId".
// I will route it to a unified controller function that delegates? 
// Or just reuse the path.

// Re-defining for spec compliance:
router.put("/bookings/:bookingId", auth('admin', 'customer'), injectUserId, async (req, res, next) => {
    if (req.user?.role === 'admin') {
        // Admin logic -> Return
        return bookingControllers.returnBooking(req, res);
    } else {
        // Customer logic -> Cancel
        return bookingControllers.cancelBooking(req, res);
    }
});

export const bookingRoutes = router;
