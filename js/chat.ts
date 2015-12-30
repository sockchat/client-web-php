/// <reference path="sock.ts" />
/// <reference path="msg.ts" />
/// <reference path="channel.ts" />
/// <reference path="user.ts" />

class Chat {
    private static self: Self;
    private static channelList: any = {};
    private static shouldAttemptReconnect: boolean = true;

    public static main() {
        if(Socket.args[0] == "yes") {
            Socket.args[0] = "0";
            Socket.init();
        } else window.location.href = Socket.redirectUrl;
    }

    public static processMessageBox() {
        var msgbox = <HTMLTextAreaElement>document.getElementById("message");
        if(msgbox.value.trim() != "") {
            Chat.sendMessage(msgbox.value);
            msgbox.value = "";
        }
    }

    public static sendMessage(msg: string) {
        if(msg.trim() != "")
            Socket.send(2, [msg.trim(), "0"]);
    }

    public static disableReconnect() {
        Chat.shouldAttemptReconnect = false;
    }

    public static shouldReconnect(): boolean {
        return Chat.shouldAttemptReconnect;
    }
}

window.onload = function() {
    document.getElementById("message").onkeydown = function(e) {
        var key = ('which' in e) ? e.which : e.keyCode;
        if(key == 13 && !e.shiftKey) {
            Chat.processMessageBox();
            if(e.preventDefault)
                e.preventDefault();
            return false;
        }
    };

    Chat.main();
};

window.onbeforeunload = function() {
    Chat.disableReconnect();
};