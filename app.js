var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var JQuery = require('jquery'); 
var socket = io.listen(server);
var express = require('express');
var count = 0;
connections = [];
users = [];
upgrades  = [
    {
        nazev: 'test', 
        cena: 5, 
        skin: 'obr.png',
        zvyseni: 2
    },
    {
        nazev: 'test 2', 
        cena: 10,
        zvyseni: 10

    }, 
    {
      nazev: 'test3', 
      cena: 50,
      zvyseni: 10
    },
    {
      nazev: 'koule',
      cena: 5,
      zvyseni: 100000
    },
    {
      nazev: 'Zázrak', 
      cena: 5000, 
      zvyseni: 0
    }
]

num = [];
auth = [];
//@TODO vyresit zlepseni (zvyseni o N-peněz)
//external file - configuration
//express.use('/external', app.static('external'));
//work with extranal file 
app.use(express.static('public'));
app.use('/public', express.static('public'));

app.use('/public', function(req, res, next){
  console.log(req.url);
  next();


}); 
server.listen(process.env.port || 3000);
server.listen(3000);
	app.get('/', function(req, res) {
		res.sendfile(__dirname + '/index.html');
    
    
    console.log('Listening on *:3000');
  console.log('Server allready started');
		
	
	});


console.log("Server is loading...");
socket.on('connection', function(socket) {
    //login users function

   connections.push(socket);
   console.log("Connected: %s users", connections.length);
   console.log(socket.id);
   
  //display point to status panel

  socket.on('point', function(data){
    console.log("ahoj, vse je ok");
    socket.emit('point', {pts: data})
  }) 
   
   

    //funkce odhlásit se 

    socket.on('disconnect', function(data){
      connections.splice(connections.indexOf(socket),1);
    console.log("Disconnected: %s socket Disconnected %s", connections.length, users.length);
    console.log(users.length);
    
  });



  //Zpráva v chatu
  socket.on('new message', function(data){
     console.log('Napsaal jsi: ' +data);
     var jmeno = undefined;
     for(var i=0;i<users.length;i++) {
        if(socket.id == users[i]["id"]) {
            jmeno = users[i]["jmeno"];
        }   
     }

     io.sockets.emit('new message', {msg: data, author: jmeno});
     //io.sockets.emit('new message', socket.id);
     //io.sockets.emit('new message', {msg: users});
     

     num.push("ahojkly", {msg: data}, {msg: users});

     console.log(num);
     auth.push("USER ID: " + socket.id);
    console.log(auth);
    console.log("tvoje zpráva je" + data);
   

    /*var x = {};
    //x["socket.id"] = "data";
    x[socket.id] = data;
    console.log(x);
    */
  });

  /*
  socket.on('send message', function(data){
    console.log(data);
    io.sockets.emit('new message', {msg:data})
  })
  */

  //Status functions

  socket.on('stat', function(data){
     console.log('login-data:' +data);
     //io.sockets.emit('new message', {msg: data});
     
  });

  socket.on('akce', function(data){
    console.log('Sebral jsi +1 zlatak' + data.users);
    io.sockets.emit('akce', {money: data});

    
      var x = {}
        x["penize"] = "1";
  
    
    
    users.push(x);
    console.log(x.penize);
    console.log(x);
  })

 

  //login area
  socket.on('hit', function(data){
    console.log("HIT +1");
   
     for(var i=0;i<users.length;i++) {
        if(socket.id == users[i]["id"]) {
             // @TODO nastavit penize
            penize = 1;
            users[i].penize++;

            io.sockets.emit('hit', {plus: users[i].penize});
            console.log(users[i].penize + " " + users[i].jmeno);
            
            break;


        }   
     }
     
      

    console.log(data);
  })
  socket.on('login', function(data){
    console.log('data uzivatelu' + data);
    
    
    if(data){
      console.log('Data prijata');
      var x = {};
    
      x["id"] = socket.id;
      x["jmeno"] = data;
      x["penize"] = 0;  
      console.log(x);
      users.push(x);
      console.log(x.jmeno);
      console.log("pemnkjhklj" + x.penize);
    
    /*
    if(x.penize == "0") {
      x["penize"] += 1;
      console.log(x.penize);
      while(x["penize"] += 1)
      {
        console.log()
      }
    } else
    {
      x["penize"] += 2
      console.log(x.penize);
    }
    */
    var activeUsers = [];
    for(var i = 0; i < connections.length; i++) {
      for(var j = 0; j < users.length; j++) {
        if(users[j].id == connections[i].id)
        {
          activeUsers.push(users[j]);
        }
      }
    }
    console.log(activeUsers);
    console.log(users);
    //console.log(connections);
    
    for(var i in x) {
        x["penize"] += 2;
    }

    for(var i = 0; i < x.penize; i++) {
      x["penize"] = "0";
      console.log(x.penize);
    }

    
    console.log(x.penize);
    console.log(x);

    console.log("Vypis: " + x.jmeno + "Penize: " +x.penize);
    io.sockets.emit('login', {users: activeUsers});
    io.sockets.emit('refresh-users', {users: activeUsers});
    } else {
      console.log('Uzivatel jeste nebyl prihlasen');
    }
    
  })


socket.on('get-upgrades', function(data){
    for(var i=0;i<users.length;i++) {
        if(socket.id == users[i]["id"]) {
          var users_upgrade = upgrades;
            for(var j = 0; j < upgrades.length; j++)
            {
                if(users[i].penize >= upgrades[j].cena) {
                  users_upgrade[j].dostupny = true;

                } else
                {
                  users_upgrade[j].dostupny = false;
                }
                if(upgrades[j].dostupny == true) {
                    users[i].penize += upgrades[i].zvyseni;
                }
            }
       io.sockets.emit('get-upgrades', {upgrades: users_upgrade});



        }
      }
})

});




