import { IsNotEmpty, Length } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @Length(1, 100)
  username: string;

  @IsNotEmpty()
  @Length(6, 100)
  password: string;
}
