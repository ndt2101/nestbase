import { Body, Controller, Post } from '@nestjs/common';
import { Public } from '@common/decorators/common.decorator';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/login')
    @Public()
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('/logout')
    logout() {
        return true
    }
}
