var express = require('express');
var app = express();
var io = require('socket.io')(app.listen(8070));
var five = require('johnny-five');

//Setting the path to static assets
app.use(express.static(__dirname + '/app'));

//Serving the static HTML file
app.get('/', function (res) {
    res.sendFile('/index.html')
});

var board = new five.Board({
    repl: false
});


var temp = 20;

board.on('ready', function () {

io.sockets.on('connection', function (socket) {
    var cfg = new five.Sensor({
      id: 'Analog test',
      pin: 'A0',
      type: 'analog',
      range: [0, 1023],
      freq: 1000
    });
     cfg.on("data", function() {
        socket.emit('pulse', this.value)
      });


    // cfg.scale([ 0, 100 ]).on("change", function() {
      
    // });
    // socket.emit('pulse',temp)
    // var tst = new five.Pin(cfg);
    // tst.on('data', dataCallback);
    // tst.io.analogRead(tst.pin, readCallback1);
    // five.Pin.read(tst, readCallback2);
    // function readCallback1(val) {
    //     return val;
    //     // console.log('read callback 1 with:', val);
    // }
    // function readCallback2(val) {
    //     console.log('read callback 2 with:', val);
    // }
    // function dataCallback() {
    //     // console.log('data callback for:', this.id, this.value);
    //     return this.value;
    // }
});


});





