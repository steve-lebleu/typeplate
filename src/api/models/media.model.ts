require('module-alias/register');

import * as Moment from 'moment';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import { UPLOAD_MIME_TYPE } from '@enums/mime-type.enum';
import { User } from '@models/user.model';
import { IModelize } from '@interfaces/IModelize.interface';
import { whitelist } from '@serializers/whitelists/media.whitelist';
import { filter } from '@utils/serializing.util';

@Entity()
export class Media implements IModelize {

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
    enum: UPLOAD_MIME_TYPE
  })
  mimetype: 'application/vnd.ms-excel' | 'application/vnd.ms-powerpoint' | 'application/msword' | 'application/pdf' | 'application/vnd.oasis.opendocument.presentation' | 'application/vnd.oasis.opendocument.spreadsheet' | 'application/vnd.oasis.opendocument.text' | 'application/x-7z-compressed' | 'application/x-rar-compressed' | 'application/x-tar' | 'application/zip' | 'image/bmp' | 'image/gif' | 'image/jpg' | 'image/jpeg'| 'image/png' | 'text/csv'

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
  public whitelist(): IModelize {
    return filter(whitelist, this);
  }
}