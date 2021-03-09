require('module-alias/register');

import * as Moment from 'moment-timezone';
import * as Jwt from 'jwt-simple';
import * as Bcrypt from 'bcrypt';
import { Entity, PrimaryGeneratedColumn, Column, BeforeUpdate, AfterLoad, BeforeInsert, OneToMany } from 'typeorm';
import { badImplementation } from '@hapi/boom';

import { jwtSecret, jwtExpirationInterval } from '@config/environment.config';
import { ROLE, ROLES } from '@enums/role.enum';
import { Media } from '@models/media.model';
import { IModel } from '@interfaces/IModel.interface';
import { whitelist } from '@whitelists/user.whitelist';
import { sanitize } from '@utils/sanitize.util';
import { crypt } from '@utils/string.util';

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
    enum: ROLES,
    default: ROLES.user
  })
  role: ROLE

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
  hashApiKey(): boolean {
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
    return await Bcrypt.compare(password, this.password);
  }

  /**
   * @description Filter on allowed entity fields
   */
  public whitelist(): Record<string,unknown> {
    return sanitize(whitelist, this);
  }

}