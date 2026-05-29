const Reminder = require('../modules/Reminder');

const startReminderChecker = (io) => {

    setInterval(async () => {

        try {

            console.log("Checking reminders...");
            
            const now = new Date();
            console.log("Current Server Time:", now);
            const reminders = await Reminder.find({

                remindAt: { $lte: now },

                triggered: false

            });
            console.log("Found reminders:", reminders.length);

            for (const reminder of reminders) {

                console.log(
                    "Triggered reminder:",
                    reminder.text
                );

                io.to(
                    reminder.userId.toString()
                ).emit(
                    'reminder-notification',
                    {
                        text: reminder.text,
                        messageId: reminder.messageId
                    }
                );

                reminder.triggered = true;

                await reminder.save();

            }

        } catch (error) {

            console.log(
                "Reminder Checker Error:",
                error
            );

        }

    }, 30000);

};

module.exports = startReminderChecker;