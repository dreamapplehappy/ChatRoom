$(function(){
	var appId = 'det7pyzdvc9nu77pv4s7o2m9g0s0z1hauob2i68js86kah22';
var roomId = '554b4c72e4b0fe5138c274e6';
var clientId = 'dreamapple';
var rt;
var room;
var connection = true;
var log = false;
var msgTime;

var crLogin = $('#cr-login');
var crLogout = $('#cr-logout');
var crList = $('#cr-list');
var crSend = $('#cr-send');
var crUsername = $('#cr-username');
var crMsg = $('#cr-msg');
var printWall = $('#printWall');

crLogin.click(main);
crSend.click(sendMsg);

/*bindEvent(document.body, 'keydown', function(e) {
    if (e.keyCode === 13) {
        if (firstFlag) {
            main();
        } else {
            sendMsg();
        }
    }
});*/


function main() {
    showLog('正在链接服务器，请等待。。。');
    var val = crUsername.val();
    if (val) {
        clientId = val;
    }
    if (!connection) {
        rt.close();
    }

    rt = AV.realtime({
        appId: appId,
        clientId: clientId
    });

    rt.on('open', function() {
        connection = false;
        showLog('服务器连接成功！');

        rt.room(roomId, function(object) {
            if (object) {
                room = object;
                room.list(function(data) {
                    showLog('当前 Conversation 的成员列表：', data);
                    var l = data.length;

                    if (l > 499) {
                        conv.remove(data[30], function(data) {
                            showLog('人数过多，踢掉:', data[30]);
                        });
                    }

                    getLog(function() {
                        room.join(function() {
                            showLog('已经加入，可以开始聊天。');
                            printWall.scrollTop = printWall.scrollHeight;
                        });
                    });
                });

                room.receive(function(data) {
                    if (!msgTime) {
                        msgTime = data.timestamp;
                    }
                    showMsg(data);
                });
            }
            // 如果服务器端不存在这个 conversation
            else {
                showLog('服务器不存在这个 conversation，你需要创建一个。');
            }
        });
    });
    rt.on('reuse', function() {
        showLog('服务器正在重连，请耐心等待。。。');
    });
}

function sendMsg() {
    if (connection) {
        alert('请先连接服务器！');
        return;
    }
    var val = crMsg.val();
    if (!String(val).replace(/^\s+/, '').replace(/\s+$/, '')) {
        alert('请输入点文字！');
    }
    room.send({
        text: val
    }, {
        type: 'text'
    }, function(data) {
        inputSend.value = '';
        showLog('（' + formatTime(data.t) + '）  自己： ', val);
        printWall.scrollTop = printWall.scrollHeight;
    });
}

function getLog(callback) {
    var height = printWall.scrollHeight;
    if (log) {
        return;
    } else {
        log = true;
    }
    room.log({
        t: msgTime
    }, function(data) {
        log = false;
        var l = data.length;
        if (l) {
            msgTime = data[0].timestamp;
        }
        for (var i = l - 1; i >= 0; i --) {
            showMsg(data[i], true);
        }
        if (l) {
            printWall.scrollTop = printWall.scrollHeight - height;
        }
        if (callback) {
            callback();   
        }
    });
}

function showLog(msg, data, isBefore) {
    if (data) {
        msg = msg + '<span class="strong">' + encodeHTML(JSON.stringify(data)) + '</span>';
    }
    var p = document.createElement('p');
    p.innerHTML = msg;
    if (isBefore) {
        printWall.insertBefore(p, printWall.childNodes[0]);
    } else {
        printWall.appendChild(p);
    }
}

function encodeHTML(source) {
    return String(source)
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;');
}

function formatTime(time) {
    var date = new Date(time);
    var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    var currentDate = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var hh = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var mm = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    var ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return date.getFullYear() + '-' + month + '-' + currentDate+' '+ hh + ':' + mm + ':' + ss;
}


});