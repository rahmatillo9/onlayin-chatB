import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class createSessionDto {
    @IsNotEmpty()
    @IsString()
    token: string;

    @IsNotEmpty()
    @IsInt()
    userId: number;
}