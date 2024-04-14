import { BadRequestException, HttpStatus, ValidationError } from "@nestjs/common";

export const  ValidationConfig = {
    whitelist: true,
    forbidNonWhitelisted: true,
    skipMissingProperties: false,
    errorHttpStatusCode: 422,
    exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(
            validationErrors.map((error) => ({
                field: error.property,
                error: Object.values(error.constraints).join(', '),
            })),
        );
    }
}