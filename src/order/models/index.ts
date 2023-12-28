import { Cart } from 'src/cart';
import { User } from 'src/users';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum OrderStatuses {
  PLACED = 'PLACED',
  PAYED = 'PAYED',
  CANCELLED = 'CANCELLED',
  FINISHED = 'FINISHED',
}

@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @OneToMany(() => Order, (order) => order.user)
  @Column('uuid', { name: 'user_id' })
  user: User;

  @OneToOne(() => Cart)
  @JoinColumn({
    name: 'cart_id',
  })
  cart: Cart;

  @Column('json', { nullable: true })
  payment?: {
    type: string;
    address: any;
    creditCard?: any;
  };

  @Column('json', { nullable: true })
  delivery?: {
    type: string;
    address: any;
  };

  @Column()
  comments?: string;

  @Column({ type: 'enum', enum: OrderStatuses, default: OrderStatuses.PLACED })
  status: OrderStatuses;

  @Column()
  total: number;
}
