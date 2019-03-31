const ValidationError = require('./ValidationError');

module.exports = class Request {
    constructor(params) {
        const { payload } = params;

        if (!payload) {
            throw new ValidationError('Request without payload is not allowed');
        }
        this.payload = payload;

        Object.freeze(this);
    }
}
