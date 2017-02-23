angular.module('wm.laravel-lazy-load', ['ng']).service('WMLaravelLazyLoad', ['$http', function ($http) {

    function WMLaravelLazyLoad(url, params, notLoadOnStart) {

        var that = this;

        that.url = url;

        that.params = params || {};

        that.data = [];

        that.info = {
            from:  0,
            last_page: 0,
            per_page: 0,
            to: 0,
            total: 0,
        };

        that.busy = false;

        that.completed = false;

        // initialize search 
        
        notLoadOnStart || that.next();
    };


    WMLaravelLazyLoad.prototype.remove = function (item) {

        var idx = this.data.indexOf(item);

        if (idx >= 0) {
            return this.data.splice(idx, 1);
        }
    };

    WMLaravelLazyLoad.prototype.untilCompleted = function () {

        var that = this;
        
        that.next().then(function () {
            that.untilCompleted();
        })
    };

    WMLaravelLazyLoad.prototype.next = function () {

        var that, params;

        that = this;
        params = that.params;
        params.page = that.info.next_page || 1;

        if (that.busy || that.completed) return;

        that.busy = true;

        return $http({
            url: that.url,
            params: params,
        }).then(function (response) {

            that.data = that.data.concat(response.data.data);

            delete response.data.data;

            angular.extend(that.info, response.data);

            that.completed = (that.info.last_page == that.info.current_page);

            that.busy = false;

            if (! that.completed) {
                that.info.next_page = params.page + 1;
            }

            return response;
        });
    };

    return WMLaravelLazyLoad;
}]);