# ewd-document-store-examples

Rob Tweed <rtweed@mgateway.com>  
7 September 2017, M/Gateway Developments Ltd [http://www.mgateway.com](http://www.mgateway.com)  

Twitter: [@rtweed](https://twitter.com/rtweed)

Google Group for discussions, support, advice etc: [http://groups.google.co.uk/group/enterprise-web-developer-community](http://groups.google.co.uk/group/enterprise-web-developer-community)

© 2017 M/Gateway Developments Ltd


# Table of Contents
  
  - [InterSystem Caché](#toe-intersystem-cache)
  - [Caché Standalone Examples](#toe-cache-standalone-examples)
    * [Creating Document Nodes](#toe-creating-document-nodes)
    * [Updating Document Nodes](#toe-updating-document-nodes)
    * [For Each Methods](#toe-foreach-methods)
      * [forEachChild](#toe-foreachchild)
      * [forEachLeafNode](#toe-foreachleafnode)
    * [Traversing Document Nodes](#toe-traversing-document-nodes)
      * [countChildren()](#toe-traversing-countChildren)
      * [$()](#toe-traversing-$)
      * [parent](#toe-traversing-parent)
      * [firstChild / nextSibling](#toe-traversing-firstChild-nextSibling)
      * [value](#toe-traversing-value)
      * [delete()](#toe-traversing-delete)
    * [Gets a List of Globals](#toe-gets-list-of-globals)
    
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

### <a id="toe-creating-document-nodes"></a>Creating Document Nodes

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

### <a id="toe-updating-document-nodes"></a>Updating Document Nodes

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

### <a id="toe-foreach-methods"></a> For Each Methods

#### <a id="toe-foreachchild"></a> forEachChild

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

Let's use range option property to filter child nodes:
```js
var z = rob.$z;
console.log('Names from Br to Da');
z.forEachChild({
  range: {
    from: 'Br',
    to: 'Da'
  }
}, function (lastName, node) {
  console.log('LastName: ' + lastName + '; firstName: ' + node.value);
});
console.log('------------');
console.log('Names from Br to Db');
z.forEachChild({
  range: {
    from: 'Br',
    to: 'Db'
  }
}, function (lastName, node) {
  console.log('LastName: ' + lastName + '; firstName: ' + node.value);
});
console.log('------------');
console.log('Names from Briggs to Davis');
z.forEachChild({
  range: {
    from: 'Briggs',
    to: 'Davis'
  }
}, function (lastName, node) {
  console.log('LastName: ' + lastName + '; firstName: ' + node.value);
});
console.log('------------');
console.log('Names from B to D');
z.forEachChild({
  range: {
    from: 'B',
    to: 'D'
  }
}, function (lastName, node) {
  console.log('LastName: ' + lastName + '; firstName: ' + node.value);
});
console.log('------------');
```
Response:
```
Names from Br to Da
LastName: Briggs; firstName: A
LastName: Davies; firstName: D
LastName: Davis; firstName: T
------------
Names from Br to Db
LastName: Briggs; firstName: A
LastName: Davies; firstName: D
LastName: Davis; firstName: T
------------
Names from Briggs to Davis
LastName: Briggs; firstName: A
LastName: Davies; firstName: D
LastName: Davis; firstName: T
------------
Names from B to D
LastName: Barton; firstName: J
LastName: Briggs; firstName: A
LastName: Davies; firstName: D
LastName: Davis; firstName: T
LastName: Douglas; firstName: N
```

Using only `from` or `to`:
```js
console.log('Names from B');
z.forEachChild({
  range: {
    from: 'B'
  }
}, function (lastName, node) {
  console.log('LastName: ' + lastName);
});
console.log('------------');
console.log('Names from D');
z.forEachChild({
  range: {
    from: 'D'
  }
}, function (lastName, node) {
  console.log('LastName: ' + lastName);
});
console.log('------------');
console.log('Names to D');
z.forEachChild({
  range: {
    to: 'D'
  }
}, function (lastName, node) {
  console.log('LastName: ' + lastName);
});
console.log('------------');
```
Response:
```
Names from B
LastName: Barton
LastName: Briggs
LastName: Davies
LastName: Davis
LastName: Douglas
LastName: a
LastName: b
LastName: c
LastName: d
------------
Names from D
LastName: Davies
LastName: Davis
LastName: Douglas
LastName: a
LastName: b
LastName: c
LastName: d
------------
Names to D
LastName: Barton
LastName: Briggs
LastName: Davies
LastName: Davis
LastName: Douglas
```

#### <a id="toe-foreachleafnode"></a> forEachLeafNode

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

### <a id="toe-traversing-document-nodes"></a> Traversing Document Nodes

#### <a id="toe-traversing-countChildren"></a> countChildren

Wants to know children count of document node?
```js
console.log('Number of children: ' + rob.countChildren());
```
Response:
```
Number of children: 5
```

#### <a id="toe-traversing-$"></a> $()

Let's look deeper to $() function

```js
var robx = rob.$('x', true);
console.log('robx: ' + robx.value);
console.log(JSON.stringify(rob, null, 2));
console.log('===============');
console.log(JSON.stringify(robx, null, 2));
```

Response:
```
robx: hello
{
  "documentStore": {
    "db": {},
    "build": {
      "no": "1.16.0",
      "date": "7 September 2017"
    },
    "domain": null,
    "_events": {},
    "_eventsCount": 1
  },
  "name": "rob",
  "isDocumentNode": true,
  "path": [],
  "documentName": "rob",
  "_node": {
    "global": "rob",
    "subscripts": []
  },
  "$x": {
    "documentStore": {
      "db": {},
      "build": {
        "no": "1.16.0",
        "date": "7 September 2017"
      },
      "domain": null,
      "_events": {},
      "_eventsCount": 1
    },
    "name": "x",
    "isDocumentNode": false,
    "path": [
      "x"
    ],
    "documentName": "rob",
    "_node": {
      "global": "rob",
      "subscripts": [
        "x"
      ],
      "data": "hello"
    }
  },
  "$y": {
    "documentStore": {
      "db": {},
      "build": {
        "no": "1.16.0",
        "date": "7 September 2017"
      },
      "domain": null,
      "_events": {},
      "_eventsCount": 1
    },
    "name": "y",
    "isDocumentNode": false,
    "path": [
      "y"
    ],
    "documentName": "rob",
    "_node": {
      "global": "rob",
      "subscripts": [
        "y"
      ],
      "data": "world"
    }
  },
  "$a": {
    "documentStore": {
      "db": {},
      "build": {
        "no": "1.16.0",
        "date": "7 September 2017"
      },
      "domain": null,
      "_events": {},
      "_eventsCount": 1
    },
    "name": "a",
    "isDocumentNode": false,
    "path": [
      "a"
    ],
    "documentName": "rob",
    "_node": {
      "global": "rob",
      "subscripts": [
        "a"
      ],
      "data": 0
    }
  },
  "$z": {
    "documentStore": {
      "db": {},
      "build": {
        "no": "1.16.0",
        "date": "7 September 2017"
      },
      "domain": null,
      "_events": {},
      "_eventsCount": 1
    },
    "name": "z",
    "isDocumentNode": false,
    "path": [
      "z"
    ],
    "documentName": "rob",
    "_node": {
      "global": "rob",
      "subscripts": [
        "z"
      ]
    }
  }
}
===============
{
  "documentStore": {
    "db": {},
    "build": {
      "no": "1.16.0",
      "date": "7 September 2017"
    },
    "domain": null,
    "_events": {},
    "_eventsCount": 1
  },
  "name": "x",
  "isDocumentNode": false,
  "path": [
    "x"
  ],
  "documentName": "rob",
  "_node": {
    "global": "rob",
    "subscripts": [
      "x"
    ],
    "data": "hello"
  }
}
```

### <a id="toe-traversing-parent"></a> parent

```js
var roby = rob.$x.$('y');
console.log('parent: ' + roby.parent.value);
```
Response:
```
parent: hello
```

#### <a id="toe-traversing-firstChild-nextSibling"></a> firstChild / nextSibling

```js
var first = rob.firstChild;
console.log('first: ' + first.name);
console.log('next = ' + first.nextSibling.name);
```
Response:
```
first: a
next = x
```

#### <a id="toe-traversing-lastChild-previousSibling"></a> lastChild / previousSibling

```js
var last = rob.lastChild;
console.log('last: ' + last.name);
console.log('previous = ' + last.previousSibling.name);
```
Response:
```
last: z
previous = y
```

#### <a id="toe-traversing-value"></a> value

```js
console.log('temp before: ' + temp.value);
temp.value = 1234;
console.log('temp after: ' + temp.value);
```
Response:
```
temp before:
temp after: 1234
```

#### <a id="toe-traversing-delete"></a> delete

```js
temp.delete()
console.log('temp after delete: ' + temp.value);
```
Response:
```
temp after delete:
```

### <a id="toe-gets-list-of-globals"></a> Gets a List of Globals

```js
var list = documentStore.list();
console.log(JSON.stringify(list));
```
Response:
```
["rob","temp"]
```
