import { Router, type IRouter } from "express";
import healthRouter from "./health";
import animeRouter from "./anime";
import charactersRouter from "./characters";
import evidenceRouter from "./evidence";
import battlesRouter from "./battles";

const router: IRouter = Router();

router.use(healthRouter);
router.use(animeRouter);
router.use(charactersRouter);
router.use(evidenceRouter);
router.use(battlesRouter);

export default router;
