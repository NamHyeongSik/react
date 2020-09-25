const {User} = require('../models/user');

let auth = function(req,res,next){
    //client cookie에서 token 가져오기
    let token = req.cookies.x_auth;
    //token decode
    User.findByToken(token, (err,user)=>{
        if(err) throw err;
        if(!user) return res.json({isAuth: false, error: true});

        //이렇게 req로 넘겨주면 index.js에서 req.token으로 token값을 그대로 불러올 수 있음.
        req.token = token;
        req.user = user;
        next();
    });
}

module.exports = { auth };