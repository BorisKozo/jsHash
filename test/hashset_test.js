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
        hashset.add(key1, value1);
        hashset.count().should.equal(1);
    });

    it('should get the value of key1 from the HashSet', function () {
        var data = hashset.get(key1);
        should.exist(data.value);
        data.value.should.equal(value1);
        should.exist(data.key);
        data.key.should.equal(key1);
    });

    it('should not add a key, value pair to the HashSet', function () {
        hashset.add(key1, value1, false);
        hashset.count().should.equal(1);
    });

    it('should overwrite a give key', function () {
        hashset.add(key1, value2, true);
        hashset.count().should.equal(1);
        var value = hashset.get(key1).value;
        should.exist(value);
        value.should.equal(value2);
    });

    it('should clear the HashSet', function () {
        var value;
        hashset.clear();
        hashset.count().should.equal(0);
        value = hashset.get(key1);
        should.not.exist(value);
    });

    it('should add keys with different hashes', function () {
        hashset.add(key1, "1");
        hashset.count().should.equal(1);
        hashset.add(key2, "2");
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
        hashset.add(key1, "1");
        hashes = hashset.getHashes();
        should.exist(hashes);
        hashes.length.should.equal(2);
    });

    it('should get all the key-value pairs in the HashSet', function () {
        var keyValuePairs = hashset.getKeyValuePairs();
        should.exist(keyValuePairs);
        keyValuePairs.length.should.equal(2);
        keyValuePairs[1].key.should.equal(key1); //Not so robust :(
        keyValuePairs[1].value.should.equal("1");
    });

    it('should clone a HashSet', function () {
        var otherSet = hashset.clone(), value;
        hashset.print();
        otherSet.print();
        value = otherSet.contains(key3);
        value.should.equal(false);
        value = otherSet.contains(key2);
        value.should.equal(true);
        value = otherSet.get(key2).value;
        should.exist(value);
        value.should.equal("2");
    });




});