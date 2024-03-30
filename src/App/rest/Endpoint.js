export default class Endpoint {
    lastRequest = 0;
    lastRequestResult = null;
    cache = {};
    hasPendingRequest = false;

    constructor(config) {
        let conf = {
            baseURL: false,
            name: 'default',
            path: '/api',
            method: 'GET',
            contentType: 'application/json',
            dataProcessor: null,
            cacheDuration: 0,
            timeout: 10000,
            retry: 3,
            parameters: [],
            headers: [],
            ...config
        };

        this.name = conf.name;
        this.path = conf.path;
        this.method = conf.method;
        this.contentType = conf.contentType;
        this.dataProcessor = conf.dataProcessor;
        this.cacheDuration = conf.cacheDuration;
        this.timeout = conf.timeout;
        this.retry = conf.retry;
        this.parameters = conf.parameters.map((value) => {
            return {
                name: value.name,
                required: value.required || false,
                default: value.default || null,
                type: value.type || 'parameter'
            };
        });
        this.headers = conf.headers.map((value) => {
            return {
                name: value.name,
                required: value.required || false,
                default: value.default || null
            };
        });
    }

    addCache(url, value) {
        if (this.cacheDuration > 0) {
            this.cache[url] = value;
            setTimeout(() => {
                delete this.cache[url];
            }, this.cacheDuration * 1000);
        }
    }

    hasCache(url) {
        return typeof this.cache[url] !== 'undefined';
    }

    getCache(url) {
        return this.cache[url];
    }

    containsParameter(parameterName) {
        for (let p of this.parameters) {
            if (p.name === parameterName) {
                return true;
            }
        }

        return false;
    }

    processData(inputData) {
        return this.dataProcessor ? this.dataProcessor.process(inputData) : Promise.resolve(inputData);
    }

    createRequest(params = {}, body = {}, headers = {}) {
        let stringParams = '?';
        let path = this.path;

        for (let p of this.parameters) {
            if (Object.hasOwn(params, p.name) && params[p.name] !== null) {
                if (p.type === 'url') {
                    path = path.replaceAll(`%${p.name}%`, params[p.name]);
                } else {
                    stringParams += `${p.name}=${params[p.name]}&`;
                }
            } else if (p.required) {
                if (p.default !== null) {
                    stringParams += `${p.name}=${p.default}&`;
                } else {
                    throw new Error(`Missing required parameter '${p.name}' for endpoint : '${this.name}'`);
                }
            }
        }

        stringParams = stringParams.slice(0, -1);

        let bod = body;

        if (this.method === 'GET') {
            bod = null;
        } else if (this.contentType === 'application/json') {
            bod = JSON.stringify(body);
        }

        const hders = {};
        this.headers.forEach(header => {
            if (Object.hasOwn(headers, header.name) && headers[header.name] !== null) {
                hders[header.name] = headers[header.name];
            } else if (header.required) {
                if (header.default !== null) {
                    hders[header.name] = header.default;
                } else {
                    throw new Error(`Missing required header '${header.name}' for endpoint : '${this.name}'`);
                }
            }
        });

        return {
            parameters: stringParams,
            request: {
                method: this.method,
                body: bod,
                credentials: 'omit',
                headers: {
                    'Content-Type': this.contentType,
                    ...hders
                }
            },
            path: path,
            retry: this.retry
        };
    }
}
