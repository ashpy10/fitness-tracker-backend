import dotenv from "dotenv";
dotenv.config();
import pg from "pg";

const db = new pg.Client(process.env.DATABASE_URL);

db.connect()
    .then(() => {
        console.log("Connected to database");
    })
    .catch((err) => {
        console.error("Connection error!", err);
    });

export default db;
