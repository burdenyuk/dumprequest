const AWS = require('aws-sdk');

const Request = require('src/application/request/Request');
const ValidationError = require('src/application/request/ValidationError');
const DumpRequestUseCase = require('src/application/use-case/DumpRequestUseCase');
const Storage = require('src/infrastructure/repository/aws/DynamoDB/Storage');

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const storage = new Storage(dynamoDB);
const dumpRequestUseCase = new DumpRequestUseCase(storage);

exports.handler = async ({ body: payload }, context) => {
    try {
        const request = new Request({ payload });

        await dumpRequestUseCase.execute(request);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Request is successfully dumped'
            })
        };
    } catch (error) {
        if (error instanceof ValidationError) {
            const { message } = error;

            return {
                statusCode: 400,
                body: JSON.stringify({
                    message
                })
            };
        }

        console.log('error:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Internal error'
            })
        };
    }
};
