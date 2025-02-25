import pool from "../config/db";
import { v4 as uuid } from "uuid";
import { ingadgets } from "../types/gadgetstype";

class Gadgets {
  async GetGadgets(): Promise<ingadgets[]> {
    const result = await pool.query("SELECT * FROM gadgets");
    //add rabndom success probability
    const gadgets = result.rows.map((gadgets) => ({
      ...gadgets,
      success_probability: `${Math.floor(Math.random() * 100) + 1}%`,
    }));
    return gadgets;
  }

  async CreateGadgedts(
    name: string,
    status: string,
    codename: string
  ): Promise<ingadgets> {
    const id = uuid();
    const result = await pool.query(
      "INSERT INTO gadgets (name, status, codename) VALUES ($1, $2, $3)",
      [id, name, status, codename]
    );
    return result.rows[0];
  }

  async UpdateGadgets(
    id: string,
    name: string,
    status: string
  ): Promise<ingadgets | null> {
    const result = await pool.query(
      "UPDATE gadgets SET name = $1, status = $2 WHERE id = $3 RETURNING *",
      [id, name, status]
    );
    return result.rows[0] || null;
  }

  //peak production code
  async DeleteGadgets(id: string): Promise<boolean> {
    const result: any = await pool.query("DELETE FROM gadgets WHERE id = $1", [
      id,
    ]);
    return result.rowCount > 0;
  }

  async FilterGadgets(status: string) {
    const result = await pool.query("SELECT FROM gadgets WHERE Stauts = $1 ", [
      status,
    ]);
    return result.rows;
  }
}

export default new Gadgets();
