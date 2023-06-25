// $(window).onload = function() {
    var addData = function(dataLink, dataID) {
        dataID = '#' + dataID
        $ajaxUtils.sendGetRequest(
            dataLink,
            function (data) {
                document.querySelector(dataID).innerHTML = data;
            },
        false);
    };

    // Adding Data
    // var loadContent = function() {
    console.log("1")
    addData("snippets/carousel.html", "carousel");
    addData("snippets/case-study.html", "case-study");
    addData("snippets/team.html", "team-info");
// };

if(window.matchMedia("(min-width:576px)").matches){
    console.log(2)
    // var carouselWidth = $("#case-study-inner")[0].scrollWidth;
    // var cardWidth = $("#case-study #case-study-inner .carousel-item").width();

    var cardWidth = $(window).width() / 3;
    var carouselWidth = 5*cardWidth
    console.log(cardWidth, carouselWidth);

    
    var scrollPosition = 0
    
    $("#case-study .carousel-control-next").on('click', function(){
        console.log("yes")
        if((scrollPosition) < (carouselWidth - (cardWidth*3.5))){
            changeValues();
            scrollPosition = scrollPosition + cardWidth;
            $("#case-study-inner").animate({scrollLeft: (scrollPosition)}, 600);
        }
    });

    $("#case-study .carousel-control-prev").on('click', function(){
        if(scrollPosition > 0){
            changeValues();
            scrollPosition = scrollPosition - cardWidth;
            $("#case-study-inner").animate({scrollLeft: scrollPosition}, 600);
        }
    });

    var changeValues = function(){
        var n = scrollPosition / cardWidth;
        cardWidth = $(window).width() / 3;
        carouselWidth = 5*cardWidth;

        scrollPosition = n * cardWidth
    };

}else{
    $("#case-study").addClass("slide");
};
// };

