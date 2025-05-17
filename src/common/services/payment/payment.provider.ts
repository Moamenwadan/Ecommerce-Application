import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
export const STRIPE_CLIENT = 'STRIPE_CLIENT';
export const StripeProvider = {
  provide: STRIPE_CLIENT,
  useFactory: (configService: ConfigService) => {
    return new Stripe(configService.get('STRIPE_SECRET_KEY')!);
    // console.log(configService.get('STRIPE_SECRET_KEY')!);
  },
  inject: [ConfigService],
};
