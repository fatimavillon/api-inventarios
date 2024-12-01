const express = require('express');
const router = express.Router();
const inventoryService = require('./inventoryService');

router.get('/', async (req, res) => {
    const tenantId = req.headers['tenant-id'];
    if (!tenantId) return res.status(400).json({ message: "Missing tenant ID" });
    
    try {
        const items = await inventoryService.getInventory(tenantId);
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    const tenantId = req.headers['tenant-id'];
    const { product_name, stock_available } = req.body;
    if (!tenantId || !product_name || stock_available == null) 
        return res.status(400).json({ message: "Invalid data" });
    
    try {
        const newItem = await inventoryService.createProduct(tenantId, product_name, stock_available);
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:product_id', async (req, res) => {
    const tenantId = req.headers['tenant-id'];
    const { product_id } = req.params;
    
    try {
        const item = await inventoryService.getProduct(tenantId, product_id);
        if (item) res.json(item);
        else res.status(404).json({ message: "Product not found" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:product_id', async (req, res) => {
    const tenantId = req.headers['tenant-id'];
    const { product_id } = req.params;
    const { stock_available } = req.body;

    try {
        const updatedItem = await inventoryService.updateProductStock(tenantId, product_id, stock_available);
        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
