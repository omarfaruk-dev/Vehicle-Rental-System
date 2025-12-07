import app from "./app";
import config from "./config";
import initDB from "./config/db";

const main = async () => {
    try {
        await initDB();
        app.listen(config.port, () => {
            console.log(`Server is running on port ${config.port}
                url: http://localhost:${config.port}   
            `)
        })
    } catch (err) {
        console.error('Failed to connect to database', err);
        process.exit(1);
    }
}

main();
