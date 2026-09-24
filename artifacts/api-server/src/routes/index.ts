import { Router, type IRouter } from "express";
import healthRouter from "./health";
import betaSignupsRouter from "./beta-signups";

const router: IRouter = Router();

router.use(healthRouter);
router.use(betaSignupsRouter);

export default router;
