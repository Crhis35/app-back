import { InternalServerErrorException } from '@nestjs/common';
import {
  ObjectType,
  Field,
  InputType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { IsBoolean, IsEmail, IsEnum, IsString } from 'class-validator';

export enum UserRole {
  VISITOR = 'VISITOR',
  PLACE = 'PLACE',
}

registerEnumType(UserRole, {
  name: 'UserRole',
});

@ObjectType()
@InputType('UserInputType', { isAbstract: true })
@Entity()
export class User extends CoreEntity {
  @Field(() => String)
  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Field()
  @Column({ select: false })
  @IsString()
  password: string;

  @Field(() => UserRole)
  @Column({ type: 'enum', enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @Field(() => Boolean)
  @Column({ default: false })
  @IsBoolean()
  verified: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 12);
      } catch (error) {
        console.error(error);
        throw new InternalServerErrorException();
      }
    }
  }

  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(aPassword, this.password);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }
}
