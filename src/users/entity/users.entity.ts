import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  _id: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'email' })
  email: string;
}
