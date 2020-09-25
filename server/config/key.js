//process.env.NODE_ENV = 환경변수
//환경변수가 Deploy(배포한 후)mode면 prod에서 가져오고 local에서의 development mode면 dev에서 가져오도록!
if(process.env.NODE_ENV ==='production'){
    module.exports = require('./prod');
}else{
    module.exports = require('./dev');
}