const Request = require('../../../src/application/request/Request');
const ValidationError = require('../../../src/application/request/ValidationError');

describe('Request', () => {
    test('should throw ValidationError when payload is missing', () => {
        const params = {};

        expect(() => {
            new Request(params);
        }).toThrowError(new ValidationError('Request without payload is not allowed'));
    });

    test('should initialize successfully', () => {
        const params = {
            payload: 'payload'
        };
        const request = new Request(params);

        expect(request).toMatchObject({
            payload: 'payload'
        });
    });
});
