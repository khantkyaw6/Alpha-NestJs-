import { Entity, BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({
    comment: 'The user unique identifier',
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    comment: 'The name of the user',
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    comment: 'The email of the user',
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 15,
    comment: 'The phone number of the user',
  })
  phone: string;

  @Column({
    type: 'enum',
    enum: ['male', 'female'],
    default: 'male',
    comment: 'The gender of the user',
  })
  gender: 'male' | 'female';

  @Column({
    type: 'varchar',
    length: 255,
    comment: 'The password of the user',
    nullable: true,
  })
  password: string | null;

  @Column({
    type: 'boolean',
    default: false,
    comment: 'Indicates if the user is deleted',
  })
  isDeleted: boolean;
}
