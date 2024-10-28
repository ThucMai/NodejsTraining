import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { Deleted } from "../../utils/variable";

@Entity('user')
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
  @Column()
  status!: string;
  @Column()
  [Deleted]!: Boolean;
}