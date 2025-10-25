import dotenv from "dotenv";
dotenv.config();

import { DataSource } from "typeorm";

import { User } from "./entities/User.js";
import { Room } from "./entities/Room.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || "videochat",
  synchronize: true,
  logging: false,
  entities: [User, Room],
  subscribers: [],
  migrations: [],
});

export async function initializeDatabase() {
  try {
    await AppDataSource.initialize();
    console.log("PosgreSQL database connected successfully");
  } catch (error) {
    console.log("PosgreSQL connection error:", error);
  }
}

