require('module-alias/register');

import * as Moment from 'moment-timezone';
import * as Jwt from 'jwt-simple';
import * as Bcrypt from 'bcrypt';
import { Entity, PrimaryGeneratedColumn, Column, BeforeUpdate, AfterLoad, BeforeInsert, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { badImplementation } from 'boom';

import { jwtSecret, jwtExpirationInterval } from '@config/environment.config';
import { ROLE } from '@enums/role.enum';
import { Media } from '@models/media.model';
import { IModelize } from '@interfaces/IModelize.interface';
import { whitelist } from '@whitelists/user.whitelist';
import { filter } from '@utils/serializing.util';
import { crypt } from '@utils/string.util';

@Entity()
export class User implements IModelize {

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
  role: 'admin' | 'user' | 'ghost'

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

  @BeforeInsert()
  @BeforeUpdate()
  async hashApiKey(): Promise<boolean> {
    try {
      this.apikey = crypt(this.email + jwtSecret, 64);
      return true;
    } catch (error) {
      throw badImplementation(error.message);
    }
  }

  /**
   *
   */
  token(): string {
    const payload = {
      exp: Moment().add(jwtExpirationInterval, 'minutes').unix(),
      iat: Moment().unix(),
      sub: this.id
    };
    return Jwt.encode(payload, jwtSecret);
  }

  /**
   *
   * @param password
   */
  async passwordMatches(password: string): Promise<boolean> {
    return Bcrypt.compare(password, this.password);
  }

  /**
   * @description Filter on allowed entity fields
   */
  public whitelist(): IModelize {
    return filter(whitelist, this);
  }

}