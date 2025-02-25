import pkg from "pg";
import dotenv from "dotenv";

//This File is For A config for connecting express to Postgres

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

//Handle Succesfull Connection
pool.on("connect", () => {
  console.log("Connected to PostgreSQL");
});
//Handle UnSuccesfull Connection
pool.on("error", (err) => {
  console.error("Failed To Connect", err);
  process.exit(1);
});

export const DatabaseConnection = async (): Promise<boolean> => {
  try {
    const client = await pool.connect();
    client.release();
    return true;
  } catch (error) {
    console.error(" Database connection failed:", error);
    return false;
  }
};

export default pool;
