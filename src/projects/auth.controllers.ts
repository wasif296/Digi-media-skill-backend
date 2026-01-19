import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';

@Controller('auth')
export default class AuthController {
  @Post('login')
  async login(@Body() body: any) {
    const { email, password } = body;

    if (
      email === process.env.ADMIN_EMAIL && 
      password === process.env.ADMIN_PASSWORD
    ) {
      return { success: true, message: 'Authentication Successful' };
    }

    throw new UnauthorizedException('Invalid Access Key');
  }
}