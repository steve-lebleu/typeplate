require('module-alias/register');

import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from '@models/user.model';

@Entity()
export class RefreshToken {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @OneToOne(type => User, {
    eager : true,
    onDelete: 'CASCADE' // Remove refresh-token when user is deleted
   })
  @JoinColumn()
  user: User;

  @Column()
  expires: Date;

  /**
   *
   * @param token
   * @param user
   * @param expires
   */
  constructor(token: string, user: User, expires: Date) {
    this.token = token;
    this.expires = expires;
    this.user = user;
  }
}