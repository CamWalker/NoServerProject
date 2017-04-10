angular.module('facebookApp').service('facebookService', function ($q, $sce) {

  this.FBlogin = FBlogin;
  this.getPosts = getPosts;
  // this.getPhotos = getPhotos;
  // this.getVideos = getVideos;

  // function mode(array) {
  //   var ties = [];
  //   if(array.length == 0)
  //       return [];
  //   var modeMap = {};
  //   var maxEl = array[0], maxCount = 1;
  //   for(var i = 0; i < array.length; i++) {
  //     var el = array[i];
  //     if(modeMap[el] == null) {
  //         modeMap[el] = 1;
  //     } else {
  //         modeMap[el]++;
  //     }
  //     if(modeMap[el] > maxCount) {
  //         maxEl = el;
  //         maxCount = modeMap[el];
  //         ties = [el]
  //     } else if (modeMap[el] === maxCount) {
  //       ties.push(el)
  //     }
  //   }
  //   return ties;
  // }

  function mode(array) {
    if(array.length == 0)
        return [];
    var modeMap = {};
    var firstEl = array[0], secondEl = array[0], thirdEl = array[0], firstCount = 1, secondCount = 1, thirdCount = 1;
    array = array.sort()
    uniqueArray = array.filter((v, i, arr) => i === arr.indexOf(v));
    for(var i = 0; i < uniqueArray.length; i++) {
      var quant = array.filter(v => v === uniqueArray[i]).length
      if (quant >= firstCount) {
        thirdCount = secondCount
        thirdEl = secondEl
        secondEl = firstEl
        secondCount = firstCount
        firstCount = quant
        firstEl = uniqueArray[i]
      } else if (quant >= secondCount) {
        thirdCount = secondCount
        thirdEl = secondEl
        secondEl = uniqueArray[i]
        secondCount = quant
      } else if (quant >= thirdCount) {
        thirdEl = uniqueArray[i]
        thirdCount = quant
      }

    }
    return [firstEl, secondEl, thirdEl];
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
        var biggestFan = likesPeople.filter((v, i, arr) => v.indexOf(" ") > -1);
        biggestFan = mode(biggestFan)
        biggestFan.push(likesPeople[likesPeople.indexOf(biggestFan[0]) - 1])
        biggestFan.push(likesPeople[likesPeople.indexOf(biggestFan[1]) - 1])
        biggestFan.push(likesPeople[likesPeople.indexOf(biggestFan[2]) - 1])

        var highestLikesMessage = response[likes.indexOf(highestLikes)].message
        if(!highestLikesMessage) {
          highestLikesMessage = response[likes.indexOf(highestLikes)].story
        }
        var highestLikesDate = response[likes.indexOf(highestLikes)].created_time
        if (highestLikesDate) {
          highestLikesDate = highestLikesDate.substring(0,10)
        }
        var highestLikesPic = response[likes.indexOf(highestLikes)].picture
        var highestLikesVideo = $sce.trustAsResourceUrl(response[likes.indexOf(highestLikes)].source)
        var lowestLikesMessage = response[likes.indexOf(lowestLikes)].message
        if(!highestLikesMessage) {
          highestLikesMessage = response[likes.indexOf(lowestLikes)].story
        }
        var lowestLikesDate = response[likes.indexOf(lowestLikes)].created_time
        if (lowestLikesDate) {
          lowestLikesDate = lowestLikesDate.substring(0,10)
        }
        var lowestLikesPic = response[likes.indexOf(lowestLikes)].picture
        var lowestLikesVideo = $sce.trustAsResourceUrl(response[likes.indexOf(lowestLikes)].source)


        var comments = response.map( (v) => (v.comments)? v.comments : 0).map(v => v.data ? v.data.length : 0)
        var highestComments = comments.reduce( (h,v) => {
          return v > h ? h = v : h
        })
        var highestCommentsMessage = response[comments.indexOf(highestComments)].message
        if(!highestLikesMessage) {
          highestLikesMessage = response[comments.indexOf(highestComments)].story
        }

        var highestCommentsDate = response[comments.indexOf(highestComments)].created_time
        if (highestCommentsDate) {
          highestCommentsDate = highestCommentsDate.substring(0,10)
        }
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
