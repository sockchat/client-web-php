/// <reference path="sock.ts" />
/// <reference path="msg.ts" />
/// <reference path="channel.ts" />
/// <reference path="user.ts" />
var Chat = (function () {
    function Chat() {
    }
    Chat.main = function () {
        if (Socket.args[0] == "yes") {
            Socket.args[0] = "0";
            Socket.init();
        }
        else
            window.location.href = Socket.redirectUrl;
    };
    Chat.processMessageBox = function () {
        var msgbox = document.getElementById("message");
        if (msgbox.value.trim() != "") {
            Chat.sendMessage(msgbox.value);
            msgbox.value = "";
        }
    };
    Chat.sendMessage = function (msg) {
        if (msg.trim() != "")
            Socket.send(2, [msg.trim(), "0"]);
    };
    Chat.disableReconnect = function () {
        Chat.shouldAttemptReconnect = false;
    };
    Chat.shouldReconnect = function () {
        return Chat.shouldAttemptReconnect;
    };
    Chat.channelList = {};
    Chat.shouldAttemptReconnect = true;
    return Chat;
})();
window.onload = function () {
    document.getElementById("message").onkeydown = function (e) {
        var key = ('which' in e) ? e.which : e.keyCode;
        if (key == 13 && !e.shiftKey) {
            Chat.processMessageBox();
            if (e.preventDefault)
                e.preventDefault();
            return false;
        }
    };
    Chat.main();
};
window.onbeforeunload = function () {
    Chat.disableReconnect();
};
//# sourceMappingURL=chat.js.map