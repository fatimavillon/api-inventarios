const AWS = require('aws-sdk');
const uuid = require('uuid');

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME;

async function getInventory(tenantId) {
    const params = {
        TableName: TABLE_NAME,
        KeyConditionExpression: 'tenant_id = :tenantId',
        ExpressionAttributeValues: { ':tenantId': tenantId },
    };
    const result = await dynamoDb.query(params).promise();
    return result.Items;
}

async function createProduct(tenantId, productName, stockAvailable) {
    const productId = uuid.v4();
    const item = {
        tenant_id: tenantId,
        product_id: productId,
        product_name: productName,
        stock_available: stockAvailable,
        last_update: new Date().toISOString(),
        adjustments: [],
    };
    await dynamoDb.put({ TableName: TABLE_NAME, Item: item }).promise();
    return item;
}

async function getProduct(tenantId, productId) {
    const params = {
        TableName: TABLE_NAME,
        Key: { tenant_id: tenantId, product_id: productId },
    };
    const result = await dynamoDb.get(params).promise();
    return result.Item;
}

async function updateProductStock(tenantId, productId, stockAvailable) {
    const params = {
        TableName: TABLE_NAME,
        Key: { tenant_id: tenantId, product_id: productId },
        UpdateExpression: 'set stock_available = :stock, last_update = :lastUpdate',
        ExpressionAttributeValues: {
            ':stock': stockAvailable,
            ':lastUpdate': new Date().toISOString(),
        },
        ReturnValues: 'ALL_NEW',
    };
    const result = await dynamoDb.update(params).promise();
    return result.Attributes;
}

module.exports = { getInventory, createProduct, getProduct, updateProductStock };
