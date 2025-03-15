import { Body, Controller, Delete, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { createChatDto } from 'src/validators/chats.validator';
import { Chat } from './chats.entity';

@Controller('chats')
export class ChatsController {
    constructor(private readonly service: ChatsService){}

    @Post()
    async createChat(@Body() dto: createChatDto): Promise<Chat>{
        return this.service.creatChat(dto);
    }

    @Get(':id')
    async getChatById(@Param('id') id: number): Promise<Chat>{
        const chat = await this.service.getChatById(id);
        if(!chat){
            throw new NotFoundException(`Chat with ID ${id} not found`);
        }
        return chat
    }

    @Get('user/:userId')
    async getChatsByUserId(@Param('userId') userId: number): Promise<Chat[]>{
        const chatU = await this.service.getChatsByUserId(userId);
        if(!chatU){
            throw new NotFoundException(`Chat with ID ${userId} not found`);
        }
        return chatU
    }

    @Delete(':id')
    async deleteChat(@Param('id') id: number): Promise<void>{
        const isDeleted = await this.service.deleteChat(id);
        if(!isDeleted){
            throw new NotFoundException(`Chat with ID ${id} not found`);
        }
    }
}
