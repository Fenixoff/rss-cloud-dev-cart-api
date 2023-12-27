import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum CartStatuses {
  OPEN = 'OPEN',
  ORDERED = 'ORDERED',
}

interface ICartItem {
  product: Product;
  count: number;
}

interface ICart {
  id: string;
  user_id: string;
  status: CartStatuses;
  created_at: string;
  updated_at: string;
}

export class Product {
  @PrimaryColumn('uuid')
  id: string;

  title: string;
  description: string;
  price: number;
}

@Entity()
export class CartItem extends BaseEntity {
  @Column(() => Product)
  product: Product;

  @Column()
  count: number;

  @PrimaryColumn({
    type: 'uuid',
    name: 'cartId',
  })
  @ManyToOne('Cart', 'items')
  cart: ICart;
}

@Entity()
export class Cart extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;

  @Column({ type: 'enum', enum: CartStatuses, default: CartStatuses.OPEN })
  status: CartStatuses;

  @OneToMany('CartItem', 'cart', {
    cascade: true,
    eager: true,
  })
  items: ICartItem[];
}
