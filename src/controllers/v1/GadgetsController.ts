import { errors } from "./../../../node_modules/@sideway/address/lib/index.d";
import { Request, Response } from "express";
import Gadgets from "../../models/gadgets";
import { gadgetSchema } from "../../schema/gadgetschema";

class GadgetsController {
  async allGadgets(req: Request, res: Response) {
    try {
      const result = await Gadgets.GetGadgets();
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async addGadgets(req: Request, res: Response) {
    const codenames = ["The Nightingale", "The Kraken"];
    const generateCodeName = (): string => {
      return codenames[Math.floor(Math.random() * codenames.length)];
    };
    const { error } = gadgetSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const { name, status } = req.body;
    try {
      const codenames = generateCodeName();
      const newGadgets = await Gadgets.CreateGadgedts(name, status ,codenames);
      res.status(201).json(newGadgets);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async editGadgets(req: Request, res: Response) {
    const { id } = req.params;
    const { name, email } = req.body;
    try {
      const updatedUser = await Gadgets.UpdateGadgets(id, name, email);
      updatedUser
        ? res.json(updatedUser)
        : res.status(404).json({ message: "User not found" });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async deleteGadgets(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const success = await Gadgets.DeleteGadgets(id);
      success
        ? res.json({ message: "User deleted" })
        : res.status(404).json({ message: "User not found" });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}

export default new GadgetsController();
