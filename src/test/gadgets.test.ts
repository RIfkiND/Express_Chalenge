import pool from "../config/db";
import Gadgets from "../models/Gadgets";

test("Create gadgets to test insert into database",async()=>{
  const name = "Telephon";
  const status = "Available";
  const codename = "The Kraken";

  const newGadget = await Gadgets.CreateGadgedts(name, status, codename);

  expect(newGadget).toBeDefined();
  expect(newGadget.name).toBe(name);
  expect(newGadget.status).toBe(status);
  expect(newGadget.codename).toBe(codename);
  expect(newGadget.id).toBeDefined(); 

  await pool.query("DELETE FROM gadgets WHERE id = $1", [newGadget.id]);
})