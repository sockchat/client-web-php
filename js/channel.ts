/// <reference path="user.ts" />

class Channel {
    public id: number;
    public name: string;
    public isPasswordProtected: boolean;
    public isTemporary: boolean;

    public users: any = {};
    public logs: HTMLDivElement;

    public constructor(id: number, name: string, isPasswordProtected: boolean, isTemporary: boolean) {
        this.id = id;
        this.name = name;
        this.isPasswordProtected = isPasswordProtected;
        this.isTemporary = isTemporary;

        this.logs = document.createElement("div");
        this.logs.id = "chatList";
    }
}