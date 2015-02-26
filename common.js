(function(w) {

  function initialize() {
    var $image = $('.js-changeImage');
    $image.on({
      'mouseenter': function() {
        var $target = $(this).find('img');
        $target.attr('src', $target.attr('src').replace('_off', '_on'));
      },
      'mouseleave': function() {
        var $target = $(this).find('img');
        $target.attr('src', $target.attr('src').replace('_on', '_off'));
      });
  }

  // ブラウザの幅取得
  function getBrowserWidth() {
    if ( window.innerWidth ) {
      return window.innerWidth;
    }
    else if ( document.documentElement && document.documentElement.clientWidth != 0 ) {
      return document.documentElement.clientWidth;
    }
    else if ( document.body ) {
      return document.body.clientWidth;
    }
    return 0;
  }

  // ブラウザの高さ取得
  function getBrowserHeight() {
    if ( window.innerHeight ) {
      return window.innerHeight;
    }
    else if ( document.documentElement && document.documentElement.clientHeight != 0 ) {
      return document.documentElement.clientHeight;
    }
    else if ( document.body ) {
      return document.body.clientHeight;
    }
    return 0;
  }

  $(window).load(function() {
    initialize();
  });

})(window);
