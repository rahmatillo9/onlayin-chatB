import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "src/users/user.entity";

@Table({
    tableName: "sessions",
    timestamps: true,
})
export class Session extends Model<Session> {
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    userId!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true, // ✅ Tokenlar takrorlanmasligi kerak
    })
    token!: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW, // ✅ Sessiyaning yaratilgan vaqtini saqlash
    })
    declare createdAt: Date;

    @Column({
        type: DataType.DATE,
        allowNull: true, // ✅ Bu sessiya qachon tugashini ko‘rsatish uchun
    })
    expiresAt?: Date;

    @BelongsTo(() => User, 'userId')
    user!: User;
}
