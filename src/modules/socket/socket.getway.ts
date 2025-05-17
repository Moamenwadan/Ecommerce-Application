import { ConfigService } from '@nestjs/config';
import { AuthService } from './../auth/auth.service';
import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TokenRepository } from 'src/DB/repositers/token.repository';
import { Types } from 'mongoose';
import { UserRepository } from 'src/DB/repositers/user.repository';

@WebSocketGateway({ cors: { origin: '*' } })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  soketUsers: Map<string, Socket> = new Map();
  constructor(
    private readonly _JwtService: JwtService,
    private readonly _UserRepository: UserRepository,
    private readonly _TokenRepository: TokenRepository,
    private readonly _ConfigService: ConfigService,
  ) {}
  async handleConnection(client: Socket, ...args: any[]) {
    const authHeader = client.handshake.auth.authorization;
    const token = authHeader.spli('')[0];
    try {
      if (!authHeader || token.startsWith('Bearer')) {
        throw new BadRequestException('you are not authorized');
      }
      const payload = await this._JwtService.verify(token, {
        secret: this._ConfigService.get('JWT_SECRET'),
      });
      if (!payload) {
        throw new BadRequestException('you are not authorized');
      }
      const user = await this._UserRepository.findOne({
        filter: { _id: payload.id },
      });
      if (!user) throw new BadRequestException('the user doesnot exist');

      const tokenExist = await this._TokenRepository.findOne({
        filter: { token, isValid: true, user: user?._id },
      });
      if (!tokenExist) {
        throw new BadRequestException('you are not authorized');
      }
      client.data.user = user;
    } catch (error) {}

    const userId = client.data.user._id;
    this.soketUsers.set(userId, client);
  }

  handleDisconnect(client: Socket) {
    this.soketUsers.delete(client.data.user._id);
  }

  broadCatStockUpdate(productId: Types.ObjectId, data: any) {
    this.server.emit('stock-update', { productId, data });
  }
  privateMessage(
    client: Socket,
    data: { recevierId: string; message: string },
  ) {
    const sender = client.data.user;
    if (!sender)
      return client.emit('error', { message: 'sender are not authorized ' });
    const receiverSocket = this.soketUsers.get(data.recevierId);
    if (!receiverSocket)
      return client.emit('error', { message: 'sender are not authorized ' });
    receiverSocket?.emit('private', {
      message: data.message,
      from: { id: sender._id, name: sender.name },
    });
  }
}
