import "reflect-metadata";

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { Room } from "./Room.js";

@Entity("messages")
export class Message {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("text")
  content!: string;

  @Column({ type: "varchar", length: 255 })
  by!: string;

  @Column({ type: "integer", nullable: true })
  userId?: number;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => Room, (room) => room.messages, { onDelete: "CASCADE" })
  room!: Room;
}

