require('module-alias/register');

import * as Dayjs from 'dayjs';
import * as Jwt from 'jwt-simple';
import * as Bcrypt from 'bcrypt';
import { Entity, PrimaryGeneratedColumn, Column, BeforeUpdate, AfterLoad, BeforeInsert, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { badImplementation } from '@hapi/boom';

import { ACCESS_TOKEN } from '@config/environment.config';
import { ROLE, STATUS } from '@enums';
import { Role, Status } from '@types';
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

  @OneToOne(() => Media, { nullable: true })
  @JoinColumn()
  avatar: Media;

  @Column({
    length: 128,
    unique: true
  })
  email: string;

  @Column({
    type: 'enum',
    enum: STATUS,
    default: STATUS.REGISTERED
  })
  status: Status;

  @Column({
    length: 128
  })
  password: string;

  @Column({
    length: 128,
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
    default: Dayjs( new Date() ).format('YYYY-MM-DD HH:ss')
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
      throw badImplementation();
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
   * @description Generate JWT access token
   */
   token(duration: number = null): string {
    const payload = {
      exp: Dayjs().add(duration || ACCESS_TOKEN.DURATION, 'minutes').unix(),
      iat: Dayjs().unix(),
      sub: this.id
    };
    return Jwt.encode(payload, ACCESS_TOKEN.SECRET);
  }

  /**
   * @description Filter on allowed entity fields
   */
  get whitelist(): string[] {
    return [
      'id',
      'username',
      'avatar',
      'email',
      'role',
      'createdAt' ,
      'updatedAt'
    ]
  }

}