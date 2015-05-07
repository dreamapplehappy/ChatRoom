// 在 Cloud code 里初始化 Express 框架
var express = require('express');
var app = express();
var http = require('http').Server(app);
// var socket = require('socket.io');
// var io = socket.listen(http);
// var io = require('socket.io')(http);

// 最后，必须有这行代码来使 express 响应 HTTP 请求
app.listen();


// App 全局配置
app.set('views','cloud/views');   // 设置模板目录
app.set('view engine', 'ejs');    // 设置 template 引擎
app.use(express.bodyParser());    // 读取请求 body 的中间件

// 使用 Express 路由 API 服务 /hello 的 HTTP GET 请求
app.get('/', function(req, res) {
  res.render('index');
});

/*io.on('connection', function(socket){
	socket.emit('hello', "nima");
});*/

