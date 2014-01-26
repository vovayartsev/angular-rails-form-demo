// Submits the resource with AJAX and highlights fields with errors if any
//
// Usage:
//    <form   name='someForm'
//            rails-form-for="bank"
//            on-success="someAction()"  >
//

angular.module('ngRailsForm').directive('railsFormFor', [
  '$log', '$timeout', function($log, $timeout) {
    return {
      require: '^?form',
      restrict: 'A',

      link: function($scope, el, attrs, ctrl) {
        var onError, onSuccess;

        onSuccess = function(response) {
          if (attrs.onSuccess) {
            $scope.$eval(attrs.onSuccess, {
              response: response
            });
          }
        };

        onError = function(response) {
          return angular.forEach(response.data.errors, function(errors, field) {
            if (ctrl[field]) {
              ctrl[field].$setValidity('server', false);
            } else {
              $log.error("Can't set validity of '" + field + "' - no such field in the form");
            }
          });
        };

        el.on('submit', function() {
          $scope.$apply(function() {
            $scope[attrs.railsFormFor].$save().then(onSuccess, onError);
          });
        });

        el.on('focus change', 'input, textarea', function() {
          $timeout(function() {
            angular.forEach(ctrl.$error['server'] || [], function(control) {
              control.$setValidity('server', true);
            });
          });
        });

        $scope.$on('$destroy', function() {
          el.off('change', 'input');
        });
      }
    };
  }
]);
