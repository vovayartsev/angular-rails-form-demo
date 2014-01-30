angular.module("ngRailsForm").factory("RailsResource", ["$resource", '$http', function ($resource, $http) {
    return function (url, origParams, userProvidedActions) {
        // extracting options from params
        var params = angular.copy(origParams);
        var requestRoot = params.requestRoot;
        delete(params.requestRoot);

        // $http.default.transformRequest contains an array of hooks by default
        var hooksArray = angular.copy($http.defaults.transformRequest);

        if (requestRoot) {
            // adding a transformer fn which wraps data with a new root. Example:
            // from: {name: "Joe", email: "joe@example.com"}
            // to: {user: {name: "Joe", email: "joe@example.com"}}
            hooksArray.unshift(function addRootFn(data) {
                if (angular.isObject(data)) {
                    var result = {};
                    result[requestRoot] = data;
                    return result;
                } else {
                    return  data;
                }
            });
        }

        var defaults = {
            update: {method: "put", isArray: false, transformRequest: hooksArray },
            create: {method: "post", transformRequest: hooksArray }
        };

        var actions = angular.extend(defaults, userProvidedActions);

        var resource = $resource(url, params, actions);

        resource.prototype.$save = function () {
            var fn = (this.id) ? this.$update : this.$create;
            return fn.apply(this, arguments);
        };

        return resource;
    }
}]);

