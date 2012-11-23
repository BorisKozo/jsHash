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
    key1 = {}, key2 = { someKey: "someKey" }, value1 = "Some string", value2 = "Another string";

    var hashtable = new jsHash.Hashtable();

    it('should convert string to hash correctly', function () {
        jsHash.Hashtable.stringToHash("AAA").should.equal(4030);
        jsHash.Hashtable.stringToHash("This is a long string").should.equal(57784);
    });

    it('should add a key, value pair to the hashtable', function () {
        hashtable.add(key1, value1);
        hashtable.count().should.equal(1);
    });

    it('should get a value of key1 from the hash table', function () {
        hashtable.add(key1, value1);
        hashtable.count().should.equal(1);
    });


});