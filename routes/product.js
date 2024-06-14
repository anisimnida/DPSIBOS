const express = require('express');
const router = express.Router();
const { Product } = require('../models');
const { authenticate } = require('../middleware/auth');

// Route to create a new product
router.post('/', authenticate, async (req, res) => {
    try {
        const { productName, supplierID, categoryID, unit, price } = req.body;
        const product = await Product.create({ productName, supplierID, categoryID, unit, price });
        res.status(201).json(product);
    } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            res.status(400).json({ message: 'Foreign key constraint error: Category ID or Supplier ID not found' });
        } else {
            res.status(400).json({ message: error.message });
        }
    }
});

// Route to get all products
router.get('/', authenticate, async (req, res) => {
    try {
        const products = await Product.findAll();
        if (products.length === 0) {
            res.status(404).json({ message: 'Products not found' });
        } else {
            res.json(products);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to get a product by ID
router.get('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);
        if (!product) throw new Error('Product not found');
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to update a product by ID
router.put('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { productName, supplierID, categoryID, unit, price } = req.body;
        const product = await Product.findByPk(id);
        if (!product) throw new Error('Product not found');
        product.productName = productName;
        product.supplierID = supplierID;
        product.categoryID = categoryID;
        product.unit = unit;
        product.price = price;
        await product.save();
        res.json(product);
    } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            res.status(400).json({ message: 'Foreign key constraint error: Category ID or Supplier ID not found' });
        } else {
            res.status(400).json({ message: error.message });
        }
    }
});

// Route to delete a product by ID
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);
        if (!product) throw new Error('Product not found');
        await product.destroy();
        res.sendStatus(204);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
