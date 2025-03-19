import { WebSocketGateway, SubscribeMessage, WebSocketServer, ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';
import { createMessageDto } from 'src/validators/messages.validator';
import * as dotenv from "dotenv";

dotenv.config();

// const socketPort = process.env.SOCKET_PORT ? parseInt(process.env.SOCKET_PORT, 10) : 5005;

@WebSocketGateway(5005, { cors: "*" })
export class MessagesGateway {
    @WebSocketServer() server: Server;
    
    private userRooms = new Map<number, string>(); // userId -> socketId

    constructor(private readonly messagesService: MessagesService) {}

    // 🔹 Foydalanuvchini chatga ulash
    @SubscribeMessage('joinChat')
    async joinChat(@MessageBody() userId: number, @ConnectedSocket() client: Socket) {
        this.userRooms.set(userId, client.id);
        client.join(`user-${userId}`);
    }

    // 🔹 Yangi xabar jo‘natish
    @SubscribeMessage('sendMessage')
    async sendMessage(@MessageBody() dto: createMessageDto, @ConnectedSocket() client: Socket) {
        const message = await this.messagesService.createMessage(dto); // Xabarni saqlaymiz
    
        this.server.to(`user-${dto.receiverId}`).emit('newMessage', message);
        this.server.to(`user-${dto.senderId}`).emit('newMessage', message);
    }
    

    @SubscribeMessage('getMessages')
async getMessages(@MessageBody() chatId: number, @ConnectedSocket() client: Socket) {
    const messages = await this.messagesService.getMessagesByChatId(chatId);
    client.emit('loadMessages', messages);
}


    // 🔹 Xabarni "ko‘rildi" qilish
    @SubscribeMessage('markAsSeen')
    async markAsSeen(@MessageBody() messageId: number) {
        const message = await this.messagesService.markAsSeen(messageId);

        if (message) {
            // 🔹 Xabarni jo‘natuvchiga ko‘rildi deb xabar berish
            this.server.to(`user-${message.senderId}`).emit('messageSeen', { messageId });
        }
    }

    // 🔹 Xabarni o‘chirish
    @SubscribeMessage('deleteMessage')
    async deleteMessage(@MessageBody() messageId: number) {
        // Avval xabarni topamiz
        const message = await this.messagesService.getMessageById(messageId);
    
        if (!message) {
            return; // Xabar topilmasa hech narsa qilmaymiz
        }
    
        // Xabarni bazadan o‘chirib tashlaymiz
        await this.messagesService.deleteMessage(messageId);
    
        // Foydalanuvchilarga xabarni o‘chirilgani haqida jo‘natamiz
        this.server.to(`user-${message.receiverId}`).emit('messageDeleted', { messageId });
        this.server.to(`user-${message.senderId}`).emit('messageDeleted', { messageId });
    }
    
}
