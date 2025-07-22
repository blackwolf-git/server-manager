const { Brief, User } = require('../models');

exports.submitBrief = async (req, res) => {
    try {
        const { details } = req.body;
        const user_id = req.user.id;

        const brief = await Brief.create({
            user_id,
            details,
            status: 'submitted'
        });

        res.status(201).json({
            success: true,
            data: brief,
            message: 'Brief submitted successfully'
        });

    } catch (error) {
        console.error('Submit brief error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error submitting brief'
        });
    }
};

exports.getUserBriefs = async (req, res) => {
    try {
        const briefs = await Brief.findAll({
            where: { user_id: req.user.id },
            order: [['created_at', 'DESC']],
            include: [
                {
                    model: User,
                    attributes: ['full_name', 'email']
                }
            ]
        });

        res.json({
            success: true,
            data: briefs,
            count: briefs.length
        });

    } catch (error) {
        console.error('Get briefs error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching briefs'
        });
    }
};

exports.getBriefDetails = async (req, res) => {
    try {
        const brief = await Brief.findOne({
            where: {
                id: req.params.id,
                user_id: req.user.id
            },
            include: [
                {
                    model: User,
                    attributes: ['full_name', 'email', 'phone_number']
                }
            ]
        });

        if (!brief) {
            return res.status(404).json({
                success: false,
                message: 'Brief not found'
            });
        }

        res.json({
            success: true,
            data: brief
        });

    } catch (error) {
        console.error('Brief details error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching brief details'
        });
    }
};

exports.updateBrief = async (req, res) => {
    try {
        const { details } = req.body;
        const brief = await Brief.findOne({
            where: {
                id: req.params.id,
                user_id: req.user.id,
                status: 'submitted' // يمكن تحديث الموجزات المقدمة فقط
            }
        });

        if (!brief) {
            return res.status(404).json({
                success: false,
                message: 'Brief not found or cannot be updated'
            });
        }

        await brief.update({ details });

        res.json({
            success: true,
            data: brief,
            message: 'Brief updated successfully'
        });

    } catch (error) {
        console.error('Update brief error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating brief'
        });
    }
};
