import { Expose, plainToClass } from '@nestjs/class-transformer';
import { plainToInstance } from 'class-transformer';

export abstract class BaseDto {
    @Expose()
    id: number

    @Expose()
    created_at: Date

    @Expose()
    updated_at: Date

    static plainToClass<T>(this: new  (...args: any[]) => T, obj: T) {
        return plainToInstance(this, obj, {excludeExtraneousValues: true})
    }
}