import axios, { Method, AxiosRequestHeaders, AxiosInstance, AxiosRequestConfig } from 'axios'
import { merge } from './merge'
import type { Types } from './types'

export const hasProperty = (obj: Types.Object<any>, property: string): boolean => {
    return obj && Object.prototype.hasOwnProperty.call(obj, property)
}

export const REQUEST_TIMEOUT = 7000

export const setAuthorization = (token: string) => `Bearer ${token}`

export const getAuthorizationToken = (args: Types.TokenStorage) => {
    try {
        if (!window) throw new Error('Window not found.')
        const { storageKey, storageType } = args
        if (storageType === 'localStorage') {
            return window.localStorage.getItem(storageKey) as string
        }
        if (storageType === 'session') {
            return window.sessionStorage.getItem(storageKey) as string
        }
    } catch (error) {
        return ''
    }
}

export const createClient = (
    args: Types.HttpClientArgs & {
        tokenStorage: Types.TokenStorage
    }
) => {
    const { baseURL, tokenStorage, headers, timeout = REQUEST_TIMEOUT } = args
    let cHeaders: Types.RequestHeader = {
        'content-type': 'application/json',
    }
    if (headers) {
        cHeaders = {
            ...cHeaders,
            ...headers,
        }
        if (hasProperty(headers, 'retry')) {
            cHeaders.retry = headers.retry
        }
        if (hasProperty(headers, 'is-authorization')) {
            cHeaders['is-authorization'] = headers['is-authorization']
        }
        if (hasProperty(headers, 'max-retries')) {
            cHeaders['max-retries'] = headers['max-retries']
        }
    }
    if (!cHeaders.Authorization && cHeaders['is-authorization']) {
        cHeaders.Authorization = setAuthorization(getAuthorizationToken(tokenStorage) || '')
    }
    const options = {
        baseURL,
        timeout,
        headers: cHeaders,
    }
    const client = axios.create(options)
    return {
        client,
        options,
    }
}

export interface HttpClientProvider {
    headers?: AxiosRequestHeaders
    readonly baseURL?: string
    timeout?: number

    fetch<T = any>(
        url: string,
        method: Method | string,
        params: Types.Object<any>,
        headers?: AxiosRequestHeaders,
        progressEvent?: any
    ): Promise<Types.ResponseData<T>>

    get<T = any>(url: string, params: Types.Object<any>, headers?: AxiosRequestHeaders, progressEvent?: any): Promise<Types.ResponseData<T>>

    delete<T = any>(
        url: string,
        data: Types.Object<any>,
        headers?: AxiosRequestHeaders,
        progressEvent?: any
    ): Promise<Types.ResponseData<T>>

    head<T = any>(url: string, headers?: AxiosRequestHeaders, progressEvent?: any): Promise<Types.ResponseData<T>>

    options<T = any>(url: string, headers?: AxiosRequestHeaders, progressEvent?: any): Promise<Types.ResponseData<T>>

    post<T = any>(url: string, data: Types.Object<any>, headers?: AxiosRequestHeaders, progressEvent?: any): Promise<Types.ResponseData<T>>

    put<T = any>(url: string, data: Types.Object<any>, headers?: AxiosRequestHeaders, progressEvent?: any): Promise<Types.ResponseData<T>>

    patch<T = any>(url: string, data: Types.Object<any>, headers?: AxiosRequestHeaders, progressEvent?: any): Promise<Types.ResponseData<T>>
}

export class HttpClient implements HttpClientProvider {
    client: Types.Undefined<AxiosInstance>
    requestConfig: AxiosRequestConfig
    tokenStorage: Types.TokenStorage
    static _instance: HttpClient

    /**
     * The Singleton's constructor should always be private to prevent direct
     * construction calls with the `new` operator.
     */
    constructor(args: Types.HttpClientArgs) {
        const { baseURL, tokenStorage, headers, timeout } = args
        this.tokenStorage = merge<Types.TokenStorage>(
            {
                storageKey: 'accessToken',
                storageType: 'localStorage',
            },
            tokenStorage
        )
        const client = createClient({ baseURL, tokenStorage: this.tokenStorage, headers, timeout })
        this.client = client.client
        this.requestConfig = client.options
    }

    private _clientValid(): never | AxiosInstance {
        if (!this.client) throw new Error('`this.client` has no initializer and is not definitely assigned.')
        return this.client
    }

    private _mergeConfig(config?: AxiosRequestConfig): AxiosRequestConfig {
        return merge(
            {
                headers: this.requestConfig.headers,
            },
            config
        )
    }

    public fetch<T = any>(
        url: string,
        method: Method,
        params: Types.Object<any>,
        config?: AxiosRequestConfig
    ): Promise<Types.ResponseData<T>> {
        return this._clientValid()({
            method,
            url,
            data: params,
            ...this._mergeConfig(config),
        })
            .then((response) => Promise.resolve(response))
            .catch((error) => Promise.reject(error))
    }

    public head<T = any>(url: string, config?: AxiosRequestConfig): Promise<Types.ResponseData<T>> {
        return this._clientValid()
            .head(url, { ...this._mergeConfig(config) })
            .then((response) => Promise.resolve(response))
            .catch((error) => Promise.reject(error))
    }

    public options<T = any>(url: string, config?: AxiosRequestConfig): Promise<Types.ResponseData<T>> {
        return this._clientValid()
            .options(url, { ...this._mergeConfig(config) })
            .then((response) => Promise.resolve(response))
            .catch((error) => Promise.reject(error))
    }

    public get<T = any>(url: string, params: Types.Object<any>, config?: AxiosRequestConfig): Promise<Types.ResponseData<T>> {
        return this._clientValid()
            .get(url, { params, ...this._mergeConfig(config) })
            .then((response) => Promise.resolve(response))
            .catch((error) => Promise.reject(error))
    }

    public post<T = any>(url: string, data: Types.Object<any>, config?: AxiosRequestConfig): Promise<Types.ResponseData<T>> {
        return this._clientValid()
            .post(url, data, { ...this._mergeConfig(config) })
            .then((response) => Promise.resolve(response))
            .catch((error) => Promise.reject(error))
    }

    public put<T = any>(url: string, data: Types.Object<any>, config?: AxiosRequestConfig): Promise<Types.ResponseData<T>> {
        return this._clientValid()
            .put(url, data, { ...this._mergeConfig(config) })
            .then((response) => Promise.resolve(response))
            .catch((error) => Promise.reject(error))
    }

    public patch<T = any>(url: string, data: Types.Object<any>, config?: AxiosRequestConfig): Promise<Types.ResponseData<T>> {
        return this._clientValid()
            .patch(url, data, { ...this._mergeConfig(config) })
            .then((response) => Promise.resolve(response))
            .catch((error) => Promise.reject(error))
    }

    public delete<T = any>(url: string, data: Types.Object<any>, config?: AxiosRequestConfig): Promise<Types.ResponseData<T>> {
        return this._clientValid()
            .delete(url, { data, ...this._mergeConfig(config) })
            .then((response) => Promise.resolve(response))
            .catch((error) => Promise.reject(error))
    }
}
