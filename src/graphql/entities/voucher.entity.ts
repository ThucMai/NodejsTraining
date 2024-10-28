import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { Deleted } from "../../utils/variable";

@Entity('voucher')
export class VoucherEntity {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column()
  event_id!: Number;
  @Column()
  voucher_code!: string;
  @Column()
  issued_to!: String;
  @Column() 
  issue_date!: Date;
  @Column()
  status!: String;
  @Column()
  [Deleted]!: Boolean;
}