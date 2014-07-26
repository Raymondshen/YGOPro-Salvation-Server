/* jshint node : true */
/* jshint mocha : true */

var Browser = require("zombie");
var assert = require('assert');
var net = require('net');
var fs = require('fs');
var net = require('net');
try {
    var server = require('../server/server.js');
    var server = require('../client/interface/js/offline-server.js');
} catch (error) {
    console.log("fundemental issue!");
}
console.log('Running test');
describe('YGOCore is assembled correctly', function () {
    it('YGOCore built', function () {
        assert((fs.existsSync('server/http/ygopro/YGOServer.exe')), true);
    });
    it('Card Database included', function () {
        assert((fs.existsSync('server/http/ygopro/cards.cdb')), true);
    });
    it('Ban List included', function () {
        assert((fs.existsSync('server/http/ygopro/lflist.conf')), true);
    });
    it('SQLite.dll included', function () {
        assert((fs.existsSync('server/http/ygopro/System.Data.SQLite.dll')), true);
    });
    it('OCGCOre built', function () {
        assert((fs.existsSync('server/http/ygopro/libocgcore.so') ||
            (fs.existsSync('server/http/ygopro/ocgcore.dll')), true));
    });
});
describe('Testing that Dependencies Load', function () {
    it('Loaded Objectifier', function () {
        var target = require('../server/libs/objectifier.js');
    });
    it('Loaded Packet Decoder', function () {
        var target = require('../server/libs/parsepackets.js');
    });
    it('Loaded Recieve Client to Server Message Marker', function () {
        var target = require('../server/libs/recieveCTOS.js');
    });
    it('Loaded Recieve Server to Client Message Marker', function () {
        var target = require('../server/libs/recieveSTOC.js');
    });
    it('Loaded Development/Stage/Production Markers', function () {
        var target = require('../server/libs/servercontrol.json');
        assert((target.production === 'http://salvationdevelopment.com/launcher/'), true);
    });
    it('Loaded Update System', function () {
        var target = require('../server/libs/update.js');
    });
});

describe('TOS & Licences are Included', function () {
    it('Terms of Service', function () {
        assert((fs.existsSync('../server/http/licence/sdlauncher-tos.text') !== null), true);
    });
    it('YGOPro', function () {
        assert((fs.existsSync('../server/http/licence/ygopro.txt') !== null), true);
    });
    it('Node-Webkit', function () {
        assert((fs.existsSync('../server/http/licence/node-webkit.txt') !== null), true);
    });
    it('Machinima Sound', function () {
        assert((fs.existsSync('../server/http/licence/machinimasound.text') !== null), true);
    });
    it('Fake Detection', function () {
        assert((fs.existsSync('../server/http/licence/sdlauncher-tos.text') !== null), false);
    });

});
describe('Structures Test', function () {
    var structureDefinition = require('../server/libs/objectifier.js');
    it('Structure Creation', function () {
        var header = {
            test: 'char',
            long: 'long'
        };
        var strut = structureDefinition(header);
        var out = strut.write({
            test: 'a',
            long: "abcd    "
        });
        var validate = strut.read(out);
        assert((validate.test === "a"), true);
        assert((validate.long === "abcd    "), true);
    });
});
describe('Test Network Connection Methods', function () {
    var proxy = require('../server/http/js/proxy.js');
    it('TCP Native', function () {
        var socket = net.createConnection(8911);
        socket.on('connect', function (connect) {
            var playerconnect1 = require('./playerconnect1.js');
            var message = new Buffer(playerconnect1);
            socket.write(message);

        });
    });
    it('TCP To Websocket Proxy', function () {
        this.timeout(3500);
        var socket = net.createConnection(8912);
        socket.on('connect', function (connect) {
            var playerconnect1 = require('./playerconnect1.js');
            var message = new Buffer(playerconnect1);
            socket.write(message);
        });
    });
    it('Primus Websocket Connects, Starts Receieving Gamelist, and Request Duel', function () {
        this.timeout(2000);
        var http = require('net');
        var server = http.createServer().listen(8003);
        var Primus = require('primus');
        var primus = new Primus(server);
        var Socket = primus.Socket;

        var client = new Socket('http://localhost:5000');
        var playerconnect1 = require('./playerconnect1.js');
        var message = new Buffer(playerconnect1);
        client.write({
            action: 'join'
        });
        client.write({
            action: 'leave'
        });
    });
});
describe('Test Offline Server', function () {
    this.timeout(10000);

    before(function (test0) {
        this.browser0 = new Browser();
        this.browser0
            .visit("http://localhost:9467/index.html")
            .then(test0, test0);
    });
    before(function (test1) {
        this.browser1 = new Browser();
        this.browser1
            .visit("http://localhost:9467/")
            .then(test1, test1);
    });
    before(function (test2) {
        this.browser2 = new Browser();
        this.browser2
            .visit("http://localhost:9467/d")
            .then(test2, test2);
    });
    before(function (test3) {
        this.browser3 = new Browser();
        this.browser3
            .visit("http://localhost:9467/r")
            .then(test3, test3);
    });
    before(function (test4) {
        this.browser = new Browser();
        this.browser4
            .visit("http://localhost:9467/j")
            .then(test4, test4);
    });

    it('Offline Mode Loads', function (test0) {
        assert((this.browser.text("title") === "SalvationDevelopment International Launcher"), true);
        test0();
    });
    it('Offline Mode Loads', function (test1) {
        test1();
    });
    it('Offline Mode Loads', function (test2) {
        test2();
    });
    it('Offline Mode Loads', function (test3) {
        test3();
    });
    it('Offline Mode Loads', function (test4) {
        test4();
    });
});

/*
var structureDefinition = require('../objectifier.js');

var structureDefinition = require('../objectifier.js');
var header = {
    test: ['char', 10],
    long: 'long'
};
var strut = structureDefinition(header);
var out = strut.write({
    test: 'a123456789',
    long: "abcd    "
});
var validate = strut.read(out);
console.log(validate)
//console.log(validate.test.length, "a123456789".length, true);
//console.log(validate.long.length, "abcd    ".length, true);
console.log(validate.test, "a", true);
console.log(validate.long, "abcd    ", true);*/