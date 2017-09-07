# ewd-document-store-examples

Rob Tweed <rtweed@mgateway.com>  
7 September 2017, M/Gateway Developments Ltd [http://www.mgateway.com](http://www.mgateway.com)  

Twitter: [@rtweed](https://twitter.com/rtweed)

Google Group for discussions, support, advice etc: [http://groups.google.co.uk/group/enterprise-web-developer-community](http://groups.google.co.uk/group/enterprise-web-developer-community)

© 2017 M/Gateway Developments Ltd


# Table of Contents
  
  * [InterSystem Caché](#toe-intersystem-cache)
  * [Caché Standalone Examples](#toe-cache-standalone-examples)
  * [Caché Worker Module Example and Express Integration using ewd-qoper8-express](#toe-worker-module-example-and-express-integration-using-ewd-qoper-express)


## <a id="toe-cache"></a>InterSystem Caché

  - [Documentation Home Page](http://docs.intersystems.com/latest/csp/docbook/DocBook.UI.HomePageZen.cls)
  - [Caché Installation Guide](http://docs.intersystems.com/latest/csp/docbook/DocBook.UI.Page.cls?KEY=GCI)
  - [Using Node.js with Caché](http://docs.intersystems.com/latest/csp/docbook/DocBook.UI.Page.cls?KEY=BXJS)


## <a id="toe-cache-standalone-examples"></a>Caché Standalone Examples

Here's standalone example of ewd-document-store working with [InterSystem Caché](http://www.intersystems.com/our-products/cache/cache-overview/). You'll find this in the /examples directory - look for CacheStandalone.js:

```js
'use strict';

// Standalone example demonstrating use of ewd-document-store with Cache database
// You may need to run this as sudo because of permissions
var DocumentStore = require('ewd-document-store');
var Cache = require('cache').Cache;
var db = new Cache();

// Change these parameters to match your GlobalsDB or Cache system:
var ok = db.open({
  path: '/opt/cache/mgr',
  username: '_SYSTEM',
  password: 'SYS',
  namespace: 'USER'
});

console.log('ok: ' + JSON.stringify(ok));
console.log('version: ' + db.version());
```

If things are correct, you should get a response back such as this:
```
ok: {"ok":1,"result":1,"cache_pid":"86289"}
version: Node.js Adaptor for Cache: Version: 1.1.140 (CM); Cache Version: 2017.1 build 111
```

Next, initializing document store and creating a couple document nodes:
```js
var documentStore = new DocumentStore(db);
var rob = new documentStore.DocumentNode('rob');

var temp = new documentStore.DocumentNode('temp', [1]);
console.log('exists: ' + temp.exists);
console.log('hasValue: ' + temp.hasValue);
console.log('hasChildren: ' + temp.hasChildren);
console.log('value: ' + temp.value);

console.log(JSON.stringify(temp.getDocument(), null, 2));
```
Response:
```
exists: false
hasValue: false
hasChildren: false
value:
{}
```

Let's add event listener on `afterSet` event and set some values using `$` and `increment` methods:
```js
documentStore.on('afterSet', function (node) {
  console.log('afterSet: ' + JSON.stringify(node));
});
rob.$('x').value = 'hello';
rob.$('y').value = 'world';
rob.$('a').increment();
```
Response:
```
afterSet: {"documentName":"rob","path":["x"],"before":{"value":"hello","exists":true},"value":"hello"}
afterSet: {"documentName":"rob","path":["y"],"before":{"value":"world","exists":true},"value":"world"}
afterSet: {"documentName":"rob","path":["a"],"before":{"value":"1","exists":true},"value":"3"}
```

Let's declare a variable and use `setDocument` method to replace the whole document:
```js
var z = {
  a: 'this is a',
  b: 'this is b',
  Barton: 'J',
  Briggs: 'A',
  Davies: 'D',
  Davis: 'T',
  Douglas: 'N',
  c: ['a', 's', 'd'],
  d: {
    a: 'a',
    b: 'b'
  }
};

rob.$('z').setDocument(z);

console.log(JSON.stringify(rob.getDocument(), null, 2));
```
Response:
```
afterSet: {"documentName":"rob","path":["x"],"before":{"value":"hello","exists":true},"value":"hello"}
afterSet: {"documentName":"rob","path":["y"],"before":{"value":"world","exists":true},"value":"world"}
afterSet: {"documentName":"rob","path":["a"],"before":{"value":"1","exists":true},"value":"5"}
afterSet: {"documentName":"rob","path":["z","a"],"before":{"value":"this is a","exists":true},"value":"this is a"}
afterSet: {"documentName":"rob","path":["z","b"],"before":{"value":"this is b","exists":true},"value":"this is b"}
afterSet: {"documentName":"rob","path":["z","Barton"],"before":{"value":"J","exists":true},"value":"J"}
afterSet: {"documentName":"rob","path":["z","Briggs"],"before":{"value":"A","exists":true},"value":"A"}
afterSet: {"documentName":"rob","path":["z","Davies"],"before":{"value":"D","exists":true},"value":"D"}
afterSet: {"documentName":"rob","path":["z","Davis"],"before":{"value":"T","exists":true},"value":"T"}
afterSet: {"documentName":"rob","path":["z","Douglas"],"before":{"value":"N","exists":true},"value":"N"}
afterSet: {"documentName":"rob","path":["z","c",0],"before":{"value":"a","exists":true},"value":"a"}
afterSet: {"documentName":"rob","path":["z","c",1],"before":{"value":"s","exists":true},"value":"s"}
afterSet: {"documentName":"rob","path":["z","c",2],"before":{"value":"d","exists":true},"value":"d"}
afterSet: {"documentName":"rob","path":["z","d","a"],"before":{"value":"a","exists":true},"value":"a"}
afterSet: {"documentName":"rob","path":["z","d","b"],"before":{"value":"b","exists":true},"value":"b"}
{
  "a": "1",
  "x": "hello",
  "y": "world",
  "z": {
    "Barton": "J",
    "Briggs": "A",
    "Davies": "D",
    "Davis": "T",
    "Douglas": "N",
    "a": "this is a",
    "b": "this is b",
    "c": {
      "0": "a",
      "1": "s",
      "2": "d"
    },
    "d": {
      "a": "a",
      "b": "b"
    }
  }
}
```

Let's go through each child in rob document:
```js
console.log('forEachChild through rob document:');
rob.forEachChild(function (nodeName) {
  console.log(nodeName);
});
```
Response:
```
forEachChild through rob document:
a
x
y
z
```

Let's go through each child in rob document but stopping early:
```js
console.log('forEachChild through rob document, stopping early:');
rob.forEachChild(function (nodeName) {
  console.log(nodeName);
  if (nodeName === 'x') {
    return true;
  }
});
```
Response:
```
forEachChild through rob document, stopping early:
a
x
```

Let's go through each child in rob document in reverse:
```js
console.log('forEachChild through rob document, in reverse:');
rob.forEachChild({
  direction: 'reverse'
}, function (nodeName) {
  console.log(nodeName);
});
```
Response:
```
forEachChild through rob document, in reverse:
z
y
x
a
```

Let's go through each child in rob document starting with:
```js
console.log('forPrefix through rob global starting x:');
rob.forEachChild({
  prefix: 'x'
}, function (subscript) {
  console.log(subscript);
});
```
Response:
```
forPrefix through rob global starting x:
x
```

There is another forEach method loop through each leaf node - `forEachLeafNode`
```js
console.log('forEachLeafNode through rob global:');
rob.forEachLeafNode(function (value) {
  console.log(value);
});
```
Response:
```
forEachLeafNode through rob global:
1
hello
world
J
A
D
T
N
this is a
this is b
a
s
d
a
b
```

Wants to know children count? Let's use `countChildren`;
```js
console.log('forEachLeafNode through rob global:');
rob.forEachLeafNode(function (value) {
  console.log(value);
});
```
Response:
```
Number of children: 5
```
