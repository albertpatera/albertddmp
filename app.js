/*Definované konstanty */
//Konfigurace serveru
//TODO externi konfigurace (settings.json)
var PRIRUSTEK = 1;
var PORT = 25565;
//Proměnná ve které je jádro aplikace
var app = require('express')();
//Http server pro aplikaci
var server = require('http').Server(app);

//vytvoření socket serveru
var io = require('socket.io').listen(server);
var socket = io.listen(server);
//Knihovna express
var express = require('express');

//Historie zpráv
//Objekt, jeho atributy jsou hodnoty uzivatelu
var users = {};
var chat_history = [];



/* Definice aplikace */
//Frontend
app.use(express.static('public'));
app.use('/public', express.static('public'));
    console.log(true);
app.use('/public', function (req, res, next) {
    console.log(req.url);
    next();

});

server.listen(process.env.port || PORT);
server.listen(PORT);
console.log('Listening on *:' + PORT);
//Funkce při připojení uživatele na kořenový adresář
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});


//Upgrades
//Načtení z ext. souboru
//UPGRADES.JSON
upgrades = [
    {
        nazev: 'Building Kit',
        cena: 50,
        skin: 'BK.png',
        zvyseni: 2
    },
    {
        nazev: 'Drevo',
        cena: 100,
        skin: '2.png',
        zvyseni: 5

    },
    {
        nazev: 'Dreveny dum',
        cena: 500,
        skin: '3.png',
        zvyseni: 10
    },
    {
        nazev: 'koule',
        cena: 1000,
        skin: '4.png',
        zvyseni: 25
    },
    {
        nazev: 'Zázrak',
        cena: 50000,
        skin: 'miracle.png',
        zvyseni: 1500
    }
];

//Nové spojení
socket.on('connection', function (socket) {
    console.log(socket.id);
    //p�ihl�en� u�ivatele
    socket.on('login', function (data) {
        if (!data || data.length === 0)
            return;
        //Vytvoření nového uživatele
        var x = {};
        x["id"] = socket.id;
        x["jmeno"] = data;
        x["penize"] = 0;
        x["skin"] = "1.png";
        x["upgrades"] = [];
        for(var i =0; i<upgrades.length; ++i)
            x["upgrades"][i] = 0;
        users[socket.id] = x;
        console.log("Prihlsen uzivatel %s", data);
        console.log(x.skin)
        io.sockets.emit('refresh-users', {users: users});
        socket.emit('refresh-upgrades', upgrades);
        socket.emit('refresh-user-data', users[socket.id]);
        io.sockets.emit('login', {users: "test"});
    });
    //Odpojeni
    socket.on('disconnect', function (data) {
        delete(users[socket.id]);
        console.log("Odhlasen uzivatel, zbyva %d", Object.keys(users).length);
        //var jmeno = users[socket.id].jmeno;
        var message = {};
        chat_history.push(message);

    io.sockets.emit('new message', {text: "Hrac opustil hru, tesime se priste", author: "SYSTEM"});


    });
    //Nova zprava
    socket.on('new message', function (data) {
        try {
            var jmeno = users[socket.id].jmeno;
        } catch (error) {
            console.log("Problem s hledanim uzivatele %s", error);
            return;
        }
        var message = {};
        message.text = data;
        message.author = jmeno;
        console.log("Nova zprava od %s %s", message.text, message.author);
        io.sockets.emit('new message', message);
        chat_history.push(message);
    });
    //V�d�lek
    socket.on('hit', function (data) {

        users[socket.id].penize += PRIRUSTEK;
        //var moneyLenght = users.penize.toString().length;
        for(var i = 0; i<users[socket.id].upgrades.length; ++i) {
            users[socket.id].penize += users[socket.id].upgrades[i] * upgrades[i].zvyseni;
        }



        socket.emit('refresh-user-data', users[socket.id]);

        //zjisti, jestli uzivatel prekrocil hranici

        switch(users[socket.id].penize)
        {
            case 5:
                var jmeno = users[socket.id].jmeno;
                console.log(" | SYSTEM |   hrac " + jmeno + " disp. cast. 5 $");
                //io.sockets.emit('new message', 'hrac %s dispoonuje castkou 100 $');
                var message = {};
                message.infoA = jmeno;
                io.sockets.emit('new message', {text: "Disponuji castkou 5 $...", author: jmeno});
                console.log("Test..... %s", message.infoA);
            break;
            case 50:
                var jmeno = users[socket.id].jmeno;
                console.log(" | SYSTEM |   hrac " + jmeno + " disp. cast. 50 $ ");
                var message = {};
                message.infoA = jmeno;
                io.sockets.emit('new message', {text: "Disponuji castkou 50 $...", author: jmeno});
                console.log("Test..... %s", message.infoA);

                /*
                if(users[socket.id].penize) {

                    io.sockets.emit('new message', {text: "NO UPGRADES", author: "SYSTEM"});

                    console.log("undefines")
                } else {
                    console.log("no results");
                }
                */
                break;
        }








    });
    //Nákup
    socket.on('buy', function (data) {
        pozadovany_upgrade = upgrades[data];
        if(pozadovany_upgrade === undefined)
            return;
        if(pozadovany_upgrade.cena > users[socket.id].penize)
            return;
        users[socket.id].upgrades[data]++;
        users[socket.id].penize-=pozadovany_upgrade.cena;
        socket.emit("refresh-user-data", users[socket.id]);
        socket.emit("new upgrade", {id: data, count: users[socket.id].upgrades[data]});
    });
});





