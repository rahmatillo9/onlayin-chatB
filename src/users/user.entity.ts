import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Chat } from "src/chats/chats.entity";
import { Message } from "src/messages/messages.entity";
import { Session } from "src/sessions/sessions.entity";

@Table({
  tableName: "users3",
  timestamps: true,
})
export class User extends Model<User> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  username!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email!: string;

  @Column({
    type: DataType.ENUM('customer', 'admin'),
    allowNull: false,
    defaultValue: 'customer',
  })
  role!: string;

  @Column({
    
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  profile_image?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  bio!: string;

  // 📌 Email tasdiqlash uchun
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isVerified!: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  verificationCode?: string;

  // 📌 Parolni qayta tiklash uchun kod
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  resetCode?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false, // ❌ Standart holatda email tasdiqlanmagan
  })
  isEmailConfirmed!: boolean;
  
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  emailConfirmationToken?: string;

  @HasMany(() => Message, 'senderId')
  sender?: Message[];

  @HasMany(() => Message, 'receiverId')
  receiver?: Message[];

  @HasMany(() => Chat, 'user1Id')
  user1: Chat[];

  @HasMany(() => Chat, 'user2Id')
  user2: Chat[];
  
  @HasMany(() => Session, 'userId')
  session: Session[];
  
  
}
