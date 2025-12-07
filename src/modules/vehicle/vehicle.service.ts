import { pool } from "../../config/db";

const createVehicle = async (payload: any) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;
    const result = await pool.query(
        `INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) 
         VALUES($1, $2, $3, $4, $5) RETURNING *`,
        [vehicle_name, type, registration_number, daily_rent_price, availability_status || 'available']
    );
    return result.rows[0];
};

const getAllVehicles = async () => {
    const result = await pool.query(`SELECT * FROM vehicles`);
    return result.rows;
};

const getVehicleById = async (id: string) => {
    const result = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [id]);
    return result.rows[0];
};

const updateVehicle = async (id: string, payload: any) => {
    const fields = Object.keys(payload);
    const values = Object.values(payload);

    if (fields.length === 0) return null;

    const setClause = fields.map((field, index) => `${field}=$${index + 2}`).join(', ');

    const result = await pool.query(
        `UPDATE vehicles SET ${setClause}, updated_at=CURRENT_TIMESTAMP WHERE id=$1 RETURNING *`,
        [id, ...values]
    );
    return result.rows[0];
};

const deleteVehicle = async (id: string) => {
    // Check if there are active bookings
    const bookings = await pool.query(`SELECT * FROM bookings WHERE vehicle_id=$1 AND status='active'`, [id]);
    if (bookings.rows.length > 0) {
        throw new Error("Cannot delete vehicle with active bookings");
    }
    const result = await pool.query(`DELETE FROM vehicles WHERE id=$1 RETURNING *`, [id]);
    return result.rows[0];
};

export const vehicleServices = {
    createVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle
};
