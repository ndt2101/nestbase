import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { IsUniqueConstraintInput } from './isUnique.validator';
import { EntityManager, Not } from 'typeorm';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'IsUniqueConstraint', async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly entityManager: EntityManager) {}

  async validate(value: any, args?: ValidationArguments): Promise<boolean> {
    const { tableName, column, isUpdate }: IsUniqueConstraintInput =
      args.constraints[0];
    let exists = true;
    if (isUpdate) {
      const id = args.object['context']['params']['id']
      exists = await this.entityManager
        .getRepository(tableName)
        .createQueryBuilder(tableName)
        .where({ [column]: value, id: Not(id) })
        .getExists();
    } else {
      exists = await this.entityManager
        .getRepository(tableName)
        .createQueryBuilder(tableName)
        .where({ [column]: value })
        .getExists();
    }

    return exists ? false : true;
  }

  defaultMessage?(validationArguments?: ValidationArguments): string {
    const { message }: IsUniqueConstraintInput =
      validationArguments.constraints[0];
    return message ? message : 'the record already exist';
  }
}
