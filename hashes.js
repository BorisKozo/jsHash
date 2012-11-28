
var KeyValuePair = function (key, value) {
    this._key = key;
    this._value = value;
};

///Various static methods. Override these methods to change the behavior of all hashes objects
var statics = (function () {
    return {
        //Makes sure that the key is valid for the HashTable
        verifyKey: function (key) {
            if (key === undefined || key === null) {
                throw new Error("Key cannot be undefined or null");
            }

            return true;
        },
        ///Converts a string to a numeric hash
        stringToHash: function stringToHash(s) {
            var i, stringData = s, result = 0;

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
                i -= 1;
            }
            return result & result;
        },

        /// Compares the first item to the second items and returns true if the two items are equal and false otherwise
        defaultEqual: function (first, second) {
            return first === second;
        },

        /// Returns the hash of a given key based on the provided options
        getHash: function (key, options) {
            if (options && options.hasOwnProperty("getHashCode")) {
                return options.getHashCode(key);
            }

            if (key.getHashCode !== undefined && typeof (key.getHashCode) === "function") {
                return key.getHashCode();
            }

            return key.toString();
        },

        /// Returns the most appropriate equal function based on the options and the key
        getEqual: function (key, options) {
            if (options && options.equal) {
                return options.equal;
            } else {
                if (key.equal !== undefined && typeof (key.equal) === "function") {
                    return key.equal;
                } else {
                    return statics.defaultEqual;
                }
            }
        },

        /// Shallow copies only the relevant properties and functions from the options object
        copyOptions: function (options) {
            if (options === undefined || options === null) {
                return undefined;
            }

            return {
                getHashCode: options.getHashCode,
                equal: options.equal
            };
        }
    };

})();

var HashTable = (function () {

    function HashTable(options) {
        this._buckets = {
        };
        this._count = 0;
        this._options = statics.copyOptions(options);
    }

    //Static functions

    //Searches the given key within the given bucket. If the key is found then returns the index in the bucket,
    //otherwise returns -1
    HashTable.getKeyIndex = function (bucket, key, options) {
        var i, bucketLength = bucket.length, equality, currentItem;
        equality = statics.getEqual(key, options);
        for (i = 0; i < bucketLength; i += 1) {
            currentItem = bucket[i];
            if (currentItem !== undefined && equality(currentItem._key, key)) {
                return i;
            }
        }

        return -1;
    };

    ///A static function that adds the given key value pair to the given bucket
    HashTable.addToBucket = function (bucket, key, value, options) {
        bucket.push(new KeyValuePair(key, value));
    };


    //Removes the key from the given bucket. Returns false if the key was not found in the bucket
    HashTable.removeKey = function (bucket, key, options) {
        var index = HashTable.getKeyIndex(bucket, key, options), bucketLength = bucket.length;
        if (index < 0) {
            return false;
        }

        if (bucketLength > 1 && index !== (bucketLength - 1)) {
            bucket[index] = bucket[bucketLength - 1];
        }

        bucket.length = bucketLength - 1;
        return true;
    };


    //Prototype functions

    ///Adds a key value pair to the HashTable, returns true if any item was added and false otherwise.
    ///you may specify the overwriteIfExists flag. When overwriteIfExists is true the value of the given key will be replaced (the key will also be replaced) 
    ///if this key already exists in the HashTable. When overwriteIfExists is false and the key already exists then nothing will happen but the 
    ///function will return false (since nothing was added)

    HashTable.prototype.add = function (key, value, overwriteIfExists) {
        var hash, addedItem, bucket, itemIndex;

        if (!statics.verifyKey) {
            return false;
        }

        hash = statics.getHash(key, this._options).toString();
        if (!this._buckets.hasOwnProperty(hash)) {
            this._buckets[hash] = [];
        }
        bucket = this._buckets[hash];
        itemIndex = HashTable.getKeyIndex(bucket, key, this._options);
        if (itemIndex >= 0) {
            if (overwriteIfExists) {
                bucket[itemIndex] = new KeyValuePair(key, value);
                return true;
            }

            return false;
        } else {
            addedItem = HashTable.addToBucket(this._buckets[hash], key, value, this._options);
            this._count += 1;
            return true;
        }
    };

    ///Retrieves the value associated with the given key. If the key doesn't exist null is returned.
    HashTable.prototype.get = function (key) {
        var hash, bucket, itemIndex;

        if (!statics.verifyKey) {
            return false;
        }

        hash = statics.getHash(key, this._options).toString();
        if (!this._buckets.hasOwnProperty(hash)) {
            return null;
        }

        bucket = this._buckets[hash];
        itemIndex = HashTable.getKeyIndex(bucket, key, this._options);
        if (itemIndex < 0) {
            return null;
        }

        return {
            value: bucket[itemIndex]._value,
            key: bucket[itemIndex]._key
        };
    };

    /// Removes the key-value pair with the given key. Returns false if the key wasn't found in the HashTable
    HashTable.prototype.remove = function (key) {
        var hash, bucket, keyRemoved;

        if (!statics.verifyKey) {
            return false;
        }

        hash = statics.getHash(key, this._options).toString();
        if (!this._buckets.hasOwnProperty(hash)) {
            return false;
        }

        bucket = this._buckets[hash];
        keyRemoved = HashTable.removeKey(bucket, key, this._options);
        if (keyRemoved) {
            this._count -= 1;
            if (bucket.length === 0) {
                delete (this._buckets[hash]);
            }
        }
        return keyRemoved;

    };

    /// Returns true if the HashTable contains the key and false otherwise
    HashTable.prototype.contains = function (key) {
        var hash, bucket, itemIndex;

        if (!statics.verifyKey) {
            return false;
        }

        hash = statics.getHash(key, this._options).toString();
        if (!this._buckets.hasOwnProperty(hash)) {
            return false;
        }

        bucket = this._buckets[hash];
        itemIndex = HashTable.getKeyIndex(bucket, key, this._options);
        if (itemIndex < 0) {
            return false;
        }
        return true;
    };

    ///Returns all the hashes that are currently in the HashTable
    HashTable.prototype.getHashes = function () {
        var result = [], hash;
        for (hash in this._buckets) {
            if (this._buckets.hasOwnProperty(hash)) {
                result.push(hash);
            }
        }

        return result;
    };

    ///Returns an array of all the key-value pairs in the HashTable
    HashTable.prototype.getKeyValuePairs = function () {
        var result = [], hash, bucket, i, bucketLength;
        for (hash in this._buckets) {
            if (this._buckets.hasOwnProperty(hash)) {
                bucket = this._buckets[hash];
                for (i = 0, bucketLength = bucket.length; i < bucketLength; i += 1) {
                    result.push({
                        key: bucket[i]._key,
                        value: bucket[i]._value
                    });
                }
            }
        }

        return result;
    };

    ///Returns the total number of items in the HashTable
    HashTable.prototype.count = function () {
        return this._count;
    };

    ///Removes all the items from the HashTable
    HashTable.prototype.clear = function () {
        this._count = 0;
        this._buckets = {};
    };

    ///Returns a new HashTable which is a shallow copy of this HashTable
    HashTable.prototype.clone = function () {
        var result = new HashTable(statics.copyOptions(this._options)),
        hash, bucket, newBucket, i, bucketLength;
        for (hash in this._buckets) {
            if (this._buckets.hasOwnProperty(hash)) {
                bucket = this._buckets[hash];
                bucketLength = bucket.length;
                newBucket = [];
                newBucket.length = bucketLength;
                result._buckets[hash] = newBucket;
                for (i = 0; i < bucketLength; i += 1) {
                    newBucket[i] = new KeyValuePair(bucket[i]._key, bucket[i]._value);
                }
            }
        }
        return result;
    };

    ///Returns a new HashTable where all the key value pairs are rehashed according to the new options
    HashTable.prototype.rehash = function (options, overwriteIfExists) {
        var result = new HashTable(options),
         pairs = this.getKeyValuePairs(),
         i, length = pairs.length, pair;
        for (i = 0; i < length; i += 1) {
            pair = pairs[i];
            result.add(pair.key, pair.value, overwriteIfExists);
        }

        return result;
    };

    ///Prints the content of the HashTable to the console. This is used for debugging
    HashTable.prototype.print = function () {
        var hash, bucket, i, length;
        console.log("Count: ", this._count);
        for (hash in this._buckets) {
            if (this._buckets.hasOwnProperty(hash)) {
                console.log("*");
                console.log("Bucket:", hash);
                bucket = this._buckets[hash];
                length = bucket.length;
                console.log("There are", length, "item slots");
                for (i = 0; i < length; i += 1) {
                    if (bucket[i] === undefined) {
                        console.log("  ", i, ":", undefined);
                    } else {
                        console.log("  ", i, ":", "Key:", bucket[i]._key, "Value:", bucket[i]._value);
                    }
                }
            }
        }
    };

    return HashTable;
})();

