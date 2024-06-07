// routes/customerRoutes.js
const express = require('express');
const router = express.Router();
const { Customer } = require('../models');
const { authenticate } = require('../middleware/auth');

// Route to create a new customer
router.post('/', authenticate, async (req, res) => {
    try {
        const { customerName, contactName, address, city, postalCode, country } = req.body;
        const customer = await Customer.create({ customerName, contactName, address, city, postalCode, country });
        res.status(201).json(customer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// Route to get all customers
router.get('/',authenticate , async (req, res) => {
    try {
        const customers = await Customer.findAll();
        if (customers.length === 0) {
            res.status(404).json({ message: 'Customers not found' });
        } else {
            res.json(customers);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to get a customer by ID
router.get('/:id',authenticate , async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await Customer.findByPk(id);
        if (!customer) throw new Error('Customer not found');
        res.json(customer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to update a customer by ID
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { customerName, contactName, address, city, postalCode, country } = req.body;
        const customer = await Customer.findByPk(id);
        if (!customer) throw new Error('Customer not found');
        customer.customerName = customerName;
        customer.contactName = contactName;
        customer.address = address;
        customer.city = city;
        customer.postalCode = postalCode;
        customer.country = country;
        await customer.save();
        res.json(customer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route to delete a customer by ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await Customer.findByPk(id);
        if (!customer) throw new Error('Customer not found');
        await customer.destroy();
        res.sendStatus(204);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
