/// <reference path="utils.ts" />

class Message {
    public id: number;
    public parts: Uint8Array[] = [];
    public valid: boolean = true;

    public static error(): Message {
        var ret = new Message();
        ret.id = -1;
        ret.parts = [];
        ret.valid = false;
        return ret;
    }

    public static pack(id: number, arr: any[]): Uint8Array {
        var ret: Uint8Array;
        if(arr.length > 0xFF)
            arr = arr.slice(0, 0xFF);

        var headerSize = 3;
        var bodySize = 0;
        for(var i in arr) {
            if((typeof arr[i]).toLowerCase() == "string" || (typeof arr[i]).toLowerCase() == "number") {
                if((typeof arr[i]).toLowerCase() == "number")
                    arr[i] = ""+ arr[i];

                var length = <number>arr[i].byteLength();
            } else
                var length = <number>arr[i].length;

            if(length < 254)
                headerSize += 1;
            else if(length <= 0xFFFF)
                headerSize += 3;
            else if(length <= 0xFFFFFFFF)
                headerSize += 5;
            else continue;

            bodySize += length;
        }
        ret = new Uint8Array(headerSize + bodySize);

        var ptrs = [3, headerSize];
        ret.set(id.packBytes(2));
        var actualSize = 0;
        for(var i in arr) {
            if((typeof arr[i]).toLowerCase() == "string")
                var length = <number>arr[i].byteLength();
            else
                var length = <number>arr[i].length;

            if(length < 254) {
                ret[ptrs[0]] = length;
                ++ptrs[0];
            } else if(length < 0xFFFF) {
                ret[ptrs[0]] = 254;
                ret.set(length.packBytes(2), ptrs[0] + 1);
                ptrs[0] += 3;
            } else if(length < 0xFFFFFFFF) {
                ret[ptrs[0]] = 255;
                ret.set(length.packBytes(4), ptrs[0] + 1);
                ptrs[0] += 5;
            } else continue;

            ++actualSize;
            if((typeof arr[i]).toLowerCase() == "string")
                ret.set(arr[i].toByteArray(), ptrs[1]);
            else
                ret.set(arr[i], ptrs[1]);
            ptrs[1] += length;
        }
        ret[2] = actualSize;

        return ret;
    }

    public static unpack(raw: Uint8Array) : Message {
        var ret = new Message();

        if(raw.length < 3) return Message.error();
        ret.id = raw.subarray(0, 2).unpackBytes();

        var ptr = 3;
        var segments = raw[2];
        var segmentLengths: number[] = [];
        for(var i = 0; i < segments; i++) {
            if(raw.length < ptr) return Message.error();
            if(raw[ptr] < 254)
                segmentLengths.push(raw[ptr]);
            else if(raw[ptr] == 254) {
                if(raw.length < ptr + 2) return Message.error();
                segmentLengths.push(raw.subarray(ptr + 1, ptr + 3).unpackBytes());
                ptr += 2;
            } else if(raw[ptr] == 255) {
                if(raw.length < ptr + 4) return Message.error();
                segmentLengths.push(raw.subarray(ptr + 1, ptr + 5).unpackBytes());
                ptr += 4;
            }
            ptr++;
        }

        if(raw.length < ptr) return Message.error();
        for(var i = 0; i < segments; i++) {
            if(raw.length < ptr + segmentLengths[i]) return Message.error();
            ret.parts[i] = raw.subarray(ptr, ptr + segmentLengths[i]);
            ptr += segmentLengths[i];
        }

        return ret;
    }
}