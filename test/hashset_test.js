/*global describe:true, it:true*/
describe('HashSet', function () {

    var jsHash = require("./../hashes.js"),
        should = require("should"),
        options = {
            "getHashCode": function (key) {
                if (key === undefined) {
                    return "undefined";
                }

                if (key === null) {
                    return "null";
                }

                return key.toString();
            },

            "equal": function (first, second) {
                return first === second;
            }

        },
    key1 = {}, key2 = { someKey: "someKey", getHashCode: function () { return "key"; } }, key3 = {},
    value1 = "Some string", value2 = "Another string",

    hashset = new jsHash.HashSet();

    //Prototype functions tests

    it('Initial HashSet should be empty', function () {
        hashset.count().should.equal(0);
    });

    it('should add a key, value pair to the HashSet', function () {
        hashset.add(key1);
        hashset.count().should.equal(1);
    });

    it('should get key1 from the HashSet', function () {
        var data = hashset.get(key1);
        should.exist(data);
        data.should.equal(key1);
    });

    it('should not add a key, value pair to the HashSet', function () {
        hashset.add(key1, false);
        hashset.count().should.equal(1);
    });

    it('should overwrite a given key', function () {
        hashset.add(key1, true);
        hashset.count().should.equal(1);
        var data = hashset.get(key1);
        should.exist(data);
        data.should.equal(key1);
    });

    it('should clear the HashSet', function () {
        var value;
        hashset.clear();
        hashset.count().should.equal(0);
        value = hashset.get(key1);
        should.not.exist(value);
    });

    it('should add keys with different hashes', function () {
        hashset.add(key1);
        hashset.count().should.equal(1);
        hashset.add(key2);
        hashset.count().should.equal(2);
    });

    it('should remove a value from the HashSet', function () {
        var value;
        value = hashset.remove(key1);
        value.should.equal(true);
        hashset.count().should.equal(1);
    });

    it('should check if a HashSet contains a key', function () {
        var value;
        value = hashset.contains(key1);
        value.should.equal(false);
        value = hashset.contains(key2);
        value.should.equal(true);
    });

    it('should get all the hashes in the HashSet', function () {
        var hashes;
        hashset.add(key1);
        hashes = hashset.getHashes();
        should.exist(hashes);
        hashes.length.should.equal(2);
    });

    it('should get all the keys in the HashSet', function () {
        var keys = hashset.getKeys();
        should.exist(keys);
        keys.length.should.equal(2);
        keys[1].should.equal(key1); //Not so robust :(
    });

    it('should clone a HashSet', function () {
        var otherSet = hashset.clone(), value;
        value = otherSet.contains(key3);
        value.should.equal(false);
        value = otherSet.contains(key2);
        value.should.equal(true);
        value = otherSet.get(key2);
        should.exist(value);
        value.should.equal(key2);
        otherSet.count().should.equal(hashset.count());
    });




});