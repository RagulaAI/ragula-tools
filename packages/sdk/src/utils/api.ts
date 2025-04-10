import { tryCatch } from "./tryCatch";
import * as ApiTypes from "../types";

export const doFetch = async <T>(
  url: string,
  apiKey: string,
  options: RequestInit = {}
): Promise<T> => {
  const baseUrl = `https://www.ragula.io/api`;
  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${apiKey}`);

  if (options.body instanceof FormData) {
    headers.delete("Content-Type");
  } else if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const { data, error } = await tryCatch(
    fetch(`${baseUrl}/${url}`, {
      ...options,
      headers,
    })
  );

  if (error) throw error;

  if (!data.ok) {
    const { data: errorBody, error: parseError } = await tryCatch(data.json());
    const errorMessage = parseError
      ? data.statusText
      : (errorBody as ApiTypes.ErrorResponse).message;
    throw new Error(`API Error (${data.status}): ${errorMessage}`);
  }

  if (data.status === 204) {
    return undefined as T;
  }

  return (await data.json()) as T;
};
