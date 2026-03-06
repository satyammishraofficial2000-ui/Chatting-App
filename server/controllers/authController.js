const router = require('express').Router();

const User = require('./../modules/user');

const bcrypt = require('bcryptjs');

const jwt =  require('jsonwebtoken');

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

router.post('/login', async (req,res) => {
    try{
        //if user is alreaddy there
        const user = await User.findOne({email: req.body.email});
        if(!user){
            return res.send({
                message: 'User does not exists',
                success: true
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
        const token = jwt.sign({userId: user._id}, process.env.SECRET_KEY, {expiresIn: "1d"});
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

module.exports = router;