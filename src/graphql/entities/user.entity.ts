import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { Deleted, ItemStatus } from "../../utils/variable";

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column()
  name!: string;
  @Column()
  username!: string;
  @Column()
  email!: string;
  @Column()
  phone!: string;
  @Column()
  password!: string;
  @Column({ default: ItemStatus.Active })
  status!: string;
  @Column()
  [Deleted]!: boolean;
}

export interface IUser extends Document {
  id: Number;
  name: String;
  username: String;
  email: String;
  phone: String;
  password: String;
  status: String;
  [Deleted] : Boolean;
}