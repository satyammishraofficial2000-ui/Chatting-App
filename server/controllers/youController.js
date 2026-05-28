const route = require('express').Router();
const authMiddleware = require('./../middlewares/authMiddleware');
const YouItem = require('./../modules/youItem');


// CREATE ITEM
route.post('/create-you-item', authMiddleware, async(req,res)=>{

    try{

        const newItem = new YouItem({

            ...req.body,
            userId: req.userId

        });

        const savedItem = await newItem.save();

        res.send({
            success:true,
            data:savedItem
        });

    }catch(error){

        res.status(400).send({
            success:false,
            message:error.message
        });

    }

});


// GET ITEMS
route.get('/get-you-items', authMiddleware, async(req,res)=>{

    try{

        const items = await YouItem.find({

            userId:req.userId

        }).sort({createdAt:1});

        res.send({
            success:true,
            data:items
        });

    }catch(error){

        res.status(400).send({
            success:false,
            message:error.message
        });

    }

});


// TOGGLE TASK
route.post('/toggle-you-task', authMiddleware, async(req,res)=>{

    try{

        const item = await YouItem.findById(req.body.itemId);

        item.completed = !item.completed;

        await item.save();

        res.send({
            success:true,
            data:item
        });

    }catch(error){

        res.status(400).send({
            success:false,
            message:error.message
        });

    }

});

route.post('/delete-you-item', authMiddleware, async(req,res)=>{

    try{

        await YouItem.findByIdAndDelete(req.body.itemId);

        res.send({
            success:true
        });

    }catch(error){

        res.status(400).send({
            success:false,
            message:error.message
        });

    }

});

module.exports = route;