/// <reference path="utils.ts" />
/// <reference path="msg.ts" />
/// <reference path="ui.ts" />
/// <reference path="chat.ts" />

class Socket {
    static sock: WebSocket;
    static args: string[];
    static redirectUrl: string;

    static addr: string;
    static pingThread: any = null;
    static kicked: boolean = false;

    public static init() {
        if(this.addr == null)
            throw "Server Address is not configured in sock.js!";

        this.sock = new WebSocket(this.addr);
        this.sock.binaryType = "arraybuffer";

        this.sock.onopen    = this.onOpen;
        this.sock.onmessage = this.onRecv;
        this.sock.onerror   = this.onError;
        this.sock.onclose   = this.onClose;
    }

    public static sendRaw(msg: Uint8Array) {
        this.sock.send(msg);
    }

    public static send(id: number, arr: any[]) {
        this.sock.send(Message.pack(id, arr));
    }

    private static ping() {
        Socket.send(0, ["ping"]);
    }

    public static onOpen(e) {
        if(Socket.pingThread != null) {
            clearInterval(Socket.pingThread);
            Socket.pingThread = null;
        }

        ChatWindow.HideDisconnectedMessage();
        Socket.send(1, Socket.args);
    }

    public static onRecv(e) {
        var msg = Message.unpack(new Uint8Array(e.data)),
            parts = msg.parts,
            strs = parts.map((part: Uint8Array) => {
                try {
                    return part.toString();
                } catch(e) {
                    return "";
                }
            });

        console.log(msg.id);
        console.log(strs);

        switch(msg.id) {
            case 1:
                if(strs[0] == "1") {
                    ChatWindow.Show();
                    Socket.send(5, ["1", "0"]);
                }
                break;
            case 2:
                ChatWindow.AddMessage(
                    parseInt(strs[6]),
                    new User(parseInt(strs[1]), strs[2], strs[3], strs[4]),
                    strs[5]
                );
                break;
        }
    }

    public static onError(e) {

    }

    public static onClose(e) {
        if(Chat.shouldReconnect()) {
            ChatWindow.ShowDisconnectedMessage();
            Socket.init();
        }
    }
}