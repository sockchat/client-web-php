/// <reference path="user.ts" />
/// <reference path="utils.ts" />
var Title = (function () {
    function Title() {
    }
    Title.strobeCallback = function () {
        if (!Title.enableStrobing)
            Title.num = 0;
        if (Title.num > 0) {
            document.title = (Title.on ? "[@ ]" : "[ @]") + " " + Title.username + " - " + Title.chatTitle;
            Title.num--;
            Title.on = !Title.on;
        }
        else
            Title.Normalize();
    };
    Title.Strobe = function (name) {
        if (Title.chatTitle == "")
            Title.chatTitle = document.title;
        Title.num = Title.startNum;
        Title.username = name;
        if (!Title.started) {
            Title.started = true;
            setInterval("Title.strobeCallback();", 500);
        }
    };
    Title.Normalize = function () {
        document.title = Title.chatTitle;
    };
    Title.chatTitle = "";
    Title.username = "";
    Title.num = 0;
    Title.startNum = 6;
    Title.enableStrobing = true;
    Title.started = false;
    Title.on = false;
    return Title;
})();
var ConnectionWindow = (function () {
    function ConnectionWindow() {
    }
    ConnectionWindow.Show = function (isLoadingChat) {
        if (isLoadingChat === void 0) { isLoadingChat = false; }
        document.getElementById("chat").className = "hidden";
        document.getElementById("connectionMessage").className = isLoadingChat ? "loadingChat" : "";
        document.getElementById("connectionMessageSub").className = isLoadingChat ? "hidden" : "";
    };
    ConnectionWindow.SetConnectionTitle = function (title) {
        document.getElementById("connectionMessageTitle").innerHTML = title;
    };
    return ConnectionWindow;
})();
var ChatWindow = (function () {
    function ChatWindow() {
    }
    ChatWindow.Show = function () {
        document.getElementById("chat").className = "";
        document.getElementById("connectionMessage").className = "hidden";
    };
    ChatWindow.AddMessage = function (msgid, user, msg) {
        var chatmsg = document.createElement("div");
        var date = new Date();
        var datespan = document.createElement("span");
        datespan.className = "date";
        datespan.innerHTML = "(" + date.getHours().zeroPad() + ":" + date.getMinutes().zeroPad() + ":" + date.getSeconds().zeroPad() + ")";
        chatmsg.appendChild(datespan);
        chatmsg.appendChild(document.createTextNode(" "));
        var userspan = document.createElement("span");
        userspan.style.fontWeight = "bold";
        userspan.style.color = user.color;
        userspan.innerHTML = user.name.sanitize();
        userspan.onclick = function () {
        };
        chatmsg.appendChild(userspan);
        var msgcolon = document.createElement("span");
        msgcolon.className = "msgColon";
        msgcolon.innerHTML = ": ";
        chatmsg.appendChild(msgcolon);
        var msgbreak = document.createElement("span");
        msgbreak.className = "msgBreak";
        msgbreak.innerHTML = ""; // TODO replace with <br />
        chatmsg.appendChild(msgbreak);
        chatmsg.innerHTML += msg.sanitize();
        Title.Strobe(user.name);
        document.getElementById("chatList").appendChild(chatmsg);
        ChatWindow.ScrollToBottom();
    };
    ChatWindow.ShowDisconnectedMessage = function () {
        document.getElementById("disconnectMessage").className = "";
    };
    ChatWindow.HideDisconnectedMessage = function () {
        document.getElementById("disconnectMessage").className = "hidden";
    };
    ChatWindow.ScrollToBottom = function () {
        document.getElementById("chatList").scrollTop = document.getElementById("chatList").scrollHeight;
    };
    return ChatWindow;
})();
//# sourceMappingURL=ui.js.map