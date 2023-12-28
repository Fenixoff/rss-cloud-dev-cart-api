import { Injectable } from '@nestjs/common';

import { Order } from '../models';

@Injectable()
export class OrderService {
  async findById(id: string): Promise<Order> {
    return Order.findOneBy({ id });
  }

  async create(data: Partial<Order>) {
    return Order.save(data);
  }

  async update(id: string, data: Partial<Order>) {
    const order = await this.findById(id);

    if (!order) {
      throw new Error('Order does not exist.');
    }

    return Order.merge(order, data).save();
  }
}
