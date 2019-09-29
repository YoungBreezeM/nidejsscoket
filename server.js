var ws = require("nodejs-websocket");
console.log("开始建立连接...");

let userMap = new Map([]);
var server = ws.createServer(function(conn){//创建连接
    conn.on("text", function (str) {
        let data = JSON.parse(str);//解析数据
        let userList = [{user:"public"}];//用户列表
        console.log(data);
        if(data.user&&!data.message){//用户列表,登陆信息反馈
            loginStatus(userMap,userList,conn,data);
        }else if(data.user&&data.message&&data.target){//信息通信模块
            if(data.target!=="public"){//单点通信
                pointCommunication(userMap,data);
            }else{//公共通信
                broadcast(server,str);
            }
        }
    });
    conn.on("close", function (code, reason) {
        console.log("关闭连接")
    });
    conn.on("error", function (code, reason) {
        console.log("异常关闭")
    });
}).listen(8080);
function broadcast(server, msg) {//信息广播
    server.connections.forEach((conn)=>{
        conn.sendText(msg);
    })
}
function pointCommunication(userMap,data){//当点登陆
    userMap.get(data.user).conn.sendText(JSON.stringify({user:data.user,message:data.message}));//发送给用户
    userMap.get(data.target).conn.sendText(JSON.stringify({user:data.user,message:data.message}));//发送给目标用户
}
function loginStatus(userMap,userList,conn,data){//用户信息反馈
    userMap.set(data.user,{conn:conn,ip:null});//缓存用户信息
    userMap.forEach((value, key)=>{//遍历用户列表
        userList.push({"user":key});
    });
    broadcast(server,JSON.stringify({user:data.user,userList:userList}));
}
console.log("WebSocket建立完毕");