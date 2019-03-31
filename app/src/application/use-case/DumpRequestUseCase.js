module.exports = class DumpRequestUseCase {
    constructor(storage) {
        this.storage = storage;
    }

    async execute(payload) {
        await this.storage.insert(payload);
    }
}
