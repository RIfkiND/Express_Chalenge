import pool from "../config/db";

//I use chatgpt 100% legit here btw to lazy to use sql 😁

//Automaticly Create Table To PostgresSql
const createTables = async () => {
  const query = `
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";

    -- Create ENUM type for status
    DO $$ BEGIN
      CREATE TYPE status_enum AS ENUM ('Available', 'Deployed', 'Destroyed', 'Decommissioned');
         CREATE TYPE code_enum AS ENUM ('The Nightingale', 'The Kraken');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
    -- Create users table
    CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(30) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    -- Create gadgets table
    CREATE TABLE IF NOT EXISTS gadgets (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(20) NOT NULL,
        codename code_enum NOT NULL,
        status status_enum NOT NULL DEFAULT 'Available',
        user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(query);
    console.log("Tables created successfully!");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
};

createTables();
