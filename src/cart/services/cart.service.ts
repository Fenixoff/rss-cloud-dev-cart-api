import { Injectable } from '@nestjs/common';

import { Cart, CartItem, CartStatuses } from '../models';
import { User } from 'src/users';

@Injectable()
export class CartService {
  async findByUserId(userId: string): Promise<Cart> {
    return Cart.findOneBy({ user: { id: userId }, status: CartStatuses.OPEN });
  }

  async createByUserId(userId: string) {
    const userCart = new Cart();
    userCart.user = { id: userId } as User;
    userCart.items = [];

    return Cart.save(userCart);
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return this.createByUserId(userId);
  }

  async updateByUserId(userId: string, { items }: Cart): Promise<Cart> {
    const cart = await this.findOrCreateByUserId(userId);

    cart.items = items;

    return cart.save();
  }

  async removeByUserId(userId: string): Promise<Cart> {
    return (await this.findByUserId(userId)).remove();
  }

  async updateUserCart(userId: string, item: CartItem): Promise<Cart> {
    const cart = await this.findOrCreateByUserId(userId);

    if (item.count === 0) {
      await CartItem.delete({
        cart: { id: cart.id },
        product: { id: item.product.id },
      });
    } else {
      item.cart = cart;
      await CartItem.upsert(item, ['cart', 'product.id']);
    }
    return Cart.findOneBy({ id: cart.id });
  }
}
