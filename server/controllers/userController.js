const router = require('express').Router();
const User = require('./../modules/user');
const authMiddleware = require('./../middlewares/authMiddleware');
 const cloudinary = require('./../cloudinary');

//fetch currently logged user
router.get('/get-logged-user', authMiddleware, async (req,res) => {
    try{
        const user = await User.findOne({_id:  req.userId});
        res.send({
            message: 'user fetched successfully',
            success: true,
            data: user
        })

    }catch(error){
        res.status(400).send({
            message: error.message,
            success: false
        })
    }
});

//fetching all user
router.get('/get-all-users', authMiddleware, async (req,res) => {
    try{

        const userid = req.userId;

        const allUsers = await User.find({
            _id: {$ne: userid}
        });

        res.send({
            message: 'all users fetched successfully',
            success: true,
            data: allUsers
        });

    }catch(error){
        res.status(400).send({
            message: error.message,
            success: false
        })
    }
});

router.post('/upload-profile-pic', authMiddleware, async (req,res) => {
    try{
        console.log(req.userId);

        const image = req.body.image;

        // upload the image to cloudinary and get the url
        const imageUrl = await cloudinary.uploader.upload(image, {
            folder: 'quickchat'
        });

        //update the user profile pic in database
        const user = await User.findByIdAndUpdate(
            req.userId,
            { profilePic: imageUrl.secure_url },
            { returnDocument: 'after' }
        );

        res.send({
            message: 'Profile picture updated successfully',
            success: true,
            data: user
        });

    }catch(error){

        console.log(error);

        res.status(400).send({
            message: error.message,
            success: false
        });
    }
});

router.post('/update-preferred-language', authMiddleware, async (req,res) => {
    try{

        const user = await User.findByIdAndUpdate(
            req.userId,
            {
                preferredLanguage: req.body.preferredLanguage
            },
            { returnDocument: 'after' }
        );

        res.send({
            message: 'Preferred language updated successfully',
            success: true,
            data: user
        });

    }catch(error){

        res.status(400).send({
            message: error.message,
            success: false
        });
    }
});


module.exports = router;