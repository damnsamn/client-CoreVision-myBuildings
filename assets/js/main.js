$(document).ready(function () {
    $(".nav__button").click(function () {
        $("html").toggleClass("no-scroll");
        $(this).toggleClass("expanded").siblings(".nav__menu").toggleClass("expanded");
    });
});