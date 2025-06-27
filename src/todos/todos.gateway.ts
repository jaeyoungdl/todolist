import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/socket.io',
})
export class TodosGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('TodosGateway');

  handleConnection(client: Socket) {
    this.logger.log(`클라이언트 연결됨: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`클라이언트 연결 해제됨: ${client.id}`);
  }

  // 할 일 생성 알림
  notifyTodoCreated(todo: any) {
    this.server.emit('todoCreated', todo);
    this.logger.log(`할 일 생성 알림: ${todo.title}`);
  }

  // 할 일 업데이트 알림
  notifyTodoUpdated(todo: any) {
    this.server.emit('todoUpdated', todo);
    this.logger.log(`할 일 업데이트 알림: ${todo.title}`);
  }

  // 할 일 삭제 알림
  notifyTodoDeleted(todoId: string) {
    this.server.emit('todoDeleted', { id: todoId });
    this.logger.log(`할 일 삭제 알림: ${todoId}`);
  }

  // 할 일 상태 변경 알림
  notifyTodoStatusChanged(todo: any) {
    this.server.emit('todoStatusChanged', todo);
    this.logger.log(`할 일 상태 변경 알림: ${todo.title} -> ${todo.status}`);
  }
} 