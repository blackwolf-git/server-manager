const { Service } = require('../models');

exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.findAll({
            attributes: ['id', 'name', 'description', 'price'],
            order: [['name', 'ASC']]
        });

        res.json({
            success: true,
            data: services,
            count: services.length
        });

    } catch (error) {
        console.error('Get services error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching services'
        });
    }
};

exports.getServiceDetails = async (req, res) => {
    try {
        const service = await Service.findByPk(req.params.id, {
            attributes: ['id', 'name', 'description', 'price']
        });

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        res.json({
            success: true,
            data: service
        });

    } catch (error) {
        console.error('Service details error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching service details'
        });
    }
};

exports.createService = async (req, res) => {
    try {
        const { name, description, price } = req.body;

        const service = await Service.create({
            name,
            description,
            price
        });

        res.status(201).json({
            success: true,
            data: service,
            message: 'Service created successfully'
        });

    } catch (error) {
        console.error('Create service error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error creating service'
        });
    }
};
