(function() {
  var canv = document.querySelector('canvas');
  var ctx = canv.getContext('2d');
  var img = new Image();
  img.src = 'test.jpg';

  img.addEventListener('load', function() {
    //draw the test image
    ctx.drawImage(img, 0, 0);
  });

}());