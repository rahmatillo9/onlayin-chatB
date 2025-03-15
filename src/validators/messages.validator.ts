import { IsInt, IsNotEmpty, IsString } from "class-validator";


export class createMessageDto {
    @IsNotEmpty()
    @IsInt()
    chatId: number;

    @IsNotEmpty()
    @IsInt()
    receiverId: number;

    @IsNotEmpty()
    @IsInt()
    senderId: number;

    @IsNotEmpty()
    @IsString()
    message: string;
}