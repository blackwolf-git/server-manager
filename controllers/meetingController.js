const { Meeting, User } = require('../models');

// ✅ حجز موعد
exports.scheduleMeeting = async (req, res) => {
    try {
        const { timeslot, purpose } = req.body;
        const user_id = req.user.id;

        if (new Date(timeslot) < new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Meeting time must be in the future'
            });
        }

        const existingMeeting = await Meeting.findOne({
            where: { timeslot }
        });

        if (existingMeeting) {
            return res.status(400).json({
                success: false,
                message: 'This timeslot is already booked'
            });
        }

        const meeting = await Meeting.create({
            user_id,
            timeslot,
            purpose,
            status: 'scheduled'
        });

        res.status(201).json({
            success: true,
            data: meeting,
            message: 'Meeting scheduled successfully'
        });

    } catch (error) {
        console.error('Schedule meeting error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error scheduling meeting'
        });
    }
};

// ✅ عرض المواعيد الخاصة بالمستخدم
exports.getUserMeetings = async (req, res) => {
    try {
        const meetings = await Meeting.findAll({
            where: { user_id: req.user.id },
            order: [['timeslot', 'ASC']]
        });

        res.json({
            success: true,
            data: meetings,
            count: meetings.length
        });

    } catch (error) {
        console.error('Get meetings error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching meetings'
        });
    }
};

// ✅ إلغاء الموعد
exports.cancelMeeting = async (req, res) => {
    try {
        const meeting = await Meeting.findOne({
            where: {
                id: req.params.id,
                user_id: req.user.id
            }
        });

        if (!meeting) {
            return res.status(404).json({
                success: false,
                message: 'Meeting not found'
            });
        }

        await meeting.update({ status: 'canceled' });

        res.json({
            success: true,
            message: 'Meeting canceled successfully'
        });

    } catch (error) {
        console.error('Cancel meeting error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error canceling meeting'
        });
    }
};

// ✅ عرض المواعيد المتاحة (بعد إزالة المحجوز)
exports.getAvailableTimeslots = async (req, res) => {
    try {
        // أمثلة لمواعيد متاحة
        const allTimeslots = [
            '2025-07-18T10:00:00Z',
            '2025-07-18T11:00:00Z',
            '2025-07-18T12:00:00Z',
            '2025-07-18T13:00:00Z'
        ];

        const booked = await Meeting.findAll({
            attributes: ['timeslot']
        });

        const bookedTimes = booked.map(m => m.timeslot.toISOString());

        const available = allTimeslots.filter(t => !bookedTimes.includes(t));

        res.json({
            success: true,
            availableTimeslots: available
        });
    } catch (error) {
        console.error('Get available timeslots error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching timeslots'
        });
    }
};
