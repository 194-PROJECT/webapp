import type { UserAuth, Roles, Session, UserContext } from '$core/auth/auth.type';
import { ENCRYPTION_KEY, ALGORITHM } from '$env/static/private';

import * as crypto from 'crypto';
import type { Cookies, RequestEvent } from '@sveltejs/kit';

import fakeUsers from './test/user.json';
import fakeSession from './test/session.json';

/**
 * AuthService is responsible for handling authentication-related operations
 * such as login, signup, multi-factor authentication, password resets, etc.
 */
export default class AuthService {
	private static key: Buffer = Buffer.from(ENCRYPTION_KEY, 'utf-8');
	private static algorithm: string = ALGORITHM;

	/**
	 * Logs in a user with the provided email, username, and password.
	 * @param email - The email address of the user.
	 * @param username - The username of the user.
	 * @param password - The password of the user.
	 * @returns A promise that resolves to the authenticated user.
	 */
	public static async login(email: string, password: string, username?: string): Promise<void | UserContext> {
    const users: UserAuth[] = fakeUsers;
    const user = users.find((user) => {
      return user.email === email
    })

    if (!user) throw new Error('No user found!');

    const session: Session = {
			...fakeSession,
			roles: fakeSession.roles as Roles[],
			expires: new Date(fakeSession.expires)
		};

		return Promise.resolve({
      user: { ...user, email },
      session
    });
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
	public static async signup(
		email: string,
		username: string,
		password: string,
		firstName: string,
		lastName: string
	): Promise<UserContext> {
    const user: UserAuth = {
      id: Math.random() * (1_000_000 - 1) + 1,
      firstName: firstName,
      lastName: lastName,
      username: username,
      email: email,
      roles: ['user'],
      active: true,
      profilePictureUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1pEx6YKftEv7TSVGSzAllITjnbc-OIzQY3Q&s",
      createdAt: (new Date()).toDateString(),
      updatedAt: (new Date()).toDateString(),
    };
    const session: Session = {
			...fakeSession,
			roles: fakeSession.roles as Roles[],
			expires: new Date(fakeSession.expires)
		};

		return Promise.resolve({
      user: { ...user, email, username, firstName, lastName },
      session
    });
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
    const iv = new Uint8Array(16);
    crypto.getRandomValues(iv);
		const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
		let encrypted = iv.toString();
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
    if (!data || data.length < 16) {
        throw new Error('Invalid data');
    };

    const iv = Buffer.from(data.slice(0, 16), 'hex');
    const encrypted = Buffer.from(data.slice(16), 'hex');
    const decipher = crypto.createDecipheriv(AuthService.algorithm, AuthService.key, iv);
    let decrypted = decipher.update(encrypted).toString('utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}
