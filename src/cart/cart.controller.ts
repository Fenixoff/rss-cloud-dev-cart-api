import {
  Controller,
  Get,
  Delete,
  Put,
  Body,
  Req,
  Post,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';

import { OrderService } from '../order';
import { AppRequest, getUserIdFromRequest } from '../shared';

import { calculateCartTotal } from './models-rules';
import { CartService } from './services';
import { BasicAuthGuard } from 'src/auth';
import { Cart, CartItem } from './models';

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
  @Post('checkout')
  async checkout(@Req() req: AppRequest, @Body() body: Cart) {
    const userId = getUserIdFromRequest(req);
    const cart = await this.cartService.findByUserId(userId);

    if (!(cart && cart.items.length)) {
      const statusCode = HttpStatus.BAD_REQUEST;
      req.statusCode = statusCode;

      return {
        statusCode,
        message: 'Cart is empty',
      };
    }

    const { id: cartId, items } = cart;
    const total = calculateCartTotal(cart);
    const order = this.orderService.create({
      ...body, // TODO: validate and pick only necessary data
      userId,
      cartId,
      items,
      total,
    });
    this.cartService.removeByUserId(userId);

    return order;
  }
}
