// Add elements with scroll ////////////////////////////////////////////////////
window.addEventListener("scroll", function(){
    var reveal = this.document.querySelectorAll(".scroll-hide")

    for(var i = 0; i < reveal.length; i++){
        var window_height = window.innerHeight;
        var reveal_top = reveal[i].getBoundingClientRect().top;
        var reveal_pt = 0;

        if(reveal_top < window_height - reveal_pt){
            reveal[i].classList.add("scroll-reveal");
        }
        else{
            reveal[i].classList.remove("scroll-reveal");
        }
    }
});