import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { IsPostgreUniqueConstraintInput } from './isPostgreUnique.validator';
import { EntityManager, Not } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { DB_CONNECTION } from '@common/constants/global.const';
import e from 'express';

@ValidatorConstraint({ name: 'IsPostgreUniqueConstraint', async: true })
@Injectable()
export class IsPostgreUniqueConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectEntityManager(DB_CONNECTION.DCIM)
    private readonly entityManager: EntityManager,
  ) {}

  async validate(value: any, args?: ValidationArguments): Promise<boolean> {
    const { tableName, column, isUpdate }: IsPostgreUniqueConstraintInput =
      args.constraints[0];
    const dataBody = Object.assign({}, args.object);
    let exists = true;
    if (!value) {
      return true
    }
    if (isUpdate) {
      const id = args.object['context']['params']['id'];
      const query = this.entityManager
        .getRepository(tableName)
        .createQueryBuilder(tableName)
        .where({ [column]: value, id: Not(id) });
      if (args.constraints.length > 1) {
        args.constraints.forEach((item, index) => {
          if (index > 0) {
            console.log('khong vao dayyyyyy')
            query.andWhere({ [item['column']]: dataBody[item['column']] });
          }
        });
      }

      exists = await query.getExists();
    } else {
      const query = this.entityManager
        .getRepository(tableName)
        .createQueryBuilder(tableName)
        .where({ [column]: value });

      if (args.constraints.length > 1) {
        args.constraints.forEach((item, index) => {
          if (index > 0) {
            query.andWhere({ [item['column']]: dataBody[item['column']] });
          }
        });
      }

      exists = await query.getExists();
    }
    return exists ? false : true;
  }

  defaultMessage?(validationArguments?: ValidationArguments): string {
    const { message }: IsPostgreUniqueConstraintInput =
      validationArguments.constraints[0];
    return message ? message : 'the record already exist';
  }
}
