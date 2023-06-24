$(function(){ //This function is the first one to run on load
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
    addData("snippets/carousel.html", "carousel");
    addData("snippets/case-study.html", "case-study");
    addData("snippets/team.html", "team-info");
});

window.onload = function () {
// Working of the Carousel of the Case Study
if(window.matchMedia("(min-width:576px)").matches){
    // var carouselWidth = $("#case-study-inner")[0].scrollWidth;
    var cardWidth = $("#case-study-inner .carousel-item").width();
    var carouselWidth = 5*cardWidth
    console.log(cardWidth, carouselWidth)

    
    var scrollPosition = 0
    
    $("#case-study .carousel-control-next").on('click', function(){
        if(scrollPosition < (carouselWidth - (cardWidth*3.5))){
            changeValues();
            scrollPosition = scrollPosition + cardWidth;
            $("#case-study-inner").animate({scrollLeft: scrollPosition}, 600);
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
        carouselWidth = $("#case-study-inner")[0].scrollWidth;
        cardWidth = $("#case-study-inner .carousel-item").width();

        scrollPosition = n * cardWidth
    };

}else{
    $("#case-study").addClass("slide");
}
};