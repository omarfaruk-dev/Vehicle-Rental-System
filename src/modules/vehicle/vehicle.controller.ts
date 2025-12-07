import { Request, Response } from "express";
import { vehicleServices } from "./vehicle.service";

const createVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.createVehicle(req.body);
    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getAllVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.getAllVehicle();
    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getSingleVehicle = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  try {
    const result = await vehicleServices.getSingleVehicle(vehicleId!);
    res.status(200).json({
      success: true,
      message: "Vehicle retrieved successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateSingleVehicle = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  try {
    const result = await vehicleServices.updateSingleVehicle(
      req.body,
      vehicleId!
    );
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Vehicle updated successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteSingleVehicle = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  try {
    const result = await vehicleServices.deleteSingleVehicle(vehicleId!);
    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "Vehicle Not Found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Vehicle deleted successfully",
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const vehicleControllers = {
  createVehicle,
  getAllVehicle,
  getSingleVehicle,
  updateSingleVehicle,
  deleteSingleVehicle,
};
