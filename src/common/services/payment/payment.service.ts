import { Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { STRIPE_CLIENT } from './payment.provider';

@Injectable()
export class PaymentService {
  constructor(@Inject(STRIPE_CLIENT) private readonly stripe: Stripe) {}

  async createCheckoutSession({
    line_items,
    metadata,
    discounts,
    customer_email,
  }: Stripe.Checkout.SessionCreateParams) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: line_items,
      customer_email: customer_email,
      discounts: discounts,
      success_url: 'http://localhost:5000/success',
      cancel_url: 'http://localhost:5000/cancel',
      metadata: metadata,
    });
    return session;
  }

  async createCopoun({ currency, percent_off }: Stripe.CouponCreateParams) {
    return this.stripe.coupons.create({ currency, percent_off });
  }
}
