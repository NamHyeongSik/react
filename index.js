const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const {User} = require('./models/user');
const config = require('./config/key');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(()=>console.log('MongoDB Connected...'))
.catch(err=>console.log(err));

app.get('/', (req,res)=>{res.send('EXPRESS')});

app.post('/register', (req,res)=>{
    const user = new User(req.body)
    user.save((err, doc)=>{
        if(err) return res.json({success: false, err});
        return res.status(200).json({
            success: true
        });
    });
})

app.listen(port,()=>{console.log(`Example app listening on port ${port}`)});