import {
  Controller,
  Get,
  Delete,
  Put,
  Body,
  Req,
  Post,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';

import { Order, OrderService } from '../order';
import { AppRequest, getUserIdFromRequest } from '../shared';

import { calculateCartTotal } from './models-rules';
import { CartService } from './services';
import { BasicAuthGuard } from 'src/auth';
import { Cart, CartItem, CartStatuses } from './models';
import { AppDataSource } from 'src/data-source';

@Controller('api/profile/cart')
@UseGuards(BasicAuthGuard)
export class CartController {
  constructor(
    private cartService: CartService,
    private orderService: OrderService,
  ) {}

  // @UseGuards(JwtAuthGuard)
  @Get()
  async findUserCart(@Req() req: AppRequest) {
    return this.cartService.findOrCreateByUserId(getUserIdFromRequest(req));
  }

  // @UseGuards(JwtAuthGuard)
  @Put()
  async updateUserCart(@Req() req: AppRequest, @Body() body: CartItem) {
    // TODO: validate body payload...

    return this.cartService.updateUserCart(getUserIdFromRequest(req), body);
  }

  // @UseGuards(JwtAuthGuard)
  @Delete()
  async clearUserCart(@Req() req: AppRequest) {
    return this.cartService.removeByUserId(getUserIdFromRequest(req));
  }

  // @UseGuards(JwtAuthGuard)
  @Put('order')
  async checkout(@Req() req: AppRequest, @Body() body) {
    const requestItems = body.items;
    const requestAddress = body.address;

    if (!(requestItems && requestAddress)) {
      throw new BadRequestException('Bad request');
    }

    if (!requestItems.length) {
      throw new BadRequestException('Cart is empty');
    }

    const userId = getUserIdFromRequest(req);
    return AppDataSource.transaction(async (transactionalEntityManager) => {
      const cart = await transactionalEntityManager.findOneBy(Cart, {
        user: { id: userId },
      });

      cart.items = requestItems;
      cart.status = CartStatuses.ORDERED;
      await transactionalEntityManager.save(cart);

      const total = calculateCartTotal(cart);
      const order = new Order();

      order.user = cart.user;
      order.cart = cart;
      order.total = total;
      order.delivery = requestAddress;

      return transactionalEntityManager.save(order);
    });
  }
}
