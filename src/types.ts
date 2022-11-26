import { AxiosRequestHeaders, AxiosResponse } from 'axios'

export namespace Types {
    export type Object<T> = Record<string, T>;
    export type Undefined<T> = T | undefined;
    export type TokenStorage = {
        storageKey: string,
        storageType: 'localStorage' | 'session'
    }
    export interface BaseResponse<T> {
        error?: unknown;
        status?: "SUCCESS" | "ERROR";
        data?: T;
    }
    export interface RequestHeader extends AxiosRequestHeaders {
        'retry'?: boolean
        'max-retries'?: number
        'is-authorization'?: boolean
        'content-type': string
    }
    export interface HttpClientArgs {
        baseURL: string
        headers?: RequestHeader
        timeout?: number
        tokenStorage?: TokenStorage
    }
    export interface ResponseData<T> extends AxiosResponse<T> { }
    export interface ResponseError {
        code: string | number
        message?: string
        optionalData?: any
    }
    export interface ResponseParser<T> extends BaseResponse<T> {
        error?: ResponseError
    }
}

