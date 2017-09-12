/*

 ----------------------------------------------------------------------------
 | ewd-document-store: Persistent JavaScript Objects and Document Database  |
 |                      using Global Storage                                |
 |                                                                          |
 | Copyright (c) 2017 M/Gateway Developments Ltd,                           |
 | Reigate, Surrey UK.                                                      |
 | All rights reserved.                                                     |
 |                                                                          |
 | http://www.mgateway.com                                                  |
 | Email: rtweed@mgateway.com                                               |
 |                                                                          |
 |                                                                          |
 | Licensed under the Apache License, Version 2.0 (the "License");          |
 | you may not use this file except in compliance with the License.         |
 | You may obtain a copy of the License at                                  |
 |                                                                          |
 |     http://www.apache.org/licenses/LICENSE-2.0                           |
 |                                                                          |
 | Unless required by applicable law or agreed to in writing, software      |
 | distributed under the License is distributed on an "AS IS" BASIS,        |
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. |
 | See the License for the specific language governing permissions and      |
 |  limitations under the License.                                          |
 ----------------------------------------------------------------------------

  7 September 2017

*/

// ewd-qoper8 Worker Module example which connects to a Cache database

'use strict';

var DocumentStore = require('ewd-document-store');
var Cache = require('cache').Cache;

module.exports = function () {

  this.on('start', function (isFirst) {
    // establish the connection to Cache database

    this.db = new Cache();

    var ok = this.db.open({
      path: process.env.CACHE_MGR_PATH || '/opt/cache/mgr',
      username: process.env.CACHE_USERNAME || '_SYSTEM',
      password: process.env.CACHE_PASSWORD || 'SYS',
      namespace: process.env.CACHE_NAMESPACE || 'USER'
    });

    console.log('ok: ' + JSON.stringify(ok));

    this.documentStore = new DocumentStore(this.db);

    // Example of handler for the afterSet event which is fired every time a GlobalNode value changes:
    this.documentStore.on('afterSet', function (node) {
      console.log('afterSet: ' + JSON.stringify(node));
    });

    //  Clear down the requests global when ewd-qoper8 first started:
    if (isFirst) {
      var glob = new this.documentStore.DocumentNode('requests');
      glob.delete();
    }
  });

  this.on('message', function(messageObj, send, finished) {
    // For example - save every incoming message object to the requests global
    var glob = new this.documentStore.DocumentNode('requests', [process.pid]);
    var ix = glob.increment();

    glob.$(ix).setDocument(messageObj);

    var results = {
      hello: 'from worker ' + process.pid,
      time: new Date().toString(),
      message: messageObj
    };
    finished(results);
  });

  this.on('stop', function() {
    // Make sure the connection to Cache is closed before the child process closes;
    console.log('Worker ' + process.pid + ' closing database');
    this.db.close();
  });

};
