/**
 * @file log打点封装
 */

/* global wapfelog */
window.customEventMediator = {};

function Log(ops) {
    this.config = ops;
    this.run();
}
Log.prototype.run = function () {
    this.pageViewLog()
        .elViewLog()
        .tapLog()
        .businessLog();
};

Log.prototype.pageViewLog = function () {
    var config = this.config;
    if (!config.pageView) {
        return this;
    }
    var param = $.isFunction(config.pageView.param)
        ? config.pageView.param(arguments)
        : config.pageView.param;
    var cfg = $.extend(true, {}, param, {
        index: config.pageView.index
    });
    wapfelog.send('pv', cfg, 1, config.pageView.actId);
    return this;
};

Log.prototype.elViewLog = function () {
    var config = this.config;
    if (!config.elView) {
        return this;
    }
    function onScroll(e) {
        $.each(config.elView, function (k, v) {
            var $el = $(k);
            $el.each(function () {
                var el = this;
                if (!el || !el.getBoundingClientRect) {
                    return;
                }
                var top = el.getBoundingClientRect().top;
                var bottom = el.getBoundingClientRect().bottom;
                var se = document.documentElement.clientHeight;
                var viewed = $(el).data('viewed');
                var viewLogged = $(el).data('viewLogged');
                if (v.once && viewLogged) {
                    return;
                }
                if (top < se && bottom > 0) {
                    if (viewed) {
                        return;
                    }
                    $(el).data({
                        viewed: true,
                        viewLogged: true
                    });
                    var index = $.isFunction(v.index) ? v.index.apply(el, arguments) : v.index;
                    var param = $.isFunction(v.param) ? v.param.apply(el, arguments) : v.param;
                    var cfg = $.extend(true, {}, param, {
                        index: index
                    });
                    wapfelog.send('pv', cfg, 1, v.actId);
                }
                else if (top >= se || bottom <= 0) {
                    $(el).data({
                        viewed: false
                    });
                }
            });
        });
    }
    $(document).on('scroll.log', onScroll)
        .trigger('scroll');
    $.sfDetach(function () {
        $(document).off('scroll.log', onScroll);
    });
    return this;
};

Log.prototype.tapLog = function () {
    var config = this.config;
    if (!config.tap) {
        return this;
    }
    $(document).on('click', function (e) {
        var $target = $(e.target);
        var that = this;
        $.each(config.tap, function (k, v) {
            if ($target.closest(k).length) {
                var currentTarget = $target.closest(k)[0] || that;
                if ($.isArray(v)) {
                    $.each(v, function (idx, val) {
                        var index = $.isFunction(val.index) ? val.index.apply(currentTarget, arguments) : val.index;
                        var param = $.isFunction(val.param) ? val.param.apply(currentTarget, arguments) : val.param;
                        var cfg = $.extend(true, {}, param, {
                            index: index
                        });
                        wapfelog.send('click', cfg, 1, val.actId);
                    });
                }
                else if ($.isPlainObject(v)) {
                    var index = $.isFunction(v.index) ? v.index.apply(currentTarget, arguments) : v.index;
                    var param = $.isFunction(v.param) ? v.param.apply(currentTarget, arguments) : v.param;
                    var cfg = $.extend(true, {}, param, {
                        index: index
                    });
                    wapfelog.send('click', cfg, 1, v.actId);
                }
            }
        });
    });
    return this;
};
Log.prototype.businessLog = function () {
    var config = this.config;
    if (!config.business) {
        return this;
    }
    $.each(config.business, function (k, v) {
        $(customEventMediator).on(k, function () {
            var that = this;
            if ($.isArray(v)) {
                $.each(v, function (idx, val) {
                    var index = $.isFunction(val.index) ? val.index.apply(that, arguments) : val.index;
                    var param = $.isFunction(val.param) ? val.index.param(that, arguments) : val.param;
                    var cfg = $.extend(true, {}, param, {
                        index: index
                    });
                    wapfelog.send('pv', cfg, 1, val.actId);
                });
            }
            else if ($.isPlainObject(v)) {
                var index = $.isFunction(v.index) ? v.index.apply(that, arguments) : v.index;
                var param = $.isFunction(v.param) ? v.param.apply(that, arguments) : v.param;
                var cfg = $.extend(true, {}, param, {
                    index: index
                });
                if (arguments.length > 1 && typeof arguments[1] === 'object') {
                    $.extend(true, cfg, arguments[1]);
                }
                wapfelog.send('pv', cfg, 1, v.actId);
            }
        });
    });
    return this;
};

module.exports = Log;
