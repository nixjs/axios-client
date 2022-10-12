# @nixjs23n6/axios-client

A small wrapper for integrating Axios to Typescript

## Quick Setup

### Install

Install these dependencies:

`yarn add @nixjs23n6/axios-client`

### Setup & Usage

```javascript
import { HttpClient, Types } from '@nixjs23n6/axios-client'

class Client extends HttpClient {
    /**
    * The Singleton's constructor should always be private to prevent direct
    * construction calls with the `new` operator.
    */
    private constructor(args: Types.HttpClientArgs) {
        super(args)
    }

    /**
    * The static method that controls the access to the singleton instance.
    *
    * This implementation let you subclass the Singleton class while keeping
    * just one instance of each subclass around.
    */
    public static get instance(): HttpClient {
        if (HttpClient._instance) {
            return this._instance
        }
        this._instance = new HttpClient({
            baseURL: "https://api.example.nixjs"
        })
        if (this._instance && this._instance.client) {
            // Config interceptors
            this._instance.client.interceptors.request.use(
                (config) => config,
                (error) => {
                    return Promise.resolve(error)
                }
            )
            this._instance.client.interceptors.response.use(
                (response) => {
                    // Return a successful response back to the calling service
                    return response
                },
                (error) => {
                    const { response } = error

                    return Promise.resolve(response)
                }
            )
        }
        return this._instance
    }

}


const client = Client.instance;

client.fetch<any>('/login', 'POST', { username: "nghinv", password: 'Abc1@34' }).then(console.log)

```
