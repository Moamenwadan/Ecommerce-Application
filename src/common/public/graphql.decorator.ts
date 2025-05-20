import { SetMetadata } from '@nestjs/common';
export const Is_GRAPHQL = 'isGraphql';
export const Graphql = () => SetMetadata(Is_GRAPHQL, true);
