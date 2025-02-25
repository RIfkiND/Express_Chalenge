import { Router } from "express";
import  GadgetsController from "../controllers/v1/GadgetsController";

const router = Router();

router.get("/", GadgetsController.allGadgets);
router.post("/add", GadgetsController.addGadgets);
router.put("/:id", GadgetsController.editGadgets);
router.delete("/:id", GadgetsController.deleteGadgets);

export default router;
