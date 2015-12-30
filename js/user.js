/// <reference path="utils.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Permissions = (function () {
    function Permissions(permstr) {
    }
    return Permissions;
})();
var User = (function () {
    function User(id, name, originalName, color, perms) {
        this.id = id;
        this.name = name;
        this._name = originalName;
        this.color = color;
        this.perms = new Permissions(perms);
    }
    return User;
})();
var Self = (function (_super) {
    __extends(Self, _super);
    function Self() {
        _super.apply(this, arguments);
        this.channels = {};
    }
    return Self;
})(User);
//# sourceMappingURL=user.js.map