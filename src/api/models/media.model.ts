require('module-alias/register');

import * as Moment from 'moment';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import { MIME_TYPE, MIME_TYPE_ENUM } from '@enums/mime-type.enum';
import { User } from '@models/user.model';
import { IModel } from '@interfaces/IModel.interface';
import { whitelist } from '@serializers/whitelists/media.whitelist';
import { sanitize } from '@utils/sanitize.util';

/** FIXME Media fieldname management. Seems to be always 'media'. Check and add e2e tests */
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
    enum: MIME_TYPE_ENUM
  })
  mimetype: MIME_TYPE

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
  public whitelist(): Record<string,unknown> {
    return sanitize(whitelist, this);
  }
}