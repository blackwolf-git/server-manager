const { ContactRequest, Service, User } = require('../models');

exports.createContactRequest = async (req, res) => {
    try {
        const { service_id, purpose } = req.body;
        const user_id = req.user.id;

        // التحقق من وجود الخدمة
        const service = await Service.findByPk(service_id);
        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        const request = await ContactRequest.create({
            user_id,
            service_id,
            purpose,
            status: 'pending'
        });

        res.status(201).json({
            success: true,
            data: request,
            message: 'Contact request submitted successfully'
        });

    } catch (error) {
        console.error('Contact request error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error submitting contact request'
        });
    }
};

exports.getUserRequests = async (req, res) => {
    try {
        const requests = await ContactRequest.findAll({
            where: { user_id: req.user.id },
            include: [
                {
                    model: Service,
                    attributes: ['name', 'price']
                }
            ],
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            data: requests,
            count: requests.length
        });

    } catch (error) {
        console.error('Get requests error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching contact requests'
        });
    }
};

exports.getRequestDetails = async (req, res) => {
    try {
        const request = await ContactRequest.findOne({
            where: {
                id: req.params.id,
                user_id: req.user.id
            },
            include: [
                {
                    model: Service,
                    attributes: ['name', 'description', 'price']
                },
                {
                    model: User,
                    attributes: ['full_name', 'email', 'phone_number']
                }
            ]
        });

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Request not found'
            });
        }

        res.json({
            success: true,
            data: request
        });

    } catch (error) {
        console.error('Request details error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching request details'
        });
    }
};
