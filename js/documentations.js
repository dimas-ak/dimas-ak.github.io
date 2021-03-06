var docs    = document.getElementById("container-docs");
var nav     = document.getElementsByTagName("nav")[0];
var footer  = document.getElementsByTagName("footer")[0];
var navsHref= nav.getElementsByTagName("a");

document.getElementById('date-year').innerHTML = new Date().getFullYear().toString();

if(typeof nav !== 'undefined')
{
    window.onscroll = function (e) {

        var maxScroll = window.scrollMaxY || (document.documentElement.scrollHeight - document.documentElement.clientHeight)

        var height          = document.documentElement.offsetHeight || document.body.offsetHeight,
            footerHeight    = footer.offsetHeight,
            scrollPosition  = document.documentElement.scrollTop || document.body.scrollTop,
            statement       = maxScroll - footerHeight,
            calcFinal       = scrollPosition - statement;
            
        nav.style.bottom = (calcFinal >= 0 ? calcFinal : 0) + "px";
    }
    
    // arSyntax.init(".syntax", 'javascript');
}