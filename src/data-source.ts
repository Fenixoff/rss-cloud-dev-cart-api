import { DataSource } from 'typeorm';

import 'dotenv/config';

import { Cart, CartItem } from './cart';
import { User } from './users';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DB_URL,
  synchronize: true,
  logging: true,
  entities: [Cart, CartItem, User],
  migrations: [],
  subscribers: [],
  ssl: {
    rejectUnauthorized: false,
  },
});
