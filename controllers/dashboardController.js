const { ContactRequest, Meeting, Brief } = require('../models');

exports.getDashboardStats = async (req, res) => {
    try {
        const userId = req.user.id;

        const [pendingRequests, scheduledMeetings, submittedBriefs] = await Promise.all([
            ContactRequest.count({
                where: {
                    user_id: userId,
                    status: 'pending'
                }
            }),
            Meeting.count({
                where: {
                    user_id: userId,
                    status: 'scheduled'
                }
            }),
            Brief.count({
                where: {
                    user_id: userId,
                    status: 'submitted'
                }
            })
        ]);

        res.json({
            success: true,
            data: {
                pending_requests: pendingRequests,
                scheduled_meetings: scheduledMeetings,
                submitted_briefs: submittedBriefs
            }
        });

    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching dashboard statistics'
        });
    }
};

exports.getRecentActivity = async (req, res) => {
    try {
        const userId = req.user.id;
        const limit = parseInt(req.query.limit) || 5;

        const [recentRequests, upcomingMeetings, recentBriefs] = await Promise.all([
            ContactRequest.findAll({
                where: { user_id: userId },
                order: [['created_at', 'DESC']],
                limit,
                attributes: ['id', 'purpose', 'status', 'created_at']
            }),
            Meeting.findAll({
                where: {
                    user_id: userId,
                    timeslot: { [Op.gte]: new Date() }
                },
                order: [['timeslot', 'ASC']],
                limit,
                attributes: ['id', 'timeslot', 'purpose', 'status']
            }),
            Brief.findAll({
                where: { user_id: userId },
                order: [['created_at', 'DESC']],
                limit,
                attributes: ['id', 'status', 'created_at']
            })
        ]);

        res.json({
            success: true,
            data: {
                recent_requests: recentRequests,
                upcoming_meetings: upcomingMeetings,
                recent_briefs: recentBriefs
            }
        });

    } catch (error) {
        console.error('Recent activity error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching recent activity'
        });
    }
};
