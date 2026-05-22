const router = require('express').Router();

const User = require('./../modules/user');

const bcrypt = require('bcryptjs');

const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/signup',async(req, res) =>{
   try{
    //if user is alreaddy there
    const user = await User.findOne({email: req.body.email});
    //update

    //if user exists, send an error response
    if(user){
        return res.send({
            message: 'user already exits',
            success: false
        })
    }
    //encrypt the passord
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;

    // create new user and save it to database
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).send({
        message:'User created successfully',
        success: true
    })

   }catch(error){
    res.send({
        message: error.message,
        success: false
    });
   }
})

router.post('/login', async (req,res) => {
    try{
        //if user is alreaddy there
        const user = await User.findOne({email: req.body.email});
        if(!user){
            return res.send({
                message: 'User does not exists',
                success: false
            })
        }
        
        //if passowrd is not correct
        const isvalid = await bcrypt.compare(req.body.password,user.password);
        if(!isvalid){
            return res.send({
                message: 'invalid password',
                success: false
            })
        }
        // if the user exists and passowrd is correct ,assign a jwt
        const token = jwt.sign({userId: user._id}, process.env.SECRET_KEY, {expiresIn: "30d"});
        res.send({
            message: 'user logged-in successfuly',
            success: true,
            token: token
        });


    }catch(error){
        res.send({
            message : error.message,
            success : false
        })
    }
});

router.post('/google-login', async (req, res) => {

    try {

        const { email, firstname, lastname, profilePic } = req.body;

        let user = await User.findOne({ email });

        if (!user) {

            user = new User({
                firstname,
                lastname,
                email,
                password: "google-login-user",
                profilePic
            });

            await user.save();
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.SECRET_KEY,
            { expiresIn: "30d" }
        );

        res.send({
            success: true,
            message: "Google login successful",
            token
        });

    } catch (error) {

        res.send({
            success: false,
            message: error.message
        });

    }

});

module.exports = router;