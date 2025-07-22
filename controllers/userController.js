const { User, ContactRequest, Meeting, Brief } = require('../models');

exports.updateProfile = async (req, res) => {
    try {
        const { full_name, phone_number } = req.body;
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        await user.update({
            full_name: full_name || user.full_name,
            phone_number: phone_number || user.phone_number
        });

        res.json({
            success: true,
            data: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                phone_number: user.phone_number
            },
            message: 'Profile updated successfully'
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating profile'
        });
    }
};

exports.getUserDashboard = async (req, res) => {
    try {
        const userId = req.user.id;

        const [requestsCount, meetingsCount, briefsCount] = await Promise.all([
            ContactRequest.count({ where: { user_id: userId } }),
            Meeting.count({ where: { user_id: userId } }),
            Brief.count({ where: { user_id: userId } })
        ]);

        const recentActivities = await Promise.all([
            ContactRequest.findAll({
                where: { user_id: userId },
                order: [['created_at', 'DESC']],
                limit: 5,
                attributes: ['id', 'purpose', 'status', 'created_at']
            }),
            Meeting.findAll({
                where: { user_id: userId },
                order: [['timeslot', 'DESC']],
                limit: 5,
                attributes: ['id', 'timeslot', 'purpose', 'status']
            }),
            Brief.findAll({
                where: { user_id: userId },
                order: [['created_at', 'DESC']],
                limit: 5,
                attributes: ['id', 'status', 'created_at']
            })
        ]);

        res.json({
            success: true,
            data: {
                counts: {
                    requests: requestsCount,
                    meetings: meetingsCount,
                    briefs: briefsCount
                },
                recent_requests: recentActivities[0],
                recent_meetings: recentActivities[1],
                recent_briefs: recentActivities[2]
            }
        });

    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching dashboard data'
        });
    }
};
