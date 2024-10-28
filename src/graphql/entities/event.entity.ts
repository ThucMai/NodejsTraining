import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { Deleted } from "../../utils/variable";

@Entity('event')
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
  voucher_quantity!: string;
  @Column()
  voucher_released!: string;
  @Column()
  status!: string;
  @Column()
  [Deleted]!: Boolean;
}
