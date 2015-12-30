/// <reference path="utils.ts" />

class Permissions {
    public constructor(permstr: string) {

    }
}

class User {
    public id: number;
    public name: string;
    public _name: string;
    public color: string;
    public perms: Permissions;

    public constructor(id: number, name: string, originalName: string, color: string, perms: string) {
        this.id = id;
        this.name = name;
        this._name = originalName;
        this.color = color;
        this.perms = new Permissions(perms);
    }
}

class Self extends User {
    public channels: any = {};
}