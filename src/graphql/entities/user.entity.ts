import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("user")
export class UserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name: string;
  @Column()
  username: string;
  @Column()
  email: string;
  @Column()
  phone: string;
  @Column()
  password: string;
  @Column()
  status: string;

  constructor (
    name: string, username: string, email: string, phone: string, password: string, status: string
  ) {
    this.name = name;
    this.username = username;
    this.email = email;
    this.phone = phone;
    this.password = password;
    this.status = status;
  }
}
