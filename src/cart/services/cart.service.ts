import { Injectable } from '@nestjs/common';

import { Cart, CartItem } from '../models';

@Injectable()
export class CartService {
  async findByUserId(userId: string): Promise<Cart> {
    return Cart.findOneBy({ user_id: userId });
  }

  async createByUserId(userId: string) {
    const userCart = new Cart();
    userCart.user_id = userId;
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
    const cart = await Cart.findOne({
      select: { id: true },
      where: { user_id: userId },
    });

    if (item.count === 0) {
      await CartItem.delete({ cart, product: { id: item.product.id } });
    } else {
      item.cart = cart;
      await CartItem.upsert(item, ['cart', 'product.id']);
    }
    return Cart.findOneBy({ id: cart.id });
  }
}
