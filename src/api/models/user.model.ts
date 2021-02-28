require('module-alias/register');
import { Entity, PrimaryGeneratedColumn, Column, BeforeUpdate, AfterLoad, BeforeInsert, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { jwtSecret, jwtExpirationInterval } from '@config/environment.config';
import { ROLE } from '@enums/role.enum';
import { Document } from '@models/document.model';
import { IModelize } from '@interfaces/IModelize.interface';
import { whitelist } from '@whitelists/user.whitelist';
import { filter } from '@utils/serializing.util';
import { crypt } from '@utils/string.util';

import * as Moment from 'moment-timezone';
import * as Jwt from 'jwt-simple';
import * as Bcrypt from 'bcrypt';
import * as Boom from 'boom';

@Entity()
export class User implements IModelize {

  /**
   * @param payload Object data to assign
   */
  constructor(payload: Object) {
 Object.assign(this, payload);
}

  private temporaryPassword;

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
  role: 'admin' | 'user'

  @OneToMany( () => Document, document => document.owner, {
    eager: true
  })
  documents: Document[];

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

  @AfterLoad()
  storeTemporaryPassword() : void {
    this.temporaryPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    try {
      if (this.temporaryPassword === this.password) {
        return true;
      }
      this.password = await Bcrypt.hash(this.password, 10);
      return true;
    } catch (error) {
 throw Boom.badImplementation(error.message);
}
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashApiKey() {
    try {
      this.apikey = crypt(this.email + jwtSecret, 64);
      return true;
    } catch (error) {
 throw Boom.badImplementation(error.message);
}
  }

  /**
   *
   */
  token() {
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

  public whitelist() {
 return filter(whitelist, this);
}

}