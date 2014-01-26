angular.module("ngRailsForm").factory("RailsResource", ["$resource", function ($resource) {
    return function (url, origParams, userProvidedActions) {
        // extracting options from params
        var params = angular.copy(origParams);
        var requestRoot = params.requestRoot;
        delete(params.requestRoot);

        // example of conversion:
        // from: {name: "Joe", email: "joe@example.com"}
        // to: {user: {name: "Joe", email: "joe@example.com"}}
        var addRootFn = function(data){
            var result;
            if (angular.isObject(data)) {
                if (requestRoot) {
                    result = {};
                    result[requestRoot] = data;
                } else {
                    result = data;
                }
                result = angular.toJson(result);
            } else {
                result = data;
            }
            return result;
        };

        var defaults = {
            update: {method: "put", isArray: false}, //, transformRequest: addRootFn },
            create: {method: "post", transformRequest: addRootFn }
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

