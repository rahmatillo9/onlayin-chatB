import { 
    BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table, BeforeCreate 
} from "sequelize-typescript";
import { Message } from "src/messages/messages.entity";
import { User } from "src/users/user.entity";

@Table({
    tableName: "chats",
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['user1Id', 'user2Id'], // ✅ Unique constraint
        }
    ]
})
export class Chat extends Model<Chat> {
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    user1Id!: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    user2Id!: number;

    @BelongsTo(() => User, 'user1Id')
    user1!: User;

    @BelongsTo(() => User, 'user2Id')   
    user2!: User;

    @HasMany(() => Message)
    messages!: Message[];

    /** 
     * ✅ Ikkita foydalanuvchi chat yaratishdan oldin tartibni tekshirish uchun hook
     */
    @BeforeCreate
    static async beforeCreateHook(chat: Chat) {
        if (chat.user1Id > chat.user2Id) {
            [chat.user1Id, chat.user2Id] = [chat.user2Id, chat.user1Id]; // Tartibni to‘g‘rilaymiz
        }
    }
}
