import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("event")
export class UserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  event_name: string;
  @Column()
  description: string;
  @Column()
  event_date_start: Date;
  @Column()
  event_date_end: Date;
  @Column()
  voucher_quantity: string;
  @Column()
  voucher_released: string;
  @Column()
  status: string;

  constructor (
    event_name: string, description: string, event_date_start: Date, event_date_end: Date, voucher_quantity: string, voucher_released: string, status: string
  ) {
    this.event_name = event_name;
    this.description = description;
    this.event_date_start = event_date_start;
    this.event_date_end = event_date_end;
    this.voucher_quantity = voucher_quantity;
    this.voucher_released = voucher_released;
    this.status = status;
  }
}
