import { Request, Response } from "express";
import Gadgets from "../../models/gadgets";
import { gadgetSchema } from "../../schema/gadgetschema";
import { getReasonPhrase, StatusCodes } from "http-status-codes";

class GadgetsController {
  async allGadgets(req: Request, res: Response) {
    try {
      const result = await Gadgets.GetGadgets();
      res.json(result);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({error : getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR  )});
    }
  }

  async addGadgets(req: Request, res: Response) {
    const codenames = ["The Nightingale", "The Kraken"];
    const generateCodeName = (): string => {
      return codenames[Math.floor(Math.random() * codenames.length)];
    };
    const { error } = gadgetSchema.validate(req.body);
    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).send({error : getReasonPhrase(StatusCodes.BAD_REQUEST)});
    }
    const { name, status } = req.body;
    try {
      const codenames = generateCodeName();
      const newGadgets = await Gadgets.CreateGadgedts(name, status ,codenames);
      res.status(StatusCodes.OK).json(newGadgets);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({error : getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR  )});
    }
  }

  async editGadgets(req: Request, res: Response) {
    const { id } = req.params;
    const { name, email } = req.body;
    try {
      const updatedUser = await Gadgets.UpdateGadgets(id, name, email);
      updatedUser
        ? res.json(updatedUser)
        : res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({error : getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR  )});
    }
  }

  async deleteGadgets(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const success = await Gadgets.DeleteGadgets(id);
      success
        ? res.json({ message: "Gadgets deleted" })
        : res.status(StatusCodes.NOT_FOUND).json({ message: "Gadgets not found" });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({error : getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR  )});
    }
  }
}

export default new GadgetsController();
