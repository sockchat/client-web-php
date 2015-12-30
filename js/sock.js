/// <reference path="utils.ts" />
/// <reference path="msg.ts" />
/// <reference path="ui.ts" />
/// <reference path="chat.ts" />
var Socket = (function () {
    function Socket() {
    }
    Socket.init = function () {
        if (this.addr == null)
            throw "Server Address is not configured in sock.js!";
        this.sock = new WebSocket(this.addr);
        this.sock.binaryType = "arraybuffer";
        this.sock.onopen = this.onOpen;
        this.sock.onmessage = this.onRecv;
        this.sock.onerror = this.onError;
        this.sock.onclose = this.onClose;
    };
    Socket.sendRaw = function (msg) {
        this.sock.send(msg);
    };
    Socket.send = function (id, arr) {
        this.sock.send(Message.pack(id, arr));
    };
    Socket.ping = function () {
        Socket.send(0, ["ping"]);
    };
    Socket.onOpen = function (e) {
        if (Socket.pingThread != null) {
            clearInterval(Socket.pingThread);
            Socket.pingThread = null;
        }
        ChatWindow.HideDisconnectedMessage();
        Socket.send(1, Socket.args);
    };
    Socket.onRecv = function (e) {
        var msg = Message.unpack(new Uint8Array(e.data)), parts = msg.parts, strs = parts.map(function (part) {
            try {
                return part.toString();
            }
            catch (e) {
                return "";
            }
        });
        console.log(msg.id);
        console.log(strs);
        switch (msg.id) {
            case 1:
                if (strs[0] == "1") {
                    ChatWindow.Show();
                    Socket.send(5, ["1", "0"]);
                }
                break;
            case 2:
                ChatWindow.AddMessage(parseInt(strs[6]), new User(parseInt(strs[1]), strs[2], strs[3], strs[4]), strs[5]);
                break;
        }
    };
    Socket.onError = function (e) {
    };
    Socket.onClose = function (e) {
        if (Chat.shouldReconnect()) {
            ChatWindow.ShowDisconnectedMessage();
            Socket.init();
        }
    };
    Socket.pingThread = null;
    Socket.kicked = false;
    return Socket;
})();
//# sourceMappingURL=sock.js.map