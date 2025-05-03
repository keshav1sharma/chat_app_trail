import  express  from "express";
import { protectRoute } from "../middlewares/authMiddleware";
import { getUsersForSidebar,getMessages,sendMessage } from "../controllers/message";
const router = express.Router();

router.get("/user",protectRoute,getUsersForSidebar);

router.get("/:id",protectRoute,getMessages);

router.post("/send/:id",protectRoute,sendMessage);
export default router;