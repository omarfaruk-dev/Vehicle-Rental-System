import { Pool } from "pg";
import config from "./";

// DB
export const pool = new Pool({
    connectionString: `${config.connection_str}`,
});


const initDB = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone VARCHAR(15),
        role VARCHAR(50) NOT NULL
        )`);


};

export default initDB;