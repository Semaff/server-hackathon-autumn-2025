import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User.js";

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

  @CreateDateColumn()
  created_at!: Date;
}

