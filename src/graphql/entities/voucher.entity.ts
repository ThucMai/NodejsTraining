import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { Deleted, ItemStatus } from "../../utils/variable";

@Entity('vouchers')
export class VoucherEntity {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column()
  event_id!: number;
  @Column()
  voucher_code!: string;
  @Column()
  issued_to!: string;
  @Column() 
  issue_date!: Date;
  @Column()
  expired_date!: Date;
  @Column({ default: ItemStatus.Active })
  status!: string;
  @Column()
  [Deleted]!: boolean;
}
export interface IVoucher extends Document {
  id: Number;
  event_id: Number;
  voucher_code: String;
  issued_to: String;
  issue_date: Date;
  expired_date: Date;
  status: String;
  [Deleted] : Boolean;
}