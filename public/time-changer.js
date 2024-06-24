let date = new Date($.now())
console.log(date.getHours());

if(date.getHours() < 23) {
    alert('midnight');
    $("body").css('background-color', 'darkblue');
    $("body").css('opacity', 0.8);
    $(".wrap").css('box-shadow', '10px 12px 15px 0 yellow').css('background-color', 'white');
    $(".weatherImage img").attr('src', 'public/moon.png');
    $(".weatherImage img").attr('alt', 'public/moon.png');
    $(".weatherStatus h3").append("Good evening <b>" + $("#nick").text() + "</b> ! ");
}

if(date.getHours() < 12) {
    alert('midnight');
    $("body").css('background-color', 'orange');
    $("body").css('opacity', 0.8);
    $(".weatherImage img").attr('src', 'public/sunset.jpg');
    $(".weatherImage img").attr('alt', 'public/sunset.jpg');
    $(".weatherStatus h3").append("Good morning <b>" + $("#nick") + "</b> ! ");
}
