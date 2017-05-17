angular.module('facebookApp').controller('navCtrl', function ($scope, $rootScope, facebookService) {

  $scope.FBlogin = function () {
    FB.login(function(response) {
      if (response.status === 'connected') {

        facebookService.FBlogin().then(function (response) {
          $scope.data1 = response;
          $scope.firstName = response.first_name
          $scope.lastName = response.last_name
          $scope.pic = response.picture.data.url
          $scope.locale = response.location.name
        });


        facebookService.getPosts().then(function (response) {
          $rootScope.postData = response
        });

      }
    }, {scope: 'public_profile, user_posts, user_location'})
  }
  $scope.dropDownClass = false;
  $scope.dropDown = function () {
    console.log('click');
    $scope.dropDownClass = !$scope.dropDownClass;
  }
  $scope.closeDropDown = function () {
    console.log('click2');
    $scope.dropDownClass = false;
  }



  $scope.FBlogOut = function() {
    document.location.reload();
  }
})
