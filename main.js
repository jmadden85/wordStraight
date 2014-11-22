'use strict';
(function() {
  var canv = document.querySelector('canvas');
  var w = canv.width;
  var h = canv.height;
  var ctx = canv.getContext('2d');
  var img = new Image();
  var imgData;
  var step = 0;
  var buttons = document.querySelectorAll('button');

  for (var i = 0, b = buttons.length; i < b; i++) {
    buttons[i].addEventListener('click', function (e) {
      if (this.innerHTML === 'ONE') {
        img.src = "test.jpg"
      } else {
        img.src = "test2.jpg"
      }
      document.querySelector('#buttons').setAttribute('class', 'hide');
      ctx.drawImage(img, 0, 0);
      init();
    });
  }

  // var imgReady = function () {
  //   ctx.drawImage(img, 0, 0);
  //   init();
  // };

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
        init();
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
      var x = -1;
      var info = {};
      this.inkedUp = [];
      this.resetBordersAndCorners();
      for (var i = 0, n = data.length; i < n; i += 4) {
        red = data[i];
        green = data[i + 1];
        blue = data[i + 2];
        //Increment X
        x++;
        //Check if we reached the end of a row
        if (!(i % rgbaCount)) {
          y++;
          x = -1;
        }
        //Check for ink on this pixel
        if (red < 130 && green < 130 && blue < 130) {
          this.generateBorders([x, y]);
          this.inkedUp.push([x, y]);
        }
      }
      if (step === 1) {
        this.generateCorners(this.borders);
      }
      info.ink = this.inkedUp;
      info.borders = this.borders;
      return info;
    },
    generateBorders: function (data) {
      var borders = this.borders;
      var x = data[0];
      var y = data[1];
      if (borders.top === null || y < borders.top[1]) {
        borders.top = [x ,y];
      }
      if (borders.right === null || x > borders.right[0]) {
        borders.right = [x ,y];
      }
      if (borders.bot === null || y > borders.bot[1]) {
        borders.bot = [x ,y];
      }
      if (borders.left === null || x < borders.left[0]) {
        borders.left = [x ,y];
      }
    },
    generateCorners: function (data) {
      var angleDirection = data.top[0] > data.left[0] ? 'away' : 'towards';
      if (angleDirection === 'away') {
        this.corners.topLeft = data.top;
      } else {
        this.corners.topLeft = data.left;
      }
      console.log(this.corners, this.borders);
    },
    resetBordersAndCorners: function () {
      for (var key in this.borders) {
        this.borders[key] = null;
      }
      for (var key in this.corners) {
        this.corners[key] = null;
      }
    },
    borders: {
      top: null,
      right: null,
      bot: null,
      left: null
    },
    corners: {
      topLeft: null,
      topRight: null,
      botLeft: null,
      botRight: null
    },
    inkedUp: [],
  };

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
      canv.height = data.bot[1] - data.top[1];
      this.clear();
      ctx.drawImage(trimmedImg, 0, -(data.top[1]));
    },
    correctAngle: function (data) {
      ctx.beginPath();
      // ctx.moveTo();
    }
  };

  var findText = function (data) {

  };

}());