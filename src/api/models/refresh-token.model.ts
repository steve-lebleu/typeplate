import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { User } from "@models/user.model";

@Entity()
export class RefreshToken {

  /**
   * 
   * @param token 
   * @param user 
   * @param expires 
   */
  constructor(token: String, user: User, expires: Date) 
  { 
    this.token = token;
    this.expires = expires;
    this.user = user;
  }

  @PrimaryGeneratedColumn()
  id: Number;

  @Column()
  token: String;

  @OneToOne(type => User, { 
    eager : true,
    onDelete: "CASCADE" // Remove refresh-token when user is deleted
   })
  @JoinColumn()
  user: User;

  @Column()
  expires: Date;
}