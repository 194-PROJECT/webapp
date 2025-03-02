import type { Cookies } from '@sveltejs/kit';

/**
 * A singleton class to manage browser cookies.
 *
 * The `CookieManager` class provides methods to set, get, and delete cookies.
 * It also allows setting and deleting multiple cookies at once.
 *
 * @example
 * // Get the singleton instance of CookieManager
 * const cookieManager = CookieManager.getInstance();
 *
 * // Set a cookie
 * cookieManager.set('username', 'john_doe', 7 * 24 * 60 * 60 * 1000); // 1 week expiration
 *
 * // Get a cookie
 * const username = cookieManager.get('username');
 *
 * // Delete a cookie
 * cookieManager.delete('username');
 *
 * // Set multiple cookies
 * cookieManager.setAll({ theme: 'dark', language: 'en' }, 7 * 24 * 60 * 60 * 1000); // 1 week expiration
 *
 * // Delete all cookies
 * cookieManager.deleteAll();
 */
export class CookieManager {
	private cookies: Cookies;

	public constructor(cookies: Cookies) {
		this.cookies = cookies;
	}

	/**
	 * Sets a cookie with the given name, value, and expiration time.
	 *
	 * @param name - The name of the cookie.
	 * @param value - The value of the cookie.
	 * @param expire - The expiration time in milliseconds.
	 */
	public set(name: string, value: string, expire: number): void {
		const date = new Date();
		date.setTime(date.getTime() + expire);
		this.cookies.set(name, value, {
			expires: date,
			path: '/'
		});
	}

	/**
	 * Gets the value of a cookie by its name.
	 *
	 * @param name - The name of the cookie.
	 * @returns The value of the cookie, or null if the cookie does not exist.
	 */
	public get(name: string): any {
		const value = this.cookies.get(name);

		if (!value) return value;

		try {
			return JSON.parse(value);
		} catch {
			if (value === 'true' || value === 'false') return value === 'true';
			if (!isNaN(Number(value))) return Number(value);
			return value;
		}
	}

	/**
	 * Deletes a cookie by setting its expiration date to a past date.
	 *
	 * @param name - The name of the cookie to delete.
	 */
	public delete(name: string): void {
		this.cookies.delete(name, { path: '/' });
	}

	/**
	 * Sets multiple cookies with the given expiration time.
	 *
	 * @param cookies - An object containing cookie names and values.
	 * @param expire - The expiration time in milliseconds.
	 */
	public setAll(cookies: Record<string, any>, expire: number): void {
		Object.entries(cookies).forEach(([name, value]) => {
			this.set(name, value, expire);
		});
	}

	/**
	 * Gets all cookies.
	 *
	 * @returns An object containing all cookies.
	 */
	public getAll(): Record<string, any> {
		const allCookies: Record<string, any> = {};
		this.cookies.getAll().forEach(({ name, value }, _) => {
			allCookies[name] = this.get(name);
		});
		return allCookies;
	}

	/**
	 * Deletes all cookies.
	 */
	public deleteAll(): void {
		this.cookies.getAll().forEach(({ name, value }, _) => {
			this.delete(name);
		});
	}
}
