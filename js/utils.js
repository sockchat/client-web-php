/// <reference path="ui.ts" />
/// <reference path="utf8.d.ts" />
String.prototype.replaceAll = function (needle, replace, ignoreCase) {
    if (ignoreCase === void 0) { ignoreCase = false; }
    if ((typeof needle) == "string")
        return this.replace(new RegExp(needle.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"), (ignoreCase ? "gi" : "g")), (typeof (replace) == "string") ? replace.replace(/\$/g, "$$$$") : replace);
    else {
        var retval = this;
        for (var i in needle) {
            if ((typeof replace) == "string")
                retval = retval.replaceAll(needle[i], replace, ignoreCase);
            else
                retval = retval.replaceAll(needle[i], replace[i], ignoreCase);
        }
        return retval;
    }
};
String.prototype.contains = function (needle, ignoreCase) {
    if (ignoreCase === void 0) { ignoreCase = false; }
    return ignoreCase ? this.toLowerCase().indexOf(needle.toLowerCase()) != -1 : this.indexOf(needle) != -1;
};
String.prototype.sanitize = function () {
    return this.replaceAll(["&", ">", "<", "\n"], ["&amp;", "&gt;", "&lt;", " <br /> "]);
};
String.prototype.sanitizeRegex = function () {
    var out = "";
    for (var i = 0; i < this.length; i++) {
        var cc = this.charCodeAt(i);
        if (!((cc > 47 && cc < 58) || (cc > 64 && cc < 91) || (cc > 96 && cc < 123)))
            out += "\\";
        out += this.charAt(i);
    }
    return out;
};
String.prototype.stripCharacters = function (chars) {
    var copy = this;
    if (chars != "")
        copy = copy.replaceAll(chars.split(""), "");
    return copy;
};
String.prototype.hasUnicodeCharacter = function () {
    for (var i = 0; i < this.length; i++) {
        if (this.charCodeAt(i) > 127)
            return true;
    }
    return false;
};
String.prototype.byteLength = function () {
    return utf8.encode(this).length;
};
String.prototype.toByteArray = function () {
    var str = utf8.encode(this);
    var ret = new Uint8Array(str.length);
    for (var i = 0; i < str.length; i++)
        ret[i] = str.charCodeAt(i);
    return ret;
};
HTMLSelectElement.prototype.getOptionByValue = function (value) {
    for (var option in this.options)
        if (this.options[option].value == value)
            return this.options[option];
    return null;
};
HTMLSelectElement.prototype.getIndexByValue = function (value) {
    for (var option in this.options)
        if (this.options[option].value == value)
            return option;
    return -1;
};
Date.unixNow = function () {
    return (new Date()).toUnixTime();
};
Date.prototype.toUnixTime = function () {
    return Math.floor(this.getTime() / 1000);
};
Date.prototype.toDateTimeString = function () {
    return (this.getTime() < 0) ? UI.langs[UI.currentLang].menuText["eot"] : this.toDateString() + " @ " + this.getHours().zeroPad() + ":" + this.getMinutes().zeroPad() + ":" + this.getSeconds().zeroPad();
};
Date.prototype.toTimeString = function () {
    return this.getHours().zeroPad() + ":" + this.getMinutes().zeroPad() + ":" + this.getSeconds().zeroPad();
};
Number.prototype.zeroPad = function (mag) {
    if (mag === void 0) { mag = 1; }
    var ret = "" + this;
    for (; this < Math.pow(10, mag) && mag != 0; --mag)
        ret = "0" + ret;
    return ret;
};
Number.prototype.packBytes = function (bytes) {
    var ret = new Uint8Array(bytes);
    for (var i = 0; i < bytes; i++)
        ret[i] = (this & (0xFF << 8 * (bytes - 1 - i))) >>> 8 * (bytes - 1 - i);
    return ret;
};
Uint8Array.prototype.unpackBytes = function () {
    var ret = 0;
    for (var i = 0; i < this.length; i++)
        ret = ret | ((this[i] & 0xFF) << 8 * (this.length - 1 - i));
    return ret;
};
Uint8Array.prototype.toString = function () {
    var chunkSize = 10000;
    var raw = "";
    for (var i = 0;; i++) {
        if (this.length < chunkSize * i)
            break;
        raw += String.fromCharCode.apply(null, this.subarray(chunkSize * i, chunkSize * i + chunkSize));
    }
    return utf8.decode(raw);
};
// ** GENERIC UTILS CLASS ** \\
var Utils = (function () {
    function Utils() {
    }
    Utils.formatBotMessage = function (type, id, params) {
        if (params === void 0) { params = []; }
        return type + "\f" + id + "\f" + params.join("\f");
    };
    Utils.fetchPage = function (url) {
        var req = new XMLHttpRequest();
        req.open("GET", url, false);
        req.send(null);
        if (req.status === 200)
            return req.responseText;
        else
            return "";
    };
    Utils.embedVideo = function (link) {
        var id = link.parentElement.title;
        var holder = link.parentElement.getElementsByTagName("span")[0];
        holder.innerHTML = holder.title == "link" ? "<iframe width='560' height='315' src='//www.youtube.com/embed/" + id + "' frameborder='0' allowfullscreen></iframe>" : "<a href='https://www.youtube.com/watch?v=" + id + "' onclick='window.open(this.href);return false;'>https://www.youtube.com/watch?v=" + id + "</a>";
        link.innerHTML = holder.title == "link" ? "Remove" : "Embed";
        holder.title = holder.title == "link" ? "video" : "link";
    };
    Utils.embedImage = function (link) {
        var id = link.parentElement.title;
        var holder = link.parentElement.getElementsByTagName("span")[0];
        var imglink = holder.getElementsByTagName("a")[0];
        imglink.innerHTML = holder.title == "link" ? "<img src='" + id + "' alt='userimg' class='insertImage' />" : id;
        link.innerHTML = holder.title == "link" ? "Remove" : "Embed";
        holder.title = holder.title == "link" ? "image" : "link";
    };
    Utils.random = function (min, max) {
        return Math.round(Math.random() * (max - min)) + min;
    };
    return Utils;
})();
//# sourceMappingURL=utils.js.map