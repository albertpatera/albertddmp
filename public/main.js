//P�ipojen� na server
var socket = io.connect("http://31.31.78.67:3000");
//P�ihl�en�
var $lf = $("#loginForm");
var $cf = $("#chatMsg");
var $msg = $("#chatMsg input");
var $jmeno = $("#userData .jmeno");
var $penize = $("#userData .penize");
var $vydelek = $("#vydelek");
/**
 * Funkce pro p�ihl�en� u�ivatele
 * @param {string} name Jm�no u�ivatele
 */
function prihlasitSe(name) {
    socket.emit('login', $("#nick").val());

}
/**
 * Funkce pro načtení uživatele do seznamu
 * @param {string} uzivatele Uživatel
 *

 */
function nacistUzivatele(uzivatele) {
    var keys = Object.keys(uzivatele);
    $("#status ul").html("");
    for (var i = 0; i < keys.length; ++i) { 
        console.log(uzivatele[keys[i]].jmeno);
        $("#status ul").append("<li class='list-group-item'>" + uzivatele[keys[i]].jmeno + "<span class='badge'>Online</span>" +
            "<img src='" + uzivatele[keys[i]].skin + "'> </li>");
    }
}
/**
 * Funkce pro Odeslání zprávy
 * @param {string} zprava Text Zprávy
 *
 */
function poslatZpravu(zprava) {
    if (zprava.length === 0)
        return;
    socket.emit('new message', zprava);
}
/**
 * Funkce pro načtení všech dostupných vylepšení
 * @param {string} upgrades Název Upgradu
 */
function nacistUpgrady(upgrades) {
    $("#upgradesList ul").html("");
    for (var i = 0; i < upgrades.length; ++i) {
        var li = '<li class="list-group-item" id="upgrade'+i+'">' +
                '<img src="public/'+upgrades[i].skin+'">' +
                '<span class="nazev">'+upgrades[i].nazev+'</span> ' +
                '<span class="cena">'+upgrades[i].cena+'</span> ' +
                '<span class="vynos">'+upgrades[i].zvyseni+'</span> ' +
                '<span class="pocet">0</span> ' +
                '<button class="kup" class="btn-success" data-id="'+i+'">Kup</button></li>';
        $("#upgradesList ul").append(li);
    }
    $(".kup").click(function(){
        socket.emit('buy', $(this).data("id"));
    });
}

$lf.submit(function (e) {
    var $nick = $("#nick");
    var delka = $("#nick").val().length;
    if (delka === 0) {
        alert("Jmeno nemuze byt prazdne");
        return;
    }

    e.preventDefault();
    console.log("Prihlaseni uzivatele " + $nick.val() + " bylo uspesne");
    prihlasitSe($("#nick").val());
    $("#nick").val('');
    $("#myModal").modal('hide');
});

$cf.submit(function (e) {
    e.preventDefault();
    poslatZpravu($msg.val());
    $msg.val('');
    $cf.submit(function(){
        $("#chat").animate({
            scrollTop: $(".list-group-item").offset().top
        }, 2000);
    });

});
$vydelek.click(function () {
    socket.emit('hit');
    //Kdyz hrac presahne urcity limit, vyskoci hlaska
    var Moneylength = users.penize.toString().length;
    if(Moneylength == 10) {
        alert("alert na penize");
    }


});
/*
$("").click(function(){
    $("html, body").animate({
        scrollTop: $(".test").offset().top
    }, 2000);
});

*/

/*SCROLL*/



/*
 * Zachytávání signálů ze serveru
 */
//Refresh users
socket.on('refresh-users', function (data) {
    console.log(data);
    nacistUzivatele(data["users"]);
});
//Nov� zpr�va
socket.on('new message', function (data) {
        $("#chat ul").append("<li class='list-group-item'><span class='author'>" + data.author + " </span><span class='msg'>" + data.text + "</span></li>");


});
//Nov� data u�ivatele
socket.on("refresh-user-data", function (data) {
    $jmeno.text(data.jmeno);
    $penize.html('<span class="glyphicon glyphicon-piggy-bank" title="Dispotabilní zůstatek">' + data.penize + '</span>');
});
//Upgrades
socket.on("refresh-upgrades", function (data) {
    nacistUpgrady(data);
});
//New upgrade
socket.on("new upgrade", function (data){
   $("#upgrade" + data.id + " .pocet").text(data.count);
});
$(document).ready(function() {
   //alert("Dokument je připravený");
    $("#myModal").modal('show');


});

$(".list-group-item").click(function () {
    $(".list-group-item").animate({ scrollDown: $(document).height() }, "slow")
});

