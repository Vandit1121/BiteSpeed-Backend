import express from "express";
import { identifyController } from "../controllers/identifyController.js";

const router = express.Router();

router.post("/",identifyController);


export default router;