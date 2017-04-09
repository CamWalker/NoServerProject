angular.module('facebookApp').controller('postsCtrl', function ($scope, facebookService) {

  $scope.getPosts = facebookService.value

  $scope.test = 'test'

})
