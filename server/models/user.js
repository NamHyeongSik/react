const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;      //salt를 이용해서 비밀번호 암호화, 그 salt의 자릿수
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email:{
        type: String,
        trim: true,
        unique: 1
    },
    password:{
        type: String,
        minlength:5
    },
    role:{
        type: Number,
        default: 0
    },
    image:{
        type: String
    },
    token:{
        type: String
    },
    tokenExp:{
        type: Number
    }
});
//pre도 mongoose에서 가져온 method, user에 data저장하기 전에 실행된다.
userSchema.pre('save', function(next){
    let user = this;    //index.js에서 req.body로 받아오므로 this가 userSchema를 가리킬 수 있음.
    if(user.isModified('password')){    //password가 수정될때만 암호화
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err);
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err);
                user.password = hash;
                next();
            });
        });
    }else{
        next();
    }
});

userSchema.methods.comparePassword = function(plainPassword, callback){
    bcrypt.compare(plainPassword, this.password, (err,isMatch)=>{
        if(err) return callback(err);
        callback(null, isMatch);
    });
}

userSchema.methods.generateToken = function(cb){
    let user = this;

    let token = jwt.sign(user._id.toHexString(), 'secretToken');

    user.token = token;

    user.save(function(err, user){
        if(err) return cb(err);
        cb(null, user);
    });
}

userSchema.statics.findByToken = function(token, callback){
    let user = this;

    jwt.verify(token, 'secretToken', (err, decoded)=>{
        user.findOne({"_id":decoded, "token": token}, (err,user)=>{
            if(err) return callback(err);
            callback(null, user);
        });
    });
}

const User = mongoose.model('User', userSchema);

module.exports = {User};