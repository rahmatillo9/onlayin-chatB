import { WebSocketGateway, SubscribeMessage, WebSocketServer, ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as dotenv from "dotenv";
import { ChatsService } from './chats.service';

dotenv.config();

const socketPort = process.env.SOCKET_PORT ? parseInt(process.env.SOCKET_PORT, 10) : 5005;

@WebSocketGateway(socketPort, { cors: { origin: "*" } })
export class ChatsGateway {
    @WebSocketServer() server: Server;

    constructor(private readonly chatsService: ChatsService) {}

    private onlineUsers = new Map<number, Set<string>>(); // userId -> Set of socketIds

    // 🔹 Foydalanuvchini onlayn qilish
    @SubscribeMessage('userOnline')
    handleUserOnline(@MessageBody() userId: number, @ConnectedSocket() client: Socket) {
        if (!this.onlineUsers.has(userId)) {
            this.onlineUsers.set(userId, new Set());
        }
        this.onlineUsers.get(userId)!.add(client.id);
        this.broadcastOnlineUsers();
    }

    // 🔹 Foydalanuvchi chatlarini olish
    @SubscribeMessage('getChats')
    async handleGetChats(@MessageBody() userId: number, @ConnectedSocket() client: Socket) {
        const chats = await this.chatsService.getChatsByUserId(userId);
        client.emit('chatsList', chats);
    }

    // 🔹 Yangi chat yaratish (agar mavjud bo‘lmasa)
    @SubscribeMessage('createChat')
    async handleCreateChat(@MessageBody() { user1Id, user2Id }: { user1Id: number, user2Id: number }) {
        const existingChats = await this.chatsService.getChatsByUserId(user1Id);
        const chatExists = existingChats.some(chat => (chat.user1Id === user2Id && chat.user2Id === user1Id) || 
                                                       (chat.user1Id === user1Id && chat.user2Id === user2Id));

        if (!chatExists) {
            const newChat = await this.chatsService.creatChat({ user1Id, user2Id });
            this.server.emit('newChat', newChat);
        }
    }

    // 🔹 Foydalanuvchi oflayn bo‘lishi
    @SubscribeMessage('userOffline')
    handleUserOffline(@MessageBody() userId: number, @ConnectedSocket() client: Socket) {
        this.removeSocket(userId, client.id);
    }

    // 🔹 Aloqani yo‘qotgan foydalanuvchini oflayn qilish
    handleDisconnect(client: Socket) {
        for (const [userId, sockets] of this.onlineUsers.entries()) {
            if (sockets.has(client.id)) {
                this.removeSocket(userId, client.id);
                break;
            }
        }
    }

    // 🔹 Foydalanuvchini offline qilish (ichki funksiya)
    private removeSocket(userId: number, socketId: string) {
        if (!this.onlineUsers.has(userId)) return;

        const sockets = this.onlineUsers.get(userId)!;
        sockets.delete(socketId);

        if (sockets.size === 0) {
            this.onlineUsers.delete(userId);
        }
        
        this.broadcastOnlineUsers();
    }

    // 🔹 Onlayn foydalanuvchilarni yangilash
    private broadcastOnlineUsers() {
        this.server.emit('onlineUsers', Array.from(this.onlineUsers.keys()));
    }
}
