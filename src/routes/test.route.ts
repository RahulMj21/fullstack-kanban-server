import { Router } from "express";
const router = Router();

router
    .route("/health-check")
    .get((req, res) => res.status(200).json("Bolo Radhe Shyam Ki Jayy..."));

router.put("/hello-put", async (req, res) => {
    res.status(200).json("Bolo Radhe Shyam ki Jayy...");
});

export default router;
