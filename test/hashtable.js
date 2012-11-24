describe('Hashtable tests', function () {

    var jsHash = require("./../hashtable.js"),
        should = require("should");
    var options = {
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
    key1 = {}, key2 = { someKey: "someKey", getHashCode: function () { return "key"; }}, key3 = {}, key4 = {}, value1 = "Some string", value2 = "Another string";

    var hashtable = new jsHash.Hashtable();

    it('should convert string to hash correctly', function () {
        jsHash.Hashtable.stringToHash("AAA").should.equal(4030);
        jsHash.Hashtable.stringToHash("This is a long string").should.equal(57784);
    });

    //Prototype functions tests

    it('Initial hashtable should be empty', function () {
        hashtable.count().should.equal(0);
    });

    it('should add a key, value pair to the hashtable', function () {
        hashtable.add(key1, value1);
        hashtable.count().should.equal(1);
    });

    it('should get the value of key1 from the hashtable', function () {
        var value = hashtable.get(key1).value;
        should.exist(value);
        value.should.equal(value1);
    });

    it('should not add a key, value pair to the hashtable', function () {
        hashtable.add(key1, value1, false);
        hashtable.count().should.equal(1);
    });

    it('should overwrite a give key', function () {
        hashtable.add(key1, value2, true);
        hashtable.count().should.equal(1);
        var value = hashtable.get(key1).value;
        should.exist(value);
        value.should.equal(value2);
    });

    it('should clear the hashtable', function () {
        var value;
        hashtable.clear();
        hashtable.count().should.equal(0);
        value = hashtable.get(key1);
        should.not.exist(value);
    });

    it('should add multiple keys with the same hash', function () {
        hashtable.add(key1, "1", false);
        hashtable.add(key3, "3", false);
        hashtable.add(key4, "4", false);
        hashtable.count().should.equal(3);
        var value = hashtable.get(key3).value;
        should.exist(value);
        value.should.equal("3");
    });

    it('should remove a value from the hashtable', function () {
        var value;
        value = hashtable.remove(key4);
        value.should.equal(true);
        value = hashtable.remove(key1);
        value.should.equal(true);
        hashtable.count().should.equal(1);
    });

    it('should check if a hashtable contains a key', function () {
        var value;
        value = hashtable.contains(key1);
        value.should.equal(false);
        value = hashtable.contains(key3);
        value.should.equal(true);
    });

    it('should add multiple hash codes', function () {
        hashtable.add(key2, "2", false);
        hashtable.count().should.equal(2);
        var value = hashtable.get(key2).value;
        should.exist(value);
        value.should.equal("2");
    });

    it('should get all the hashes in the hashtable', function () {
        var hashes = hashtable.getHashes();
        should.exist(hashes);
        hashes.length.should.equal(2);
    });

    it('should get all the key-value pairs in the hashtable', function () {
        var keyValuePairs = hashtable.getKeyValuePairs();
        should.exist(keyValuePairs);
        keyValuePairs.length.should.equal(2);
        keyValuePairs[0].key.should.equal(key3); //Not so robust :(
        keyValuePairs[0].value.should.equal("3");
    });


});