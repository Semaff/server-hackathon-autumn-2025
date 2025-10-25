import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { AppDataSource } from "../database";
import { User } from "../entities/User";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const userRepository = AppDataSource.getRepository(User);
    const existingUser = await userRepository.findOneBy({ username });

    if (existingUser) {
      return res.status(400).json({ success: false, error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = userRepository.create({
      username,
      password: hashedPassword,
    });

    await userRepository.save(user);

    res.json({ success: true, user: { id: user.id, username: user.username } });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ username });

    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || "secret"
    );

    res.json({
      success: true,
      token,
      user: { id: user.id, username: user.username },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

