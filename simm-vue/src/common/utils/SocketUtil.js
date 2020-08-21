var myWebsocket = null;
let cacheData = {};
let vueStore = {};
let userInfo = {};
let lockReconnect = false;
let componentListenerSet = new Set();
//初始化websocket
function createWebSocket(){
    var baseServerURI = cacheData.serverURI;
    // ws请求地址处理
    var socketBaseUrl = baseServerURI.replace("http","ws").replace("https","wss");
    userInfo = cacheData.userInfo; // 用户信息
    var userNo = userInfo == null ? "null" : userInfo.user_no;
    var wsUrl = socketBaseUrl + "/socketServer/" + userNo;
    myWebsocket = new WebSocket(wsUrl);

}

function initWebSocket(){
    createWebSocket();
    myWebsocket.onmessage = function(e){
        onMessage(e);
    }
    myWebsocket.onclose = function(e){
        webSocketClose(e);
    }
}

function reconnect() {
    if(lockReconnect) {
        return;
    }
    lockReconnect = true;
    //没连接上会一直重连，设置延迟避免请求过多
    setTimeout(function () {
        initWebSocket();
        lockReconnect = false;
    }, 10000);
}

// 数据接收
function onMessage(e){
    var message = JSON.parse(e.data);
    // 通知组件
    noticeComp(message);
    console.log("接收后端消息",message);
}

//关闭 区分超时、网络原因断开  还是登出断开 a=="logout"
function webSocketClose(a){
    if(a == "logout"){
        myWebsocket.close();
        console.log("socket连接已断开");
        return;
    }
    // 否则 重连 连接关闭则清理
    reconnect();
    console.log("socket连接已断开,重新连接");
}
// 维护子组件
function addComponent(comp){
    componentListenerSet.add(comp);
}

function removeComponent(comp){
    if(componentListenerSet.has(comp)){
        componentListenerSet.delete(comp);
    }
}

function noticeComp(msg){
    componentListenerSet.forEach(compObj=>{
      if(compObj.callback){
          compObj.callback(msg);
      }
    });
}

export default {
    setSocketCacheData:function(vueInstance){
        vueStore = vueInstance.$store;
        cacheData = vueStore.state;
    },
    initWebSocket,
    webSocketClose,
    addComponent,
    removeComponent
}