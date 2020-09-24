const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require('./config/key');
const {User} = require('./models/user');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(()=>console.log('MongoDB Connected...'))
.catch(err=>console.log(err));

app.get('/', (req,res)=>{res.send('EXPRESS')});

app.post('/register', (req,res)=>{
    const user = new User(req.body)
    //.save는 mongodb의 method 
    user.save((err, userInfo)=>{
        if(err) return res.json({success: false, err});
        return res.status(200).json({
            success: true
        });
    });
})

app.post('/login', (req,res)=>{
    User.findOne({email: req.body.email}, (err,user)=>{
        if(!user){
            return res.json({
                loginSuccess: false,
                messgae: "없는 이메일입니다."
            });
        }
        //custom method, user.js에서 만든다
        user.comparePassword(req.body.password, (err,isMatch)=>{
            if(!isMatch) 
                return res.json({loginSuccess: false, message: "비밀번호가 틀렸습니다."});
            console.log(user.token);
            user.generateToken((err,user)=>{
                
                if(err) return res.status(400).send(err);
                //토큰을 저장 : 쿠키 or localstorage or session, 여기서는 cookie에 저장
                res.cookie("x_auth", user.token)
                .status(200)
                .json({ loginSuccess: true, userId: user._id });
            })
        })
    })
})

app.listen(port,()=>{console.log(`Example app listening on port ${port}`)});