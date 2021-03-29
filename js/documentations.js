var docs        = document.getElementById("container-docs");
var nav         = document.getElementsByTagName("nav")[0];
var footer      = document.getElementsByTagName("footer")[0];
var navsHref    = nav.getElementsByTagName("a");
var humberger   = document.getElementsByClassName("humberger")[0];

document.getElementById('date-year').innerHTML = new Date().getFullYear().toString();

if(typeof nav !== 'undefined')
{
    if(window.innerWidth < 768) {
        nav.classList.add("inactive");
    }
    window.onscroll = function () {
        updateNav();
    }

    window.onresize = function () {
        updateNav(true);
    }
    
    function updateNav(onResize) {
        var maxScroll = window.scrollMaxY || (document.documentElement.scrollHeight - document.documentElement.clientHeight)

        var height          = document.documentElement.offsetHeight || document.body.offsetHeight,
            footerHeight    = footer.offsetHeight,
            scrollPosition  = document.documentElement.scrollTop || document.body.scrollTop,
            statement       = maxScroll - footerHeight,
            calcFinal       = scrollPosition - statement;
            
        if(window.innerWidth < 768) {
            if(typeof onResize !== 'undefined') nav.classList.add("inactive");
            nav.style.bottom = "0px";
            return;
        }
        
        if(typeof onResize !== 'undefined') nav.classList.remove("inactive");
        nav.style.bottom = (calcFinal >= 0 ? calcFinal : 0) + "px";
    }

    humberger.addEventListener("click", function () {
        if(nav.classList.contains('inactive')) nav.classList.remove("inactive");
        else nav.classList.add("inactive");
    })

    // arSyntax.init(".syntax", 'javascript');
}