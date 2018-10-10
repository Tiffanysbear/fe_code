/**
 * @file fixBar.js
 * @author Tiffany
 * @description: need Zepto and Hammer
 **/
var $ = window.Zepto;
var hammer = window.Hammer;
var $root = $('.fixbar-container');

var fixBar = function (option) {
    this.option = option || {};

    this.init();
};

fixBar.prototype = {
    init: function () {
        this.bindEvent();
    },
    bindEvent: function () {
        var ua = navigator.userAgent;
        var isANDROID = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
        var isSupportSticky = this.isSupportSticky();
        // ANDROID
        if (isANDROID || !isSupportSticky) {
            var el = $root[0];
            if (!el) {
                return;
            }
            var rect = el.getBoundingClientRect();
            $root.data({
                top: $root.offset().top
            });
            var $holder = $('<div></div>').addClass('progress-holder')
                .hide().height(rect.height).width(rect.width);
            $holder.insertBefore($root);
            document.addEventListener('scroll', this.onScroll);
        }
    },
    isSupportSticky: function () {
        if (CSS.supports('position', 'sticky') 
            || CSS.supports('position', '-webkit-sticky')
            || CSS.supports('position', '-moz-sticky')
            || CSS.supports('position', '-o-sticky')) {
            return true;
        }
        return false;
    },
    onScroll: function (e) {
        var el = $root[0];
        var top = $root.data('top');
        if (window.scrollY < top) {
            el.style.position = 'relative';
            $('.progress-holder').hide();
        }
        else {
            el.style.position = 'fixed';
            $('.progress-holder').show();
        }
    }

}


module.exports = fixBar;