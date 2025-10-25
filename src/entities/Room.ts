import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { User } from "./User.js";
import { Message } from "./Message.js";

@Entity("rooms")
export class Room {
  @PrimaryColumn({ type: "varchar", length: 255 })
  id!: string;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "int" })
  creator_id!: number;

  @ManyToOne(() => User, (user) => user.rooms)
  @JoinColumn({ name: "creator_id" })
  creator!: User;

  @OneToMany(() => Message, (message) => message.room)
  messages!: Message[];

  @CreateDateColumn()
  created_at!: Date;
}

