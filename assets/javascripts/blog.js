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
  var loadMoreButton = '<svg class="post-list post-list__load-more-button" width="140px" height="54px" viewBox="0 0 140 54" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n';
  loadMoreButton += '<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n';
  loadMoreButton += '<g id="blog-list" transform="translate(-359.000000, -1871.000000)">\n';
  loadMoreButton += '<g id="blog" transform="translate(-41.000000, 366.000000)">\n';
  loadMoreButton += '<g id="button" transform="translate(400.000000, 1505.000000)">\n';
  loadMoreButton += '<g id="Group-3">\n';
  loadMoreButton += '<rect id="Rectangle" fill="#A7A7A7" opacity="0.4" x="2.88659794" y="2.88659794" width="137.113402" height="50.5154639"></rect>\n';
  loadMoreButton += '<rect id="Rectangle-Copy-2" fill="#FF8088" x="0" y="0" width="137.113402" height="50.5154639"></rect>\n';
  loadMoreButton += '</g>\n';
  loadMoreButton += '<text id="Load-More" font-family="Playfair Display" font-size="17" font-weight="normal" fill="#FFFFFF">\n';
  loadMoreButton += '<tspan x="26.102" y="32">Load More</tspan>\n';
  loadMoreButton += '</text>\n';
  loadMoreButton += '</g>\n';
  loadMoreButton += '</g>\n';
  loadMoreButton += '</g>\n';
  loadMoreButton += '</g>\n';
  loadMoreButton += '</svg>';

  if (posts.length < 4) {
    populatePosts(0, posts.length - 1);
  } else {
    populatePosts(0, 4);
    $('.post-list-container').parent().append(loadMoreButton);
  }
}

var appendMorePosts = function () {
  var postsLength = $('.grid__post-box').length;

  if ((posts.length - postsLength) < 4) {
    populatePosts(postsLength, postsLength + (posts.length - postsLength));
  } else {
    populatePosts(postsLength, postsLength + 4);
  }

  if ((posts.length - $('.grid__post-box').length) < 1) {
    $('.post-list__load-more-button').remove()
  }
}

var populatePosts = function (startIndex, endIndex) {
  for (var index = startIndex; index < endIndex; index++) {
    var postGrid = '<div class="grid grid__post-box">' +
      '<div class="post-box post-box__image" style="background: url(' + posts[index]['post_thumb'] + ') center center; background-size: cover;"></div>' +
      '<div class="post-box post-box__content">' +
      '<a href="' + posts[index]['post_path'] + '" class="post-box post-box__title-link"><h2>' + posts[index]['post_title'] + '</h2></a>' +
      '<p class="post-box post-box__caption">' +
      '<picture>' +
      '<source srcset="/assets/images/icons/calendar.webp" type="image/webp">' +
      '<img src="/assets/images/icons/calendar.png" alt="Calendar">' +
      '</picture >' +
      'Published in ' +
      posts[index]['post_date'] +
      '</p>' +
      '<div class="post-box post-box__excerpt">' +
      '<p>' + posts[index]['post_description'] + '</p>' +
      '</div>' +
      '<hr>' +
      '<a href="' + posts[index]['post_path'] + '" class="post-box post-box__read-more">Read more</a>' +
      '</div>' +
      '</div>';

    $('.post-list-container').append(postGrid);
  }
}

$('.post-list-container').ready(function () {
  loadPosts();
});

$('body').on('click', '.post-list__load-more-button', function () {
  appendMorePosts();
});
