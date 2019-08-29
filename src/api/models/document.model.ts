require('module-alias/register');
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { UPLOAD_MIME_TYPE } from "@enums/mime-type.enum";
import { User } from "@models/user.model";
import { IModelize } from "@interfaces/IModelize.interface";
import { whitelist } from '@whitelists/document.whitelist';
import { filter } from '@utils/serializing.util';
import * as Moment from "moment";

@Entity()
export class Document implements IModelize {

  /**
   * @param payload Object data to assign
   */
  constructor(payload: Object ) { Object.assign(this, payload); }

  @PrimaryGeneratedColumn()
  id: Number;

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
  path: String;

  @Column({
    type: "enum",
    enum: UPLOAD_MIME_TYPE
  })
  mimetype: "application/vnd.ms-excel" | "application/vnd.ms-powerpoint" | "application/msword" | "application/pdf" | "application/vnd.oasis.opendocument.presentation" | "application/vnd.oasis.opendocument.spreadsheet" | "application/vnd.oasis.opendocument.text" | "application/x-7z-compressed" | "application/x-rar-compressed" | "application/x-tar" | "application/zip" | "image/bmp" | "image/gif" | "image/jpg" | "image/jpeg"| "image/png" | "text/csv"

  @Column({
    type: Number
  })
  size;

  @ManyToOne(type => User, user => user.documents, {
    onDelete: "CASCADE" // Remove all documents when user is deleted
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

  public whitelist() {
    return filter(whitelist, this);
  }
}