import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

import { AppDataSource } from "../database";
import { Room } from "../entities/Room";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { name, token } = req.body;

    const roomRepository = AppDataSource.getRepository(Room);

    const existingRoom = await roomRepository.findOneBy({ name });

    if (existingRoom) {
      return res.status(400).json({ success: false, error: "Room already exists" });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "secret");

    const roomId = uuidv4();

    const room = roomRepository.create({
      id: roomId,
      name,
      creator_id: decoded.id,
    });

    await roomRepository.save(room);

    res.json({ success: true, room });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const roomRepository = AppDataSource.getRepository(Room);
    const room = await roomRepository.findOne({
      where: { id: req.params.id },
      relations: ["creator"],
    });

    if (!room) {
      return res.status(404).json({ success: false, error: "Room not found" });
    }

    res.json({ success: true, room });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/users/:userId", async (req, res) => {
  try {
    const roomRepository = AppDataSource.getRepository(Room);
    const rooms = await roomRepository.find({
      where: { creator_id: parseInt(req.params.userId) },
      order: { created_at: "DESC" },
    });

    res.json({ success: true, rooms });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

