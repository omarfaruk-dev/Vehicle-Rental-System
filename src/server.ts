import express, { Request, Response } from "express";
import initDB from "./config/db";
import logger from "./middleware/logger";
import config from "./config";
import { userRoutes } from "./modules/user/user.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { vehicleRoutes } from "./modules/vehicle/vehicle.routes";
import { bookingRoutes } from "./modules/booking/booking.router";

const app = express();
const port = config.port;

// parser (MiddleWare)
app.use(express.json());

// initializing DB
initDB();
// root
app.get("/", logger, (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is running...",
    developer: {
      name: "Omar Faruk",
      email: "omarfaruk.dev@gmail.com",
    },
  });
});

// CRUD OPERATION API's
// USERS
app.use("/api/v1", userRoutes);

// AUTH
app.use("/api/v1", authRoutes);

// VEHICLE
app.use("/api/v1", vehicleRoutes);

// BOOKINGS
app.use("/api/v1", bookingRoutes);

// not found error handle
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Routes Not Found",
    path: req.path,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
// export default app;
