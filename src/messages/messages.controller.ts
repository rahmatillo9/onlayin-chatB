import { Body, Controller, Delete, Get, NotFoundException, Post } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { createMessageDto } from 'src/validators/messages.validator';
import { Message } from './messages.entity';

@Controller('messages')
export class MessagesController {
    constructor(
        private readonly service: MessagesService
    ){}

    @Post()
    async createMessage(@Body() dto: createMessageDto): Promise<Message>{
        return this.service.createMessage(dto);
    }

    @Get()
    async getAllMessages(): Promise<Message[]>{
        return this.service.getAllMessages();
    }

    @Get('user/:userId')
    async getMessagesByUser(@Body() userId: number): Promise<Message[]>{
        return this.service.getMessagesByUser(userId);
    }

    @Get('received/:receiverId')
    async getReceivedMessages(@Body() receiverId: number): Promise<Message[]>{
        return this.service.getReceivedMessages(receiverId);
    }

    @Get(':id')
    async getMessageById(@Body() id: number): Promise<Message>{
        const message = await this.service.getMessageById(id);
        if(!message){
            throw new NotFoundException(`Message with ID ${id} not found`);
        }
        return message;
    }

    @Delete(':id')
    async deleteMessage(@Body() id: number): Promise<void>{
        const isDeleted = await this.service.deleteMessage(id);
        if(!isDeleted){
            throw new NotFoundException(`Message with ID ${id} not found`);
        }

    }
}
