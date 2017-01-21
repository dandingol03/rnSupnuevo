/**
 * Created by danding on 17/1/19.
 */

var events = require('events');
var emiter = new events.EventEmitter();

emiter.on('newListener', function(e, f) {
    console.log('newListener');
});


var mark = function(req, res) {
    console.log('mark');
}

emiter.addListener('request', mark);

