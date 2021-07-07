import { Entity, BaseEntity, PrimaryColumn, Column } from "typeorm";
import { bookingsIndex, ListingType } from "../../lib/types";


@Entity("listings")
export class ListingEntity extends BaseEntity {
  @PrimaryColumn("text")
  id: string;

  @Column("varchar", { length: 100 })
  title: string;

  @Column("varchar", { length: 5000 })
  description: string;

  @Column("text")
  image: string;

  @Column("text")
  host: string;

  @Column({ type: "enum", enum: ListingType })
  type: ListingType;

  @Column("text")
  address: string;

  @Column("text")
  country: string;

  @Column("text")
  admin: string;

  @Column("text")
  city: string;

  @Column("simple-array")
  bookings: string[];

  @Column("simple-json")
  bookingsIndex: bookingsIndex;

  @Column("integer")
  price: number;

  @Column("integer")
  numOfGuests: number;
}
