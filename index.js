var express = require('express');

// 세션용 모듈
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();



//path
const path = require('path');

//
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname, '/assets')))

// 화면 엔진 ejs 설정
app.set('/', path.join(__dirname, '/'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// 세션모듈의 설정
app.use(session({
    secret: 'a98yhfi&o2u3bn0(rfuw-gvjoiah3@0945u23r#',
    resave: false,
    saveUninitialized: true
}));
app.get('/count', function(req, res){
    if(req.session.count){
        req.session.count++;
    }
    else{
        req.session.count = 1;
    }
    res.send('count : ' + req.session.count);
});

// 사용자 페이지, 세션값 유무에 따라서 다른 메세지를 표시
app.get('/welcome', function(req, res){
    if(req.session.displayName){
        res.render('main.html', {username : req.session.displayName})
        res.sendFile(__dirname + '/main.html');
    } else {
        res.redirect('/login');
        // `
        //     <h2>Please login..</h2>
        //     <a href="/login">login</a>
        // `
    }
});
//스플래시 페이지
app.get('/', function(req, res){
    res.sendFile(__dirname + '/splash.html');
});
// 로그인 폼 페이지
app.get('/login', function(req, res){
    res.sendFile(__dirname + '/login.html');
});
// 회원가입 폼페이지
app.get('/signup', function(req, res){
    res.sendFile(__dirname + '/signup.html');
});
// 로그아웃 처리 - 세션 삭제 후 리다이렉트
app.get('/auth/logout', function(req, res){
    delete req.session.displayName;
    res.redirect('/welcome');
});
// 로그인 처리 - 아이디와 패스워드 비교해서 일치하면 세션에 값을 부여하고 리다이렉트
app.post('/auth/login', function(req, res){
    var user = {
        username:'guest',
        password:'1234',
        displayName:'GUEST'
    };
    var uname = req.body.username;
    var pwd = req.body.password;
    if(uname === user.username && pwd === user.password){
        req.session.displayName = user.displayName;
        res.redirect('/welcome');
    } else {
        res.send('로그인 실패 <a href="/login">login</a>');
    }
    res.send(uname);
});
app.listen(8080, function(){
    console.log('127.0.0.1:3000 으로 시작');
});
