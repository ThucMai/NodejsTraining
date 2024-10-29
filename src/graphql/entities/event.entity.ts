import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { Deleted, ItemStatus } from "../../utils/variable";

@Entity('events')
export class EventEntity {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column()
  event_name!: string;
  @Column()
  description!: string;
  @Column()
  event_date_start!: Date;
  @Column()
  event_date_end!: Date;
  @Column()
  voucher_quantity!: number;
  @Column()
  voucher_released!: number;
  @Column({ default: ItemStatus.Active })
  status!: string;
  @Column()
  [Deleted]!: boolean;
}
export interface IEvent extends Document {
  id: Number;
  event_name: String;
  description: String;
  event_date_start: Date;
  event_date_end: Date;
  voucher_quantity: Number;
  voucher_released: Number;
  status: String;
  [Deleted] : Boolean;
}
