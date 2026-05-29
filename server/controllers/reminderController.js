const express = require('express');

const router = express.Router();

const Reminder = require('../modules/Reminder');

router.post('/create', async (req, res) => {

    try {

        const {
            userId,
            messageId,
            text,
            remindAt
        } = req.body;

        const reminder = await Reminder.create({

            userId,
            messageId,
            text,
            remindAt

        });

        res.status(201).json({

            success: true,
            reminder

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,
            message: 'Server error'

        });

    }

});

module.exports = router;