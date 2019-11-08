var posts = [];
var test = '';

var loadPosts = function () {
  $.getJSON("/api/posts.json")
    .done(function (data) {
      posts = data;
      appendPosts();
    });
}

var appendPosts = function () {
  for (var index = 0; index < 4; index++) {
    var postGrid = '<div class="grid grid__post-box">' +
      '<div class="post-box post-box__image" style="background: url(/assets/images/posts/thumbs/001.jpg) center center; background-size: cover;"></div>' +
      '<div class="post-box post-box__content">' +
      '<h2>' + posts[index]['post_title'] + '</h2>' +
      '<p class="post-box post-box__caption">' +
      '<picture>' +
      '<source srcset="/assets/images/icons/calendar.webp" type="image/webp">' +
      '<img src="/assets/images/icons/calendar.png" alt="Calendar">' +
      '</picture >' +
      'Published in ' +
      posts[index]['post_date'] +
      '</p>' +
      '<div class="post-box post-box__excerpt">' +
      '<p>' + $(posts[index]['post_excerpt']) + '</p>' +
      '</div>' +
      '<hr>' +
      '<a href="' + posts[index]['post_url'] + '" class="post-box post-box__read-more">Read more</a>' +
      '</div>' +
      '</div>';
    $('.post-list-container').append(postGrid);
  }
}


$('.post-list-container').ready(function () {
  loadPosts();
});
