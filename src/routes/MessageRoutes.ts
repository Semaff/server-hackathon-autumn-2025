import { Router } from "express";
import { AppDataSource } from "../database";
import { Room } from "../entities/Room";
import { Message } from "../entities/Message";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const messageRepository = AppDataSource.getRepository(Message);
    const roomRepository = AppDataSource.getRepository(Room);

    const { roomId, userId, by, content } = req.body;

    const room = await roomRepository.findOne({
      where: {
        id: roomId,
      },
    });

    if (!room) {
      return res.status(400).json({ error: "Комната не найдена" });
    }

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: "Сообщение не может быть пустым" });
    }

    if (content.length > 5000) {
      return res.status(400).json({ error: "Сообщение слишком длинное" });
    }

    const message = messageRepository.create({
      by,
      room,
      userId,
      content: content.trim(),
    });

    await messageRepository.save(message);

    res.status(201).json(message);
  } catch (error) {
    console.error("Save message error:", error);
    res.status(500).json({ error: "Ошибка сохранения сообщения" });
  }
});

router.get("/:roomId", async (req, res) => {
  try {
    const messageRepository = AppDataSource.getRepository(Message);
    const roomRepository = AppDataSource.getRepository(Room);

    const { roomId } = req.params;

    const room = await roomRepository.findOne({
      where: {
        id: roomId,
      },
    });

    if (!room) {
      return res.status(400).json({ error: "Комната не найдена" });
    }

    const messages = await messageRepository.find({
      where: {
        room: {
          id: roomId,
        },
      },
      order: { createdAt: "ASC" },
    });

    res.status(201).json(messages);
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ error: "Ошибка получения сообщений" });
  }
});

export default router;

