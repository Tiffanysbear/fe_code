使用如下：
```
var logConfig = {
    pageView: {
        actId: 0,
        index: 0,
        param: {}
    },
    elView: {
        '.selector1': {
            once: false,
            actId: 0,
            index: 0,
            param: {}
        },
        '.selector2': {
            once: false,
            actId: 0,
            index: 0,
            param: {}
        }
    },
    tap: {
        '.selector1': {
            actId: 0,
            index: 0,
            param: {}
        },
        '.selector2': {
            actId: 0,
            index: 0,
            param: {}
        }
    },
    business: {
        'event1.log': {
            actId: 0,
            index: 0,
            param: {}
        },
        'event2.log': {
            actId: 0,
            index: 0,
            param: {}
        }
    }
};
```