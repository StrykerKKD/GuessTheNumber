/**
 * Created by stryker on 2014.02.12..
 */
var WebSocketServer = require('ws').Server
    , http = require('http')
    , express = require('express')
    , app = express()
    , uuid = require('uuid');

app.use(express.static(__dirname + '/public'));

var server = http.createServer(app);
server.listen(8080);
var min = 0, max = 100;
var randomNumber = getRandomInt(min,max);
console.log("Random number: "+randomNumber);

var wss = new WebSocketServer({server: server});

wss.on('connection', function(ws) {
    var initmsg = {type:'init',userID:uuid.v4()}
    ws.send(JSON.stringify(initmsg));
    ws.on('message',function(message){
        var guess=JSON.parse(message);
        if(parseInt(guess.number) == randomNumber){
            for(var i in wss.clients){
                wss.clients[i].send(JSON.stringify({type:'winner',userID:guess.userID}));
            }
            setTimeout(function(){
                randomNumber = getRandomInt(min,max);
                console.log("Random number: "+randomNumber);
                for(var i in wss.clients){
                    wss.clients[i].send(JSON.stringify({type:'newround'}));
                }
            },3000);
        }
    });
});

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}