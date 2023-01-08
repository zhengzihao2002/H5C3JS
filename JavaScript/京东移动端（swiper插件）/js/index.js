window.addEventListener('load',function(){
    //load 或者 DOMContentLoad 都行

    //不同的轮播图模块可以使用不同的类名，不止于.swiper-container
    var swiper = new Swiper('.swiper-container', {
        spaceBetween: 30,
        centeredSlides: true,
        loop:true,
        autoplay: {
            delay: 3000,//3秒切换一次
            disableOnInteraction: true,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        keyboard:true,
    });
});