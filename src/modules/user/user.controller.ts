import { Request, Response } from "express";
import { userServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {
    try {
        const result = await userServices.createUser(req.body);
        const { id, name, email, phone, role } = result.rows[0];
        const resultRow = {
            id,
            name,
            email,
            phone,
            role,
        };
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: resultRow,
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const getAllUser = async (req: Request, res: Response) => {
    try {
        const result = await userServices.getAllUser();
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: result.rows,
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const updateUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const result = await userServices.updateUser(req.body, userId!);
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.deleteUser(req.params.userId!);
    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
export const userControllers = {
    createUser,
    getAllUser,
    updateUser,
    deleteUser,
};