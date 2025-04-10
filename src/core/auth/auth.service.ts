import { type UserAuth, UserRole, type Session, type UserContext, type UserContextGetResponse, routeRoleAccess } from '$core/auth/auth.type';
import { ENCRYPTION_KEY, ALGORITHM } from '$env/static/private';

import * as crypto from 'crypto';
import type { Cookies, RequestEvent } from '@sveltejs/kit';

import fakeSession from './test/session.json';
import type { Requests } from '$core/backend/request.type';
import { RequestType } from '$core/backend/request.type';
import { HttpClient } from '$core/protocols/http-client';
import type { Response } from '$core/backend/response.type';
import type { User } from '$datastores/user/user.type';

type LoginRequest = {
  email?: string;
  username?: string;
  password: string;
}

type SignupRequest = {
  email: string;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  program_id: number;
  student_id: string;
}

/**
 * AuthService is responsible for handling authentication-related operations
 * such as login, signup, multi-factor authentication, password resets, etc.
 */
export default class AuthService {
	private static key: Buffer = Buffer.from(ENCRYPTION_KEY, 'base64');
	private static algorithm: string = ALGORITHM;

	/**
	 * Logs in a user with the provided email, username, and password.
	 * @param email - The email address of the user.
	 * @param username - The username of the user.
	 * @param password - The password of the user.
	 * @returns A promise that resolves to the authenticated user.
	 */
	public static async login({
    email,
		password,
    cookies,
    locals,
		username,
  }: {
    email: string;
    password: string;
    cookies: Cookies;
    locals: App.Locals;
    username?: string;
  }): Promise<Response<UserContextGetResponse> | void> {
		const encryptedPassword = AuthService.encrypt(password);

		const request: Requests<LoginRequest>[RequestType.PUSH] = {
			route: '/login',
			headers: new Headers(),
			body: {
				email: email,
				username: username,
				password: encryptedPassword
			}
		};

		const response = await HttpClient.request<LoginRequest, UserContextGetResponse>(
			request,
			RequestType.PUSH,
			cookies,
			locals
		);

    if (!response) throw new Error('Invalid response');

		return Promise.resolve(response);
	}

	/**
	 * Logs out the current user by clearing the session and user cookies.
	 * @param event - The request event
	 */
	public static async logout(event: RequestEvent): Promise<void> {
		event.locals.session = undefined;
		event.locals.user = undefined;
		event.cookies.delete('session', { path: '/' });
		event.cookies.delete('user', { path: '/' });
	}

	/**
	 * Signs up a new user with the provided details.
	 * @param email - The email address of the user.
	 * @param username - The username of the user.
	 * @param password - The password of the user.
	 * @param firstName - The first name of the user.
	 * @param lastName - The last name of the user.
	 * @returns A promise that resolves to the newly created user.
	 */
	public static async signup({
    email,
    username,
    password,
    firstName,
    lastName,
    programId,
    studentId,
    cookies,
    locals,
  }: {
    email: string,
		username: string,
		password: string,
		firstName: string,
		lastName: string,
    programId: number,
    studentId: string,
    cookies: Cookies,
    locals: App.Locals
  }): Promise<Response<UserContextGetResponse> | void> {
    const encryptedPassword = AuthService.encrypt(password);

    const request: Requests<SignupRequest>[RequestType.PUSH] = {
      route: '/signup',
      headers: new Headers(),
      body: {
        email: email,
        username: username,
        password: encryptedPassword,
        first_name: firstName,
        last_name: lastName,
        program_id: programId,
        student_id: studentId,
      }
    };

    const response = await HttpClient.request<SignupRequest, UserContextGetResponse>(
			request,
			RequestType.PUSH,
			cookies,
			locals
    );

    if (!response) throw new Error('Invalid response');

    return Promise.resolve(response);
	}

	/**
	 * Validates the format of an email address.
	 * @param email - The email address to validate.
	 * @returns True if the email address is valid, false otherwise.
	 */
	static isValidEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	/**
	 * Encrypts the provided password.
	 * @param data - the data to encrypt.
	 * @returns The encrypted password as a hexadecimal string.
	 */
	static encrypt(data: string): string {
		const iv = crypto.randomBytes(16);
		const cipher = crypto.createCipheriv(AuthService.algorithm, AuthService.key, iv);
		let encrypted = iv.toString('hex');
		encrypted += cipher.update(data, 'utf8', 'hex');
		encrypted += cipher.final('hex');

		return encrypted;
	}

	/**
	 * Decrypts the provided data.
	 * @param data - The data to decrypt.
	 * @returns The decrypted data as a string.
	 * @throws An error if the data cannot be decrypted.
	 */
	static decrypt(data: string): string {
		if (!data || data.length < 32) {
			throw new Error('Invalid data');
		}

		const iv = Buffer.from(data.slice(0, 32), 'hex');
		const encrypted = Buffer.from(data.slice(32), 'hex');
		const decipher = crypto.createDecipheriv(AuthService.algorithm, AuthService.key, iv);
		let decrypted = decipher.update(encrypted).toString('utf8');
		decrypted += decipher.final('utf8');

		return decrypted;
	}

  /**
   * Gets the user role access for a specific route. 
   *
   * @param currentRoute - The current route object.
   * @returns 
   */
  static getRouteRoleAccess(currentRoute: {id: string}): UserRole[] {
    for (const route of Object.keys(routeRoleAccess) as Array<keyof typeof routeRoleAccess>) {
      if (currentRoute.id.startsWith(route)) {
        return routeRoleAccess[route];
      }
    }

    return [];
  }

  static hasAccess(currentRoute: {id: string}, user: User): boolean {
    const routeAccess = AuthService.getRouteRoleAccess(currentRoute);
    return routeAccess.includes(user.role);
  }
}
