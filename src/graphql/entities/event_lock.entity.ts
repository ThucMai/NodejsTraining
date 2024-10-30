import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { Deleted, ItemStatus } from "../../utils/variable";

@Entity('events')
export class EventLockEntity {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column()
  event_id!: number;
  @Column()
  user_id!: number;
  @Column()
  status!: string;
  @Column()
  time_lock!: Date;

}
export interface IEventLock extends Document {
  id: number;
  event_id: Number;
  user_id: Number;
  status: String;
  time_lock: Date;
  [Deleted] : Boolean;
}
