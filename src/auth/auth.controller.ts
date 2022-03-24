import { User } from "@prisma/client";
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
  /**
   * Login route
   * @param body
   * @param body.email Email of the user
   * @param body.password Password of the user
   *
   */
  @Post("/login")
  @Middlewares(validate(loginSchema))
  async login(@Body() body: ISignInInput): Promise<IAuthPayload> {
    return await authService.signin(body);
  }

  /**
   * Signup route
   * @param body
   * @param body.email Email of the user
   * @param body.password Password of the user
   * @param body.name Name of the user
   */
  @Post("/signup")
  @Middlewares(validate(signupSchema))
  async register(@Body() body: ISignUpInput): Promise<IAuthPayload> {
    return await authService.signup(body);
  }

  /**
   * Forgot password route. An email will be sent to the user with a link to reset his password.
   * @param body
   * @param body.email Email of the user
   */
  @Post("/forgot-password")
  async forgotPassword(
    @Body() input: { email: string }
  ): Promise<{ success: boolean }> {
    return await authService.forgotPassword(input.email);
  }

  /**
   * Verify password reset token.
   * Confirm if the reset token is valid before changing the password.
   * @param body
   * @param body.token Token to verify
   * @param body.email Email of the user
   */
  @Post("/verify-password-reset-token")
  async verifyPasswordResetToken(
    @Body() body: IVerifyPasswordResetToken
  ): Promise<{ success: boolean }> {
    return await authService.verifyResetToken(body);
  }

  /**
   * Reset password. This route is only accessible to the user who has a valid reset token.
   * The user will be able to change his password.
   * @param body
   * @param body.token Reset token
   * @param body.password New password
   * @param body.password2 Password confirmation
   * @param body.email Email of the user
   */
  @Post("/reset-password")
  async resetPassword(
    @Body() body: IResetPasswordInput
  ): Promise<{ success: boolean }> {
    return await authService.resetPassword(body);
  }

  /**
   * Send a verification email to the user after signup.
   * User can also request a new verification email.
   * An email will be sent to the user with a link to confirm his email.
   * @param body
   * @param body.email Email of the user
   */
  @Post("/request-verification-mail")
  async requestVerificationMail(
    @Body() input: { email: string }
  ): Promise<{ success: boolean }> {
    return await authService.requestVerificationMail(input.email);
  }

  /**
   * Confirm user email. Check if the user has a valid token and confirm his email.
   * @param body
   * @param body.token Token to verify
   * @param body.email Email of the user
   */
  @Post("/confirm-email")
  async confirmEmail(
    @Body() body: IVerifyPasswordResetToken
  ): Promise<{ success: boolean }> {
    return await authService.confirmEmail(body);
  }

  /**
   * Get the current user.
   */
  @Post("/me")
  @Security("jwt")
  me(@Request() req: express.Request): Omit<User, "passwordHash"> {
    return req.user;
  }
}
