angular.module('facebookApp', ['ui.router', 'ngSanitize'])
  .config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when('','/');

    $stateProvider
      .state('overall', {
        url: '/',
        templateUrl: '././views/overall.html',
        // controller: 'overallCtrl'
      })
      .state('status', {
        url: '/status',
        templateUrl: '././views/status.html',
        // controller: 'postsCtrl'
      })
      .state('links', {
        url: '/links',
        templateUrl: '././views/links.html',
        // controller: 'photosCtrl'
      })
      .state('photos', {
        url: '/photos',
        templateUrl: '././views/photos.html',
        // controller: 'photosCtrl'
      })
      .state('videos', {
        url: '/videos',
        templateUrl: '././views/videos.html',
        // controller: 'videosCtrl'
      })
  })
  .directive('hoverDirective', function() {

    return {
      restrict: 'A',
      link: function(scope, element, attribute) {
        element.on('mouseover', function() {
          element.css('background-color', '#374F65')
        })
        element.on('mouseleave', function() {
          element.css('background-color', '#1D2A35')
        })
      }
    }
  })

window.fbAsyncInit = function() {
  FB.init({
    appId      : '1278845302191211',
    status      : true,
    xfbml      : true,
    version    : 'v2.8'
  });
  FB.AppEvents.logPageView();

  FB.getLoginStatus(function (response) {
    if (response.status === 'connected') {
      // document.getElementById('status').innerHTML = "connected"
    } else if (response.status == 'not authorized') {
      // var sadf = document.getElementById('status').innerHTML = "not authorized"
    } else {
      // document.getElementById('status').innerHTML = "not logged in"
    }
  })
};

(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "//connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));
