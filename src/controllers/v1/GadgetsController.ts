import { Request, Response } from "express";
import Gadgets from "../../models/Gadgets";
import { gadgetSchema } from "../../schema/gadgetschema";
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import { promises } from "dns";
class GadgetsController {
  async allGadgets(res: Response) {
    try {
      const result = await Gadgets.GetGadgets();
      res.json(result);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
    }
  }

  async addGadgets(req: Request, res: Response): Promise<void> {
    const codenames = ["The Nightingale", "The Kraken"];

    const generateCodeName = (): string => {
      return codenames[Math.floor(Math.random() * codenames.length)];
    };

    // Error Validation
    const { error } = gadgetSchema.validate(req.body);
    if (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: getReasonPhrase(StatusCodes.BAD_REQUEST) });
      return;
    }

    // Extract name and status
    const { name, status } = req.body;
    
    try {
      const codename = generateCodeName();
      const newGadgets = await Gadgets.CreateGadgedts(name, status, codename);
      res.status(StatusCodes.CREATED).json(newGadgets);
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
    }
  }

  async editGadgets(req: Request, res: Response) {
    const { id } = req.params;
    //request name and status
    const { name, status } = req.body;
    try {
      //update the selected gadgets id
      const updatedUser = await Gadgets.UpdateGadgets(id, name, status);
      updatedUser
        ? res.json(updatedUser)
        : res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
    }
  }

  async deleteGadgets(req: Request, res: Response) {
    const { id } = req.params;
    try {
      //delete the selected gadgets id
      const success = await Gadgets.DeleteGadgets(id);
      success
        ? res.json({ message: "Gadgets deleted" })
        : res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: "Gadgets not found" });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
    }
  }
  async filterGadgets(req: Request, res: Response) {
    const {status} = req.query;
    try {
      //filter gadgets by their status
      const gadgets  = await Gadgets.FilterGadgets(status as string)
      res.status(StatusCodes.OK).json({data : gadgets})
    } catch (error) {
       res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
    }
  }
}


export default new GadgetsController();
