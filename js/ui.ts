/// <reference path="user.ts" />
/// <reference path="utils.ts" />

class Title {
    private static chatTitle = "";
    private static username = "";
    private static num = 0;

    private static startNum = 6;
    private static enableStrobing = true;

    private static started = false;
    private static on = false;

    static strobeCallback() {
        if(!Title.enableStrobing) Title.num = 0;
        if(Title.num > 0) {
            document.title = (Title.on?"[@ ]":"[ @]") +" "+ Title.username +" - "+ Title.chatTitle;
            Title.num--;
            Title.on = !Title.on;
        } else Title.Normalize();
    }

    static Strobe(name: string) {
        if(Title.chatTitle == "")
            Title.chatTitle = document.title;

        Title.num = Title.startNum;
        Title.username = name;

        if(!Title.started) {
            Title.started = true;
            setInterval("Title.strobeCallback();", 500);
        }
    }

    static Normalize() {
        document.title = Title.chatTitle;
    }
}

class ConnectionWindow {
    public static Show(isLoadingChat: boolean = false) {
        document.getElementById("chat").className = "hidden";
        document.getElementById("connectionMessage").className = isLoadingChat ? "loadingChat" : "";
        document.getElementById("connectionMessageSub").className = isLoadingChat ? "hidden" : "";
    }

    public static SetConnectionTitle(title: string) {
        document.getElementById("connectionMessageTitle").innerHTML = title;
    }
}

class ChatWindow {
    public static Show() {
        document.getElementById("chat").className = "";
        document.getElementById("connectionMessage").className = "hidden";
    }

    public static AddMessage(msgid: number, user: User, msg: string) {
        var chatmsg = document.createElement("div");

        var date = new Date();
        var datespan = document.createElement("span");
        datespan.className = "date";
        datespan.innerHTML = "("+ (<Number>date.getHours()).zeroPad() +":"+ (<Number>date.getMinutes()).zeroPad() +":"+ (<Number>date.getSeconds()).zeroPad() +")";
        chatmsg.appendChild(datespan);

        chatmsg.appendChild(document.createTextNode(" "));

        var userspan = document.createElement("span");
        userspan.style.fontWeight = "bold";
        userspan.style.color = user.color;
        userspan.innerHTML = user.name.sanitize();
        userspan.onclick = () => { /* TODO add name to textbox */ };
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
    }

    public static ShowDisconnectedMessage() {
        document.getElementById("disconnectMessage").className = "";
    }

    public static HideDisconnectedMessage() {
        document.getElementById("disconnectMessage").className = "hidden";
    }

    public static ScrollToBottom() {
        document.getElementById("chatList").scrollTop = document.getElementById("chatList").scrollHeight;
    }
}