const { TABLE_NAME: TableName } = process.env;

module.exports = class Storage {
    constructor(dynamo) {
        this.dynamo = dynamo;
    }

    async insert(payload) {
        const currentTimestamp = +new Date;
        const Item = {
            ...payload,
            timestamp: currentTimestamp
        };

        await this.dynamo
            .put({
                TableName,
                Item
            })
            .promise();
    }
}
