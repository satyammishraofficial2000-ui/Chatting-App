const router = require('express').Router();

const User = require('./../modules/user');

const bcrypt = require('bcryptjs');

router.post('/signup',async(req, res) =>{
   try{
    //if user is alreaddy there
    const user = await User.findOne({email: req.body.email});

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
    res.send({
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
module.exports = router;