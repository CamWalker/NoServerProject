angular.module('facebookApp').service('facebookService', function ($q, $sce) {

  this.FBlogin = FBlogin;
  this.getPosts = getPosts;
  // this.getPhotos = getPhotos;
  // this.getVideos = getVideos;

  function mode(array) {
    var ties = [];
    if(array.length == 0)
        return [];
    var modeMap = {};
    var maxEl = array[0], maxCount = 1;
    for(var i = 0; i < array.length; i++) {
      var el = array[i];
      if(modeMap[el] == null) {
          modeMap[el] = 1;
      } else {
          modeMap[el]++;
      }
      if(modeMap[el] > maxCount) {
          maxEl = el;
          maxCount = modeMap[el];
          ties = [el]
      } else if (modeMap[el] === maxCount) {
        ties.push(el)
      }
    }
    return ties;
  }
    function flatten(input) {
      var output = [];
      function callAgain(input) {
        for (key in input) {
          if (typeof input[key] === "object") {
            callAgain(input[key])
          } else {
            output.push(input[key])
          }
        }
      }
      callAgain(input);
      return output

    }


  //PROFILE OVERVIEW

  function FBlogin() {
    var deferred = $q.defer()
    FB.api('me?fields=first_name,last_name,location,picture.width(170).height(170)', 'GET', function (response) {
      deferred.resolve(response);
    });
    return deferred.promise;
  }


  //POST ANALYSIS
  var posts;
  function getPosts () {
    var deferred = $q.defer()
    FB.api('me/posts?fields=reactions.limit(1000)%7Bpic%2Cname%7D%2Cmessage%2Ccreated_time%2Cpicture%2Cstory%2Ccomments.limit(100)%2Csource%2Ctype&limit=100', 'GET', function (response) {
      response = response.data;
      var status = response.filter(v => v.type === 'status');
      var links = response.filter(v => v.type === 'link');
      var photos = response.filter(v => v.type === 'photo');
      var videos = response.filter(v => v.type === 'video');
      console.log(videos);


      function calculate(response) {
        var likes = response.map( (v) => v.reactions).map((v,i) => {
          if(v) {
            return v['data'].length
          } else {
            return 0;
          }
        });
        var highestLikes = likes.reduce( (h,v) => v > h ? h = v : h)
        var lowestLikes = likes.reduce( (h,v) => v < h ? h = v : h)
        var averageLikes = likes.reduce((t,v) => t + v)/likes.length


        var likesPeople = flatten(response.map( (v) => v.reactions).map(v => v ? v.data : ""))
        var biggestFan = mode(likesPeople);
        biggestFan = biggestFan.filter((v, i) => i % 3 !== 2)

        var highestLikesMessage = response[likes.indexOf(highestLikes)].message
        if(!highestLikesMessage) {
          highestLikesMessage = response[likes.indexOf(highestLikes)].story
        }
        var highestLikesDate = response[likes.indexOf(highestLikes)].created_time.substring(0,10)
        var highestLikesPic = response[likes.indexOf(highestLikes)].picture
        var highestLikesVideo = $sce.trustAsResourceUrl(response[likes.indexOf(highestLikes)].source)
        var lowestLikesMessage = response[likes.indexOf(lowestLikes)].message
        if(!highestLikesMessage) {
          highestLikesMessage = response[likes.indexOf(lowestLikes)].story
        }
        var lowestLikesDate = response[likes.indexOf(lowestLikes)].created_time.substring(0,10)
        var lowestLikesPic = response[likes.indexOf(lowestLikes)].picture
        var lowestLikesVideo = $sce.trustAsResourceUrl(response[likes.indexOf(lowestLikes)].source)


        var comments = response.map( (v) => (v.comments)? v.comments : 0).map(v => v.data ? v.data.length : 0)
        var highestComments = comments.reduce( (h,v) => {
          console.log(h, v);
          return v > h ? h = v : h
        })
        var highestCommentsMessage = response[comments.indexOf(highestComments)].message
        if(!highestLikesMessage) {
          highestLikesMessage = response[comments.indexOf(highestComments)].story
        }

        var highestCommentsDate = response[comments.indexOf(highestComments)].created_time.substring(0,10)
        var highestCommentsPic = response[comments.indexOf(highestComments)].picture
        var highestCommentsVideo = $sce.trustAsResourceUrl(response[comments.indexOf(highestComments)].source)

        return {
          highestLikes: highestLikes,
          highestLikesMessage: highestLikesMessage,
          highestLikesDate: highestLikesDate,
          highestLikesPic: highestLikesPic,
          highestLikesVideo: highestLikesVideo,
          lowestLikes: lowestLikes,
          lowestLikesMessage: lowestLikesMessage,
          lowestLikesDate: lowestLikesDate,
          lowestLikesPic: lowestLikesPic,
          lowestLikesVideo: lowestLikesVideo,
          averageLikes: averageLikes,
          highestComments: highestComments,
          highestCommentsMessage: highestCommentsMessage,
          highestCommentsDate: highestCommentsDate,
          highestCommentsPic: highestCommentsPic,
          highestCommentsVideo: highestCommentsVideo,
          biggestFan: biggestFan
        }
      }
      response = calculate(response)
      status = calculate(status)
      links = calculate(links)
      photos = calculate(photos)
      videos = calculate(videos)
      var overall = {
        overall: response,
        status: status,
        links: links,
        photos: photos,
        videos: videos
      }
      deferred.resolve(overall);
    });
    return deferred.promise;
  }

}) //End of module
