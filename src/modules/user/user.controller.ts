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
  const user = (req as any).user;

  try {
    // Authorization Check
    if (user.role === "customer" && Number(user.id) !== Number(userId)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this user",
      });
    }

    // Role Escalation Prevention
    if (user.role === "customer" && req.body.role && req.body.role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "You cannot update your own role",
      });
    }



    const result = await userServices.updateUser(req.body, userId!);
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Safety: ensure we return 200 with data if success
    else {
      res.status(200).json({
        success: true,
        message: "User updated successfully",
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