var HashSet = (function () {

    function HashSet(options) {
        this._buckets = {
        };
        this._count = 0;
        this._options = statics.copyOptions(options);
    }

    //Static functions

    //Searches the given key within the given bucket. If the key is found then returns the index in the bucket,
    //otherwise returns -1
    HashSet.getKeyIndex = function (bucket, key, options) {
        var i, bucketLength = bucket.length, equality, currentItem;
        equality = statics.getEqual(key, options);
        for (i = 0; i < bucketLength; i += 1) {
            currentItem = bucket[i];
            if (currentItem !== undefined && equality(currentItem._key, key)) {
                return i;
            }
        }

        return -1;
    };

    ///A static function that adds the given key to the given bucket
    HashSet.addToBucket = function (bucket, key, options) {
        bucket.push(key);
    };


    //Removes the key from the given bucket. Returns false if the key was not found in the bucket
    HashSet.removeKey = function (bucket, key, options) {
        var index = HashTable.getKeyIndex(bucket, key, options), bucketLength = bucket.length;
        if (index < 0) {
            return false;
        }

        if (bucketLength > 1 && index !== (bucketLength - 1)) {
            bucket[index] = bucket[bucketLength - 1];
        }

        bucket.length = bucketLength - 1;
        return true;
    };


    //Prototype functions

    ///Adds a key the HashSet, returns true if any item was added and false otherwise.
    ///you may specify the overwriteIfExists flag. When overwriteIfExists is true the key will be replaced
    ///if this key already exists in the HashSet. When overwriteIfExists is false and the key already exists then nothing 
    ///will happen but the function will return false (since nothing was added)

    HashSet.prototype.add = function (key, overwriteIfExists) {
        var hash, addedItem, bucket, itemIndex;

        if (!statics.verifyKey) {
            return false;
        }

        hash = statics.getHash(key, this._options).toString();
        if (!this._buckets.hasOwnProperty(hash)) {
            this._buckets[hash] = [];
        }
        bucket = this._buckets[hash];
        itemIndex = HashTable.getKeyIndex(bucket, key, this._options);
        if (itemIndex >= 0) {
            if (overwriteIfExists) {
                bucket[itemIndex] = key;
                return true;
            }

            return false;
        } else {
            addedItem = HashTable.addToBucket(this._buckets[hash], key, this._options);
            this._count += 1;
            return true;
        }
    };

    ///Retrieves the key which is equal to the given key. If the key doesn't exist null is returned.
    HashTable.prototype.get = function (key) {
        var hash, bucket, itemIndex;

        if (!statics.verifyKey) {
            return false;
        }

        hash = statics.getHash(key, this._options).toString();
        if (!this._buckets.hasOwnProperty(hash)) {
            return null;
        }

        bucket = this._buckets[hash];
        itemIndex = HashTable.getKeyIndex(bucket, key, this._options);
        if (itemIndex < 0) {
            return null;
        }

        return bucket[itemIndex];
    };

    /// Removes the key. Returns false if the key wasn't found in the HashSet
    HashSet.prototype.remove = function (key) {
        var hash, bucket, keyRemoved;

        if (!statics.verifyKey) {
            return false;
        }

        hash = statics.getHash(key, this._options).toString();
        if (!this._buckets.hasOwnProperty(hash)) {
            return false;
        }

        bucket = this._buckets[hash];
        keyRemoved = HashTable.removeKey(bucket, key, this._options);
        if (keyRemoved) {
            this._count -= 1;
            if (bucket.length === 0) {
                delete (this._buckets[hash]);
            }
        }
        return keyRemoved;

    };

    /// Returns true if the HashSet contains the key and false otherwise
    HashSet.prototype.contains = function (key) {
        var hash, bucket, itemIndex;

        if (!statics.verifyKey) {
            return false;
        }

        hash = statics.getHash(key, this._options).toString();
        if (!this._buckets.hasOwnProperty(hash)) {
            return false;
        }

        bucket = this._buckets[hash];
        itemIndex = HashTable.getKeyIndex(bucket, key, this._options);
        if (itemIndex < 0) {
            return false;
        }
        return true;
    };

    ///Returns all the hashes that are currently in the HashSet
    HashSet.prototype.getHashes = function () {
        var result = [], hash;
        for (hash in this._buckets) {
            if (this._buckets.hasOwnProperty(hash)) {
                result.push(hash);
            }
        }

        return result;
    };

    ///Returns an array of all the keys in the HashSet
    HashSet.prototype.getKeys = function () {
        var result = [], hash, bucket, i, bucketLength;
        for (hash in this._buckets) {
            if (this._buckets.hasOwnProperty(hash)) {
                bucket = this._buckets[hash];
                for (i = 0, bucketLength = bucket.length; i < bucketLength; i += 1) {
                    result.push(bucket[i]);
                }
            }
        }

        return result;
    };

    ///Returns the total number of items in the HashSet
    HashSet.prototype.count = function () {
        return this._count;
    };

    ///Removes all the items from the HashSet
    HashSet.prototype.clear = function () {
        this._count = 0;
        this._buckets = {};
    };

    ///Returns a new HashSet which is a shallow copy of this HashSet
    HashSet.prototype.clone = function () {
        var result = new HashSet(statics.copyOptions(this._options)),
        hash, bucket, newBucket, i, bucketLength;
        for (hash in this._buckets) {
            if (this._buckets.hasOwnProperty(hash)) {
                bucket = this._buckets[hash];
                bucketLength = bucket.length;
                newBucket = [];
                newBucket.length = bucketLength;
                result._buckets[hash] = newBucket;
                for (i = 0; i < bucketLength; i += 1) {
                    newBucket[i] = bucket[i]._key;
                }
            }
        }
        return result;
    };

    ///Returns a new HashSet where all the key value pairs are rehashed according to the new options
    HashSet.prototype.rehash = function (options, overwriteIfExists) {
        var result = new HashSet(options),
         keys = this.getKeys(),
         i, length = keys.length;
        for (i = 0; i < length; i += 1) {
            result.add(keys[i], overwriteIfExists);
        }

        return result;
    };

    ///Prints the content of the HashSet to the console. This is used for debugging
    HashSet.prototype.print = function () {
        var hash, bucket, i, length;
        console.log("Count: ", this._count);
        for (hash in this._buckets) {
            if (this._buckets.hasOwnProperty(hash)) {
                console.log("*");
                console.log("Bucket:", hash);
                bucket = this._buckets[hash];
                length = bucket.length;
                console.log("There are", length, "item slots");
                for (i = 0; i < length; i += 1) {
                    if (bucket[i] === undefined) {
                        console.log("  ", i, ":", undefined);
                    } else {
                        console.log("  ", i, ":", "Key:", bucket[i]);
                    }
                }
            }
        }
    };

    return HashSet;
})();

exports.statics = statics;

exports.HashTable = HashTable;

exports.HashSet = HashSet;
