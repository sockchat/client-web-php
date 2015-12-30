/// <reference path="user.ts" />
var Channel = (function () {
    function Channel(id, name, isPasswordProtected, isTemporary) {
        this.users = {};
        this.id = id;
        this.name = name;
        this.isPasswordProtected = isPasswordProtected;
        this.isTemporary = isTemporary;
        this.logs = document.createElement("div");
        this.logs.id = "chatList";
    }
    return Channel;
})();
//# sourceMappingURL=channel.js.map