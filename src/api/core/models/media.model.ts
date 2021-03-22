require('module-alias/register');

import * as Moment from 'moment';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import { MIME_TYPE } from '@enums';
import { User } from '@models/user.model';
import { IModel } from '@interfaces';

import { MimeType } from '@types';

@Entity()
export class Media implements IModel {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: String,
    length: 32
  })
  fieldname;

  @Column({
    type: String,
    length: 128
  })
  filename;

  @Column()
  path: string;

  @Column()
  url: string;

  @Column({
    type: 'enum',
    enum: MIME_TYPE
  })
  mimetype: MimeType

  @Column({
    type: Number
  })
  size;

  @ManyToOne(type => User, user => user.medias, {
    onDelete: 'CASCADE' // Remove all documents when user is deleted
  })
  owner: User;

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
   * @param payload Object data to assign
   */
  constructor(payload: Record<string,unknown>) {
    Object.assign(this, payload);
  }

  /**
   * @description Filter on allowed entity fields
   */
   get whitelist(): string[] {
    return [
      'id',
      'fieldname',
      'filename',
      'path',
      'mimetype',
      'url',
      'size',
      'createdAt',
      'updatedAt',
      'owner'
    ];
  }

}