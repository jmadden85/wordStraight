'use strict';
(function() {
  var canv = document.querySelector('canvas');
  var w = canv.width;
  var h = canv.height;
  var ctx = canv.getContext('2d');
  var img = new Image();
  var imgData;
  var step = 0;
  img.src = 'test.jpg';

  img.addEventListener('load', function() {
    //draw the test image
    ctx.drawImage(img, 0, 0);
    init();
  });

  var init = function () {
    imgData = ctx.getImageData(0, 0, w, h);
    var info = imgInfo.giantLoop(imgData.data);
    cleanUp(info);
  };

  var cleanUp = function (info) {
    switch (step) {
      case 0:
        fix.trimHeight(info.borders);
        step++;
        break;
      case 1:
        break;
      case 2:
        break;
      default:
        break;
    }
  };

  var imgInfo = {
    giantLoop: function (data) {
      var red, green, blue;
      var rgbaCount = w * 4;
      var y = 0;
      var x = 0;
      var info = {};
      for (var i = 0, n = data.length; i < n; i += 4) {
        red = data[i];
        green = data[i + 1];
        blue = data[i + 2];
        //Increment X
        x++;
        //Check if we reached the end of a row
        if (!(i % rgbaCount)) {
          y++;
          x = 0;
        }
        //Check for ink on this pixel
        if (red < 130 && green < 130 && blue < 130) {
          this.generateBorders([x, y]);
          this.inkedUp.push([x, y]);
        }
      }
      info.ink = this.inkedUp;
      info.borders = this.borders;
      // console.log(this.inkedUp, this.borders);
      return info;
    },
    generateBorders: function (data) {
      var borders = this.borders;
      var x = data[0];
      var y = data[1];
      if (borders.top === null || y < borders.top) {
        borders.top = y;
      }
      if (borders.right === null || x > borders.right) {
        borders.right = x;
      }
      if (borders.bot === null || y > borders.bot) {
        borders.bot = y;
      }
      if (borders.left === null || x < borders.left) {
        borders.left = x;
      }
    },
    borders: {
      top: null,
      right: null,
      bot: null,
      left: null
    },
    inkedUp: [],
  }

  var fix = {
    clear: function () {
      ctx.clearRect(0, 0, w, h);
      w = canv.width;
      h = canv.height;
    },
    trimHeight: function (data) {
      // ctx.rect(0, data.top, w, data.bot - data.top);
      // ctx.stroke();
      var trimmedImg = new Image();
      trimmedImg.src = canv.toDataURL();
      canv.height = data.bot - data.top;
      this.clear();
      ctx.drawImage(trimmedImg, 0, -(data.top));
    },
  };

  var findText = function (data) {

  };

}());