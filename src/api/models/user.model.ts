require('module-alias/register');

import * as Moment from 'moment-timezone';
import * as Jwt from 'jwt-simple';
import * as Bcrypt from 'bcrypt';
import { Entity, PrimaryGeneratedColumn, Column, BeforeUpdate, AfterLoad, BeforeInsert, OneToMany } from 'typeorm';
import { badImplementation } from '@hapi/boom';

import { JWT } from '@config/environment.config';
import { ROLE } from '@enums';
import { Role } from '@types';
import { Media } from '@models/media.model';
import { IModel } from '@interfaces';

@Entity()
export class User implements IModel {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 32,
    unique: true
  })
  username: string;

  @Column({
    length: 128,
    unique: true
  })
  email: string;

  @Column({
    length: 128
  })
  password: string;

  @Column({
    length: 64,
    unique: true
  })
  apikey: string;

  @Column({
    type: 'enum',
    enum: ROLE,
    default: ROLE.user
  })
  role: Role

  @OneToMany( () => Media, media => media.owner, {
    eager: true
  })
  medias: Media[];

  @Column({
    type: Date,
    default: Moment( new Date() ).format('YYYY-MM-DD HH:ss')
  })
  createdAt;

  @Column({
    type: Date,
    default: null
  })
  updatedAt;

  @Column({
    type: Date,
    default: null
  })
  deletedAt;

  /**
   * @description
   */
  private temporaryPassword;

  /**
   * @param payload Object data to assign
   */
  constructor(payload: Record<string, unknown>) {
    Object.assign(this, payload);
  }

  @AfterLoad()
  storeTemporaryPassword() : void {
    this.temporaryPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<string|boolean> {
    try {
      if (this.temporaryPassword === this.password) {
        return true;
      }
      this.password = await Bcrypt.hash(this.password, 10);
      return true;
    } catch (error) {
      throw badImplementation(error.message);
    }
  }

  /**
   * @description Check that password matches
   *
   * @param password
   */
  async passwordMatches(password: string): Promise<boolean> {
    return await Bcrypt.compare(password, this.password);
  }

  /**
   * @description Generate JWT token
   */
  token(): string {
    const payload = {
      exp: Moment().add(JWT.EXPIRATION, 'minutes').unix(),
      iat: Moment().unix(),
      sub: this.id
    };
    return Jwt.encode(payload, JWT.SECRET);
  }

  /**
   * @description Filter on allowed entity fields
   */
  get whitelist(): string[] {
    return [
      'id',
      'username',
      'email',
      'role',
      'createdAt' ,
      'updatedAt'
    ]
  }

}