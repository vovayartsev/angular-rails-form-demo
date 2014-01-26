// Submits the resource with AJAX and highlights fields with errors if any
//
// Usage:
//    <form   name='userForm'
//            rails-form-for="user"
//            on-success="someAction()"  >
//

angular.module('ngRailsForm').directive('railsFormFor', ['$log', function ($log) {
    "use strict";
    return {
        require: '^?form',
        restrict: 'A',

        link: function ($scope, el, attrs, ctrl) {
            function clearServerErrors() {
                // taking only those controls which are invalid b/o "server" validation
                angular.forEach(ctrl.$error['server'] || [], function (control) {
                    control.$setValidity('server', true);
                });
                ctrl.$errors = {};
            }

            var cleanupParsers = {};
            // always returns the same function for the same control
            function cleanupParserFor(control) {
                var parser = cleanupParsers[control.$name];
                if (!parser) {
                    parser = function (value) {
                        control.$setValidity('server', true);
                        return value;
                    };
                    cleanupParsers[control.$name] = parser;
                }
                return parser;
            }

            function onSuccess(response) {
                clearServerErrors();
                if (attrs.onSuccess) {
                    $scope.$eval(attrs.onSuccess, {
                        response: response
                    });
                }
            }

            function onError(response) {
                // in Rails 4, there's no "errors" root element in JSON response for CREATE action anymore
                var errors = (angular.isObject(response.data.errors)) ? response.data.errors : response.data;
                angular.forEach(errors, function (errors, field) {
                    var modelCtrl = ctrl[field];
                    if (modelCtrl) {
                        modelCtrl.$setValidity('server', false);
                        // this parser will cleanup the validity flag just set
                        var parser = cleanupParserFor(modelCtrl);
                        if (modelCtrl.$parsers.indexOf(parser) === -1) {
                            modelCtrl.$parsers.push(parser);
                        }
                    } else {
                        $log.error("Can't set validity of '" + field + "' - no such field in the form");
                    }
                });
                // storing server-side errors - just for the user's needs (e.g. to explain why a field is invalid)
                ctrl.$errors = errors;
            }

            el.on('submit', function () {
                $scope.$apply(function () {
                    // remember the syntax: <form rails-form-for="user".....>
                    $scope[attrs.railsFormFor].$save().then(onSuccess, onError);
                });
            });

        }
    }
}]); // return {...}]
