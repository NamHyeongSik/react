const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require('./config/key');
const {auth} = require('./middleware/auth');
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

app.post('/api/users/register', (req,res)=>{
    const user = new User(req.body)
    //.save는 mongodb의 method 
    user.save((err, userInfo)=>{
        if(err) return res.json({success: false, err});
        return res.status(200).json({
            success: true
        });
    });
});

app.post('/api/users/login', (req,res)=>{
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
            
            user.generateToken((err,user)=>{
                
                if(err) return res.status(400).send(err);
                //토큰을 저장 : 쿠키 or localstorage or session, 여기서는 cookie에 저장
                res.cookie("x_auth", user.token)
                .status(200)
                .json({ loginSuccess: true, userId: user._id });
            });
        });
    });
});

//'auth'라는 middleware를 먼저 실행, next()로 빠져나온다.
app.get('/api/users/auth', auth ,(req,res)=>{
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,    //일단은 0이면 일반, 0이아니면 관리자
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        image: req.user.image
    });
});

app.get('/api/users/logout', auth, (req,res)=>{
    User.findOneAndUpdate({_id: req.user._id},{token: ""}, (err,user)=>{
            if(err) return res.json({success: false, err});
            return res.status(200).send({success: true});
    });
});

app.listen(port,()=>{console.log(`Example app listening on port ${port}`)});