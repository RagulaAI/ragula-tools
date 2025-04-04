/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import FormData from "form-data";

import { ApiError } from "./ApiError";
import type { ApiRequestOptions } from "./ApiRequestOptions";
import type { ApiResult } from "./ApiResult";
import { CancelablePromise } from "./CancelablePromise";
import type { OnCancel } from "./CancelablePromise";
import type { OpenAPIConfig } from "./OpenAPI";
import { tryCatch, Result } from "../utils/tryCatch";

export const isDefined = <T>(
  value: T | null | undefined
): value is Exclude<T, null | undefined> => {
  return value !== undefined && value !== null;
};

export const isString = (value: any): value is string => {
  return typeof value === "string";
};

export const isStringWithValue = (value: any): value is string => {
  return isString(value) && value !== "";
};

export const isBlob = (value: any): value is Blob => {
  return (
    typeof value === "object" &&
    typeof value.type === "string" &&
    typeof value.stream === "function" &&
    typeof value.arrayBuffer === "function" &&
    typeof value.constructor === "function" &&
    typeof value.constructor.name === "string" &&
    /^(Blob|File)$/.test(value.constructor.name) &&
    /^(Blob|File)$/.test(value[Symbol.toStringTag])
  );
};

export const isFormData = (value: any): value is FormData => {
  return value instanceof FormData;
};

export const isSuccess = (status: number): boolean => {
  return status >= 200 && status < 300;
};

export const base64 = (str: string): string => {
  try {
    return btoa(str);
  } catch (err) {
    return Buffer.from(str).toString("base64");
  }
};

export const getQueryString = (params: Record<string, any>): string => {
  const qs: string[] = [];

  const append = (key: string, value: any) => {
    qs.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
  };

  const process = (key: string, value: any) => {
    if (isDefined(value)) {
      if (Array.isArray(value)) {
        value.forEach((v) => {
          process(key, v);
        });
      } else if (typeof value === "object") {
        Object.entries(value).forEach(([k, v]) => {
          process(`${key}[${k}]`, v);
        });
      } else {
        append(key, value);
      }
    }
  };

  Object.entries(params).forEach(([key, value]) => {
    process(key, value);
  });

  if (qs.length > 0) {
    return `?${qs.join("&")}`;
  }

  return "";
};

const getUrl = (config: OpenAPIConfig, options: ApiRequestOptions): string => {
  const encoder = config.ENCODE_PATH || encodeURI;

  const path = options.url
    .replace("{api-version}", config.VERSION)
    .replace(/{(.*?)}/g, (substring: string, group: string) => {
      if (options.path?.hasOwnProperty(group)) {
        return encoder(String(options.path[group]));
      }
      return substring;
    });

  const url = `${config.BASE}${path}`;
  if (options.query) {
    return `${url}${getQueryString(options.query)}`;
  }
  return url;
};

export const getFormData = (
  options: ApiRequestOptions
): FormData | undefined => {
  if (options.formData) {
    const formData = new FormData();

    const process = (key: string, value: any) => {
      if (isString(value) || isBlob(value)) {
        formData.append(key, value);
      } else {
        formData.append(key, JSON.stringify(value));
      }
    };

    Object.entries(options.formData)
      .filter(([_, value]) => isDefined(value))
      .forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => process(key, v));
        } else {
          process(key, value);
        }
      });

    return formData;
  }
  return undefined;
};

type Resolver<T> = (options: ApiRequestOptions) => Promise<T>;

export const resolve = async <T>(
  options: ApiRequestOptions,
  resolver?: T | Resolver<T>
): Promise<T | undefined> => {
  if (typeof resolver === "function") {
    return (resolver as Resolver<T>)(options);
  }
  return resolver;
};

export const getHeaders = async (
  config: OpenAPIConfig,
  options: ApiRequestOptions,
  formData?: FormData
): Promise<Record<string, string>> => {
  const [token, username, password, additionalHeaders] = await Promise.all([
    resolve(options, config.TOKEN),
    resolve(options, config.USERNAME),
    resolve(options, config.PASSWORD),
    resolve(options, config.HEADERS),
  ]);

  const formHeaders =
    (typeof formData?.getHeaders === "function" && formData?.getHeaders()) ||
    {};

  const headers = Object.entries({
    Accept: "application/json",
    ...additionalHeaders,
    ...options.headers,
    ...formHeaders,
  })
    .filter(([_, value]) => isDefined(value))
    .reduce(
      (headers, [key, value]) => ({
        ...headers,
        [key]: String(value),
      }),
      {} as Record<string, string>
    );

  if (isStringWithValue(token)) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (isStringWithValue(username) && isStringWithValue(password)) {
    const credentials = base64(`${username}:${password}`);
    headers["Authorization"] = `Basic ${credentials}`;
  }

  if (options.body !== undefined) {
    if (options.mediaType) {
      headers["Content-Type"] = options.mediaType;
    } else if (isBlob(options.body)) {
      headers["Content-Type"] = options.body.type || "application/octet-stream";
    } else if (isString(options.body)) {
      headers["Content-Type"] = "text/plain";
    } else if (!isFormData(options.body)) {
      headers["Content-Type"] = "application/json";
    }
  }

  return headers;
};

export const getRequestBody = (options: ApiRequestOptions): any => {
  if (options.body) {
    return options.body;
  }
  return undefined;
};

// Helper function to determine fetch credentials option
const getCredentials = (
  config: OpenAPIConfig
): RequestCredentials | undefined => {
  if (config.WITH_CREDENTIALS) {
    return "include";
  }
  // 'omit' is the default and safest if not explicitly included.
  // 'same-origin' could be used depending on requirements.
  return "omit";
};

export const sendRequest = async (
  config: OpenAPIConfig,
  options: ApiRequestOptions,
  url: string,
  body: any,
  formData: FormData | undefined,
  headers: Record<string, string>,
  onCancel: OnCancel
): Promise<Response> => {
  const controller = new AbortController();
  onCancel(() => controller.abort("The user aborted a request."));

  const fetchOptions: RequestInit = {
    method: options.method,
    headers,
    body: body ?? formData, // fetch handles FormData directly
    signal: controller.signal,
    credentials: getCredentials(config),
  };

  // Add credentials if needed - fetch handles this via the 'credentials' option
  // The axios-specific withXSRFToken logic is removed. If needed, implement via custom headers.

  // Unlike axios, fetch doesn't automatically throw on HTTP errors (4xx, 5xx).
  // It only throws on network errors. We return the raw response and let the caller handle it.
  return await fetch(url, fetchOptions);
};

export const getResponseHeader = (
  response: Response,
  responseHeader?: string
): string | null | undefined => {
  if (responseHeader) {
    // Headers object is case-insensitive
    return response.headers.get(responseHeader);
  }
  return undefined;
};

export const getResponseBody = async (response: Response): Promise<any> => {
  if (response.status === 204) {
    return undefined; // No Content
  }

  const contentType = response.headers.get("Content-Type");

  try {
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }
    return await response.text();
  } catch (error) {
    try {
      return await response.text();
    } catch {
      return undefined;
    }
  }
};

export const catchErrorCodes = (
  options: ApiRequestOptions,
  result: ApiResult
): void => {
  const errors: Record<number, string> = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    500: "Internal Server Error",
    502: "Bad Gateway",
    503: "Service Unavailable",
    ...options.errors,
  };

  const error = errors[result.status];
  if (error) {
    throw new ApiError(options, result, error);
  }

  if (!result.ok) {
    const errorStatus = result.status ?? "unknown";
    const errorStatusText = result.statusText ?? "unknown";

    const errorBody = result.body
      ? JSON.stringify(result.body, null, 2)
      : undefined;

    throw new ApiError(
      options,
      result,
      `Generic Error: status: ${errorStatus}; status text: ${errorStatusText}; body: ${errorBody}`
    );
  }
};

/**
 * Request method
 * @param config The OpenAPI configuration object
 * @param options The request options from the service
 * @returns CancelablePromise<Result<T, ApiError>>
 */
export const request = <T>(
  config: OpenAPIConfig,
  options: ApiRequestOptions
): CancelablePromise<T> => {
  return new CancelablePromise(async (resolve, reject, onCancel) => {
    if (onCancel.isCancelled) return;

    try {
      const url = getUrl(config, options);
      const formData = getFormData(options);
      const body = getRequestBody(options);
      const headers = await getHeaders(config, options, formData);

      const response = await sendRequest(
        config,
        options,
        url,
        body,
        formData,
        headers,
        onCancel
      );

      const responseBody = await getResponseBody(response);
      const responseHeader = getResponseHeader(
        response,
        options.responseHeader
      );

      const result: ApiResult = {
        url: response.url,
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        body: responseHeader ?? responseBody,
      };

      try {
        catchErrorCodes(options, result);
        resolve(result.body as T);
      } catch (error) {
        reject(error);
      }
    } catch (error) {
      reject(error);
    }
  });
};
