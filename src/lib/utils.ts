import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function camelToSnakeCase(str: string): string {
  return str.replace(/([A-Z])/g, "_$1").toLowerCase();
}

export function transformCamelKeysToSnakeCase<T extends Record<string, any>>(obj: T): T {
  return Object.keys(obj).reduce((acc, key) => {
    const snakeKey = camelToSnakeCase(key);
    const value = obj[key];
    acc[snakeKey] = value && typeof value === "object" && !Array.isArray(value) && !(value instanceof Date)
      ? transformCamelKeysToSnakeCase(value)
      : Array.isArray(value)
      ? value.map((item) =>
          item && typeof item === "object" && !(item instanceof Date)
            ? transformCamelKeysToSnakeCase(item)
            : item
        )
      : value;
    return acc;
  }, {} as Record<string, any>) as T;
}

export function camelToParagraph(str: string): string {
  return str.replace(/([A-Z])/g, " $1").toLowerCase();
}

export function transformCamelKeysToParagraph<T extends Record<string, any>>(obj: T): T {
  return Object.keys(obj).reduce((acc, key) => {
    const paragraphKey = camelToParagraph(key);
    acc[paragraphKey] = obj[key]; 
    return acc;
  }, {} as Record<string, any>) as T;
}

export function snakeToParagraph(str: string): string {
  return str.replace(/_/g, " ").toLowerCase();
}

export function getDateInput(date: Date): string {
  return date.toISOString().split("T")[0];
}