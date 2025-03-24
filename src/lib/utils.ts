import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function camelToSnakeCase(str: string): string {
  return str.replace(/([A-Z])/g, "_$1").toLowerCase();
}

export function transformCamelKeysToSnakeCase<T extends Record<string, any>>(obj: T): Record<string, any> {
  return Object.keys(obj).reduce((acc, key) => {
    const snakeKey = camelToSnakeCase(key);
    acc[snakeKey] = obj[key]; 
    return acc;
  }, {} as Record<string, any>);
}

export function camelToParagraph(str: string): string {
  return str.replace(/([A-Z])/g, " $1").toLowerCase();
}

export function transformCamelKeysToParagraph<T extends Record<string, any>>(obj: T): Record<string, any> {
  return Object.keys(obj).reduce((acc, key) => {
    const paragraphKey = camelToParagraph(key);
    acc[paragraphKey] = obj[key]; 
    return acc;
  }, {} as Record<string, any>);
}
