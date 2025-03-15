import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "src/users/user.entity";
import { Chat } from "src/chats/chats.entity"; // ✅ Chat modelini qo‘shdik

@Table({
    tableName: "messages",
    timestamps: true,
})
export class Message extends Model<Message> {
    @ForeignKey(() => Chat)
    @Column({
        type: DataType.INTEGER, 
        allowNull: false,
    })
    chatId!: number; // ✅ Har bir xabar qaysi chatga tegishli ekanini ko‘rsatish uchun

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    senderId!: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    receiverId!: number;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    content!: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    })
    seen!: boolean;

    @Column({
        type: DataType.DATE, 
        allowNull: true, // ✅ Agar hali ko‘rilmagan bo‘lsa, null bo‘lishi mumkin
    })
    seenAt!: Date | null; // ✅ Xabar qachon ko‘rilganini saqlash uchun

    @BelongsTo(() => Chat)
    chat!: Chat; // ✅ Chat modeli bilan bog‘lash

    @BelongsTo(() => User, 'senderId')
    sender!: User;

    @BelongsTo(() => User, 'receiverId')
    receiver!: User;
}
