(function (window) {

    "use strict";

    var arjunaneDragable = function () {
        this.selector   = null;
        this.version    = "v 1.0.0";
        this.github     = '';
    }

    arjunaneDragable.prototype.init = function (selector) {
        this.selector = document.querySelectorAll(selector);

        for(var i = 0; i < this.selector.length; i++)
        {
            var sel = this.selector[i];
            var img = sel.getElementsByTagName("img")[0];
            img.addEventListener("drag", function (e) {
                console.log(sel.offsetWidth)
            });
            console.dir(img)
        }
    }

    window.arDragable = new arjunaneDragable;
})(window);