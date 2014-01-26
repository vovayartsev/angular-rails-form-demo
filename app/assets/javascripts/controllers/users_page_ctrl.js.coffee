usersPageCtrlFn = ($scope, RailsResource) ->
    User = RailsResource('/users/:id.json', {id: "@id", requestRoot: "user"})
    $scope.users = User.query()

    initUserInForm = ->
        $scope.userInForm = new User(name: "New User")


    $scope.onTableRowClicked = (user) ->
        $scope.selectedUser = user
        $scope.userInForm = angular.copy(user)

    $scope.onFormSubmittedSuccessfully = ->
        if $scope.selectedUser
            angular.copy($scope.userInForm, $scope.selectedUser)
        else
            $scope.users.unshift $scope.userInForm
        initUserInForm()

    # initial form state
    initUserInForm()


usersPageCtrlFn.$inject = ['$scope', 'RailsResource']
angular.module("ngRailsFormDemoApp").controller 'UsersPageCtrl', usersPageCtrlFn
