import { IsInt, IsNotEmpty } from "class-validator";


export class createChatDto {
    @IsNotEmpty()
    @IsInt()
    user1Id: number;

    @IsNotEmpty()
    @IsInt()
    user2Id: number;
}