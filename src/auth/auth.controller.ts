import * as express from "express";
import { Body, Middlewares, Post, Request, Route, Security, Tags } from "tsoa";
import { validate } from "../middleware/validation.middleware";
import {
  IAuthPayload,
  IResetPasswordInput,
  ISignInInput,
  ISignUpInput,
  IVerifyPasswordResetToken,
} from "./auth.interface";
import authService from "./auth.service";
import { loginSchema, signupSchema } from "./auth.validation";

@Route("auth")
@Tags("Auth")
export class AuthController {
  @Post("/login")
  @Middlewares(validate(loginSchema))
  async login(@Body() body: ISignInInput): Promise<IAuthPayload> {
    return await authService.signin(body);
  }

  @Post("/signup")
  @Middlewares(validate(signupSchema))
  async register(@Body() body: ISignUpInput): Promise<IAuthPayload> {
    return await authService.signup(body);
  }

  @Post("/forgot-password")
  async forgotPassword(
    @Body() input: { email: string }
  ): Promise<{ success: boolean }> {
    return await authService.forgotPassword(input.email);
  }

  @Post("/verify-reset-token")
  async verifyPasswordResetToken(
    @Body() body: IVerifyPasswordResetToken
  ): Promise<{ success: boolean }> {
    return await authService.verifyResetToken(body);
  }

  @Post("/reset-password")
  async resetPassword(
    @Body() body: IResetPasswordInput
  ): Promise<{ success: boolean }> {
    return await authService.resetPassword(body);
  }

  @Post("/request-verification-mail")
  async requestVerificationMail(
    @Body() input: { email: string }
  ): Promise<{ success: boolean }> {
    return await authService.requestVerificationMail(input.email);
  }

  @Post("/confirm-email")
  async confirmEmail(@Body() body: IVerifyPasswordResetToken) {
    return await authService.confirmEmail(body);
  }

  @Post("/me")
  @Security("jwt")
  me(@Request() req: express.Request) {
    return req.user;
  }
}
