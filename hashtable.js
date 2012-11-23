var Hashtable = (function () {

    function DataItem(key, value) {
        this._key = key;
        this._value = value;
    }

    function Bucket() {
        this._freeSlots = []; //TODO: This should be a min-heap
        this._items = [];
    }

    function Hashtable(options) {
        this._buckets = {
        };
        this._count = 0;
        this._options = options;
    }

    //Static functions

    ///Converts a string to a numeric hash
    Hashtable.stringToHash = function stringToHash(s) {
        var i;
        var stringData = s;
        var result = 0;
        var char;

        if (s === null || s === undefined) {
            return 0;
        }
        if (typeof (s) !== "string") {
            stringData = s.toString();
        }
        if (!stringData) {
            return 0;
        }
        if (typeof (stringData) !== "string") {
            throw new Error("stringToHash: A string argument expected or any object that implements toString()");
        }
        i = stringData.length - 1;
        while (i > 0) {
            result = stringData.charCodeAt(i) * 31 + result;
            result = result & result;
            i--;
        }
        return result & result;
    };

    /// Compares the first item to the second items and returns true if the two items are equal and false otherwise
    Hashtable.defaultEqual = function (first, second) {
        return first === second;
    }

    /// Returns the hash of a given key based on the provided options
    Hashtable.getHash = function (key, options) {
        if (options && options.hasOwnProperty("getHashCode")) {
            return options.getHashCode(key);
        }

        if (key.getHashCode !== undefined && typeof (key.getHashCode) == "function") {
            return key.getHashCode();
        }

        return key.toString();
    };

    Hashtable.getEqual = function (key, options) {
        if (options && options.equal) {
            return options.equal;
        } else {
            if (key.equal !== undefined && typeof (key.equal) === "function") {
                return key.equal;
            } else {
                return Hashtable.defaultEqual;
            }
        }
    }

    //Searches the given key within the given bucket. If the key is found then returns the index in the _items array,
    //otherwise returns -1
    Hashtable.getKeyIndex = function (bucket, key, options) {
        var i, bucketLength = bucket._items.length, equality, currentItem;
        equality = Hashtable.getEqual(key, options);
        for (i = 0; i < bucketLength; i++) {
            currentItem = bucket._items[i];
            if (currentItem !== undefined && equality(currentItem._key, key)) {
                return i;
            }
        }

        return -1;
    };

    ///A static function that adds the given key value pair to the given bucket
    Hashtable.addToBucket = function (bucket, key, value, options) {
        var i, bucketLength, freeIndex, item = new DataItem(key, value);

        //The bucket has no free slots from previous deletions, add at the end of the items;
        if (bucket._freeSlots.length === 0) {
            bucket._items.push(item);

        } else {
            //The bucket has some free slots!
            freeIndex = bucket._freeSlots.pop();
            bucket._items[freeIndex] = item;
        }
    };

    //Makes sure that the key is valid for the hash table
    Hashtable.verifyKey = function (key) {
        if (key === undefined || key === null) {
            throw new Error("Key cannot be undefined or null");
        }

        return true;
    }

    //Removes the key from the given bucket. Returns false if the key was not found in the bucket
    Hashtable.removeKey = function (bucket, key, options) {

        var index = Hashtable.getKeyIndex(bucket, key, options);
        if (index < 0) {
            return false;
        }

        bucket._items[index] = undefined;
        bucket._freeSlots.push(index);

        return true;
    }


    //Prototype functions

    ///Adds a key value pair to the hash table, returns true if any item was added and false otherwise.
    ///you may specify the overwriteIfExists flag. When overwriteIfExists is true the value of the given key will be replaced (the key will also be replaced) 
    ///if this key already exists in the hash table. When overwriteIfExists is false and the key already exists then nothing will happen but the 
    ///function will return false (since nothing was added)

    Hashtable.prototype.add = function (key, value, overwriteIfExists) {
        var hash, addedItem, bucket, itemIndex;

        if (!Hashtable.verifyKey) {
            return false;
        }

        hash = Hashtable.getHash(key, this._options).toString();
        if (!this._buckets.hasOwnProperty(hash)) {
            this._buckets[hash] = new Bucket();
        }
        bucket = this._buckets[hash];
        itemIndex = Hashtable.getKeyIndex(bucket, key, this._options);
        if (itemIndex >= 0) {
            if (overwriteIfExists) {
                bucket._items[itemIndex] = new DataItem(key, value);
                return true;
            }

            return false;
        } else {
            addedItem = Hashtable.addToBucket(this._buckets[hash], key, value, this._options);
            this._count++;
            return true;
        }
    };

    ///Retrieves the value associated with the given key. If the key doesn't exist null is returned.
    Hashtable.prototype.get = function (key) {
        var hash, addedItem, bucket, itemIndex;

        if (!Hashtable.verifyKey) {
            return false;
        }

        hash = Hashtable.getHash(key, this._options).toString();
        if (!this._buckets.hasOwnProperty(hash)) {
            return null;
        }

        bucket = this._buckets[hash];
        itemIndex = Hashtable.getKeyIndex(bucket, key, this._options);
        if (itemIndex < 0) {
            return null;
        }

        return bucket._items[itemIndex]._value;
    }

    /// Removes the key-value pair with the given key. Returns false if the key wasn't found in the hash table
    Hashtable.prototype.remove = function (key) {
        var hash, bucket, keyRemoved;

        if (!Hashtable.verifyKey) {
            return false;
        }

        hash = Hashtable.getHash(key, this._options).toString();
        if (!this._buckets.hasOwnProperty(hash)) {
            return false;
        }

        bucket = this._buckets[hash];
        keyRemoved = Hashtable.removeKey(bucket, key, this._options);
        if (keyRemoved) {
            this._count--;
        }
        return keyRemoved;

    };

    /// Returns true if the hash table contains the key and false otherwise
    Hashtable.prototype.contains = function (key) {
        var hash, addedItem, bucket, itemIndex;

        if (!Hashtable.verifyKey) {
            return false;
        }

        hash = Hashtable.getHash(key, this._options).toString();
        if (!this._buckets.hasOwnProperty(hash)) {
            return false;
        }

        bucket = this._buckets[hash];
        itemIndex = Hashtable.getKeyIndex(bucket, key, this._options);
        if (itemIndex < 0) {
            return false;
        }
        return true;
    };

    ///Returns the total number of items in the hashtable
    Hashtable.prototype.count = function () {
        return this._count;
    };

    ///Returns the total number of items in the hashtable
    Hashtable.prototype.clear = function () {
        this._count = 0;
        this._buckets = {};
    };

    ///Prints the content of the hashtable to the console. This is used for debugging
    Hashtable.prototype.print = function () {
        var hash, bucket, i, length;
        console.log("Count: ", this._count);
        for (hash in this._buckets) {
            console.log("*");
            console.log("Bucket:", hash);
            bucket = this._buckets[hash];
            console.log("Free Slots:", bucket._freeSlots);
            length = bucket._items.length
            console.log("There are", length, "item slots");
            for (i = 0; i < length; i++) {
                if (bucket._items[i] === undefined) {
                    console.log("  ",i, ":", undefined);
                } else {
                    console.log("  ", i, ":", "Key:", bucket._items[i]._key, "Value:", bucket._items[i]._value);
                }
            }
        }
    }

    return Hashtable;
})();

exports.Hashtable = Hashtable;

