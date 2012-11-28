jsHash
======

A node package that implements the Hashtable and HashSet (in the near future) datastructures.

Install:

```
$ npm install hashes
```

##API

To use the module in your code simply type

```javascript
var hashes = require('hashes');
```

###Hashtable
To create a new hash table use the _new_ keyword:

```
var myHashTable = new hashes.HashTable();
``` 

You may provide an optional argument to the constructor called _options_. The options object can have any of the following methods and properties:

* **getHashCode(key)** - Returns the hash code of the given _key_ object.

* **equal(first, second)** - Returns true if the given arguments are equal, and false otherwise.

The options object is used throughout the different API calls. The API of the HashTable is therefore:

* **add(key, value, [overwriteIfExists])** - Adds the given key-value pair to the HashTable. _overwriteIfExists_ is an optional argument that is used when the given key already exists in the HashTable.
If _overwriteIfExists_ is truthy then the given key-value pair will overwrite the existing key-value pair, otherwise the given key-value pair will not be added to the HashTable.

* **get(key)** - Returns the key-value pair associated with the given key. If there is no key-value pair associated with the given key, null is returned. The returned object is ```{key:key, value:value}```.
(Note that a pair is returned because the key in the HashTable may differ from the provided key.)

* **remove(key)** - Removes the key-value pair associated with the given key from the HashTable. Returns true if a key-value pair was removed and false otherwise (e.g. when there is no value associated with the given key).

* **contains(key)** - Returns true if there is a value associated with the given key and false otherwise.

* **getHashes()** - Returns a string array of all the hashes that are currently in the HashTable.

* **getKeyValuePairs()** - Returns an array of all the key-value pairs in the HashTable **in no particular order**. Each object in the returned array is ```{key:key, value:value}```.

* **count()** - Returns the number of key-value pairs in the HashTable.

* **clear()** - Removes all the key-value pairs from the HashTable.

* **clone()** - Returns a copy of the HashTable. All user elements are copied by reference.

* **rehash(options, overwriteIfExists)** - Returns a copy of the HashTable but all the key-value pairs are re-insrted using the new options. _overwriteIfExists_ is handled the same way as in the _add_ function.

## Contributions
Please feel free to contribute code to this module. Make sure that the contributed code is in the spirit of the existing code.
Thanks!


## Test
The module uses [Mocha](http://visionmedia.github.com/mocha/) testing framework for all the tests. To run the tests simply type
```mocha``` in a command line while in the module main directory.

## Change Log
0.0.2 -> 0.1.0
* **Breaking** - Renamed the class from Hashtable to HashTable (note the capital 'T')
* **Breaking** - Moved some static functions of HashTable class to the statics object to accommodate the new HashSet class
* Added the HashSet class
* Added the _clone_ and _rehash_ functions to the HashTable class
* Fixed a bug in the get method where the key was not returned
* Fixed some global leaks
* Fixed some other code issues that jsHint didn't like

## License

(The MIT License)

Copyright (c) 2012 Boris Kozorovitzky

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.