const Storage = require('../../mocks/repository/Storage');
const DumpRequestUseCase = require('../../../src/application/use-case/DumpRequestUseCase');

const storage = new Storage();
const dumpRequestUseCase = new DumpRequestUseCase(storage);

let storageInsertSpy;

describe('DumpRequestUseCase', () => {
    beforeAll(async () => {
        storageInsertSpy = jest.spyOn(storage, 'insert');

        const params = {
            payload: 'payload'
        };
        dumpRequestUseCase.execute(params);
    });

    test('Dump action has been performed', () => {
        expect(storageInsertSpy).toHaveBeenCalledTimes(1);
    });

    afterAll(() => {
        jest.clearAllMocks();
    });
});
