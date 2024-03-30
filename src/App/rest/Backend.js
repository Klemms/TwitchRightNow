export default class Backend {
    /**
     * @type {Object}
     */
    endpoints = {};

    constructor(
        config = {
            baseURL: 'http://localhost:8080/'
        }
    ) {
        this.baseURL = config.baseURL || 'http://localhost:8080/';
    }

    /**
     * Add an endpoint to this backend
     * @param {Endpoint} endpoint
     * @param {Object} remoteConfig
     */
    registerEndpoint(endpoint) {
        this.endpoints[endpoint.name] = endpoint;
    }

    /**
     * Send a request to the backend
     * @param endpointName The name of the endpoint to call
     * @param body The body of the request
     * @param params The parameters of the request (get)
     * @param headers The headers of the request
     * @param currentTry The current try number, used for recursive calls
     * @returns {Promise<never>|Promise<Response | {error: *}>|Promise<unknown>} The promise of the request
     */
    sendRequest(endpointName, body = {}, params = {}, headers = {}, currentTry = 1) {
        if (this.endpoints[endpointName]) {
            let endpoint = this.endpoints[endpointName];

            let request = endpoint.createRequest(params, body, headers);
            const finalURL = encodeURI(`${endpoint.baseURL || this.baseURL}${request.path}${request.parameters}`);

            if (endpoint.hasCache(finalURL)) {
                console.log(`Serving cache for endpoint '${endpointName}' , URL : ${finalURL}`);
                return Promise.resolve(endpoint.getCache(finalURL));
            }

            console.log(`Calling endpoint '${endpointName}', URL : ${finalURL}`);

            const dateStart = Date.now();

            return Promise.race([
                // TODO: Use Abort signals
                new Promise((resolve, reject) => {
                    setTimeout(() => {
                        reject({ error: { message: 'timeout', value: 'Timeout' } });
                    }, endpoint.timeout);
                }),
                fetch(finalURL, request.request).then(
                    (value) => {
                        if (value.status === 200) {
                            return value.json().then(
                                (result) => {
                                    return endpoint.processData(result).then(
                                        (value) => {
                                            endpoint.lastRequestResult = value;
                                            endpoint.lastRequest = Date.now();

                                            endpoint.addCache(finalURL, value);

                                            return value;
                                        },
                                        (err) => {
                                            return Promise.reject({ error: { message: 'parseError', value: err, httpStatus: value.status } });
                                        }
                                    );
                                },
                                () => {
                                    console.error('Parse error. Value received was not JSON');
                                    return Promise.reject({
                                        error: { message: 'parseError', value: 'Value received was not JSON', httpStatus: value.status }
                                    });
                                }
                            );
                        } else {
                            console.error('Request error', value);
                            return Promise.reject({ error: { message: 'httpError', value: value, httpStatus: value.status } });
                        }
                    },
                    (err) => {
                        console.error('Request rejected', err);

                        endpoint.lastRequestResult = null;
                        endpoint.lastRequest = 0;

                        return Promise.reject({ error: { message: 'requestRejected', value: err } });
                    }
                )
            ]).then(
                (value) => {
                    //console.log(`Request success for endpoint '${endpointName}' :`, value);
                    return Promise.resolve(value);
                },
                async (err) => {
                    console.error(`Request error for endpoint '${endpointName}' :`, err);

                    if (currentTry < request.retry) {
                        return this.sendRequest(endpointName, body, params, currentTry + 1);
                    }

                    return Promise.reject(err.error);
                }
            );
        }

        return Promise.reject('no-matching-endpoint');
    }
}
