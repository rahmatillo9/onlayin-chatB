import { WebSocketGateway, SubscribeMessage, WebSocketServer, OnGatewayDisconnect, ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SessionsService } from './sessions.service';
import * as dotenv from "dotenv";

dotenv.config();

const socketPort = process.env.SOCKET_PORT ? parseInt(process.env.SOCKET_PORT, 10) : 5005;

@WebSocketGateway(socketPort, { cors: true })
export class SessionsGateway implements OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    private activeUsers = new Map<number, string>(); // userId -> socketId

    constructor(private readonly sessionsService: SessionsService) {}

    // 🔹 Foydalanuvchi tizimga kirganida sessiya yaratish va onlayn status berish
    @SubscribeMessage('login')
    async handleLogin(@MessageBody() userId: number, @ConnectedSocket() client: Socket) {
        this.activeUsers.set(userId, client.id);
        await this.sessionsService.createSession({ userId, token: client.id });

        this.server.emit('userLoggedIn', { userId, message: 'User logged in' });
        this.server.emit('onlineUsers', Array.from(this.activeUsers.keys())); // Onlayn userlar ro‘yxati
    }

    // 🔹 Foydalanuvchi tizimdan chiqqanda sessiyasini o‘chirish va oflayn qilish
    @SubscribeMessage('logout')
    async handleLogout(@MessageBody() userId: number) {
        await this.sessionsService.deleteAllSessionsByUser(userId);
        this.activeUsers.delete(userId);

        this.server.emit('userLoggedOut', { userId, message: 'User logged out' });
        this.server.emit('onlineUsers', Array.from(this.activeUsers.keys())); // Yangilangan onlayn userlar
    }

    // 🔹 Foydalanuvchi dasturni yopib chiqib ketganda
    async handleDisconnect(client: Socket) {
        let disconnectedUserId: number | null = null;

        // 🔍 Qaysi user chiqib ketganini topamiz
        for (const [userId, socketId] of this.activeUsers.entries()) {
            if (socketId === client.id) {
                disconnectedUserId = userId;
                this.activeUsers.delete(userId);
                break;
            }
        }

        if (disconnectedUserId !== null) {
            await this.sessionsService.deleteAllSessionsByUser(disconnectedUserId);
            this.server.emit('userLoggedOut', { userId: disconnectedUserId, message: 'User disconnected' });
            this.server.emit('onlineUsers', Array.from(this.activeUsers.keys()));
        }
    }

    // 🔹 Foydalanuvchining barcha sessiyalarini olish (real-time ma'lumot)
    @SubscribeMessage('getActiveSessions')
    async handleGetActiveSessions(@ConnectedSocket() client: Socket) {
        const onlineUsers = Array.from(this.activeUsers.keys());
        client.emit('onlineUsers', onlineUsers);
    }
}
