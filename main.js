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
  var waitTime = 100;

  for (var i = 0, b = buttons.length; i < b; i++) {
    buttons[i].addEventListener('click', function (e) {
      if (this.className === 'imgLoad') {
        if (this.innerHTML === 'ONE') {
          img.src = "test.jpg"
        } else if (this.innerHTML === 'TWO') {
          img.src = "test2.jpg"
          w = 1300;
          h = 675;
          canv.width = w;
          canv.height = h;
        } else {
          img.src = "squareTest2.jpg"
          w = 8;
          h = 8;
          canv.width = w;
          canv.height = h;
        }
        document.querySelector('#buttons').setAttribute('class', 'hide');
      } else {
        var degrees = document.getElementById('degrees').value;
        var radians = Math.PI / 180 * parseInt(degrees, 10);
        var rotateImg = new Image();
        rotateImg.src = canv.toDataURL();
        ctx.clearRect(0, 0, w, h);
        ctx.save();
        ctx.translate(w / 2, h / 2);
        ctx.rotate(radians);
        ctx.drawImage(rotateImg, -rotateImg.width / 2, -rotateImg.height / 2);
        ctx.restore();
      }
    });
  }

  canv.addEventListener('mousemove', function (e) {
    var pos = [e.pageX - this.offsetLeft, e.pageY - this.offsetTop];
    var coordsContainer = document.querySelector('#xy');
    var colorContainer = document.querySelector('#color');
    var color = ctx.getImageData(pos[0], pos[1], 1, 1).data;
    var red = color[0];
    var green = color[1];
    var blue = color[2];
    var alpha = color[3];
    colorContainer.innerHTML = 'RED:' + red + ', GREEN:' + green + ', BLUE:' + blue + ', OPACITY:' + alpha;
    coordsContainer.innerHTML = pos[0] + ', ' + pos[1];

  });


  img.onload = function () {
    ctx.drawImage(img, 0, 0);
    wait(waitTime, init);
    // init();
  };

  var init = function () {
    imgData = ctx.getImageData(0, 0, w, h);
    var info = imgInfo.giantLoop(imgData.data);
    console.log(imgData);
    cleanUp(info);
  };

  var wait = function(time, cb) {
    setTimeout(function() {
      cb();
    }, time);
  };

  var cleanUp = function (info) {
    switch (step) {
      case 0:
        // fix.trimHeight(info.borders);
        step++;
        wait(waitTime, init);
        // init();
        break;
      case 1:
        // fix.correctAngle({
        //   borders: info.borders,
        //   corners: info.corners
        // });
        step++;
        wait(waitTime, init);
        // init();
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
      this.inkedUp = [];
      this.resetBordersAndCorners();
      for (var i = 0, n = data.length; i <= n; i += 4) {
        red = data[i];
        green = data[i + 1];
        blue = data[i + 2];
        //Check for ink on this pixel
        console.log(x, y, i, [red, green, blue]);
        if (red < 130 && green < 130 && blue < 130) {
          this.generateBorders([x, y]);
          this.inkedUp.push([x, y]);
        }
        //Increment x
        x++;
        //Check if we reached the end of a row
        if (!(i % rgbaCount) && i && i !== w * 4 || !y && !((i + 4) % rgbaCount)) {
          y++;
          x = 0;
        }
      }
      if (step === 1) {
        this.generateCorners(this.borders);
      }
      info.ink = this.inkedUp;
      info.borders = this.borders;
      info.corners = this.corners;
      return info;
    },
    generateBorders: function (data) {
      var borders = this.borders;
      var x = data[0];
      var y = data[1];
      if (borders.top === null || y < borders.top[1] && x < borders.top[0]) {
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
      var angleDirection = data.top[0] > data.bot[0] ? 'towards' : 'away';
      if (angleDirection === 'away') {
        this.tiltDirection = 'away';
        this.corners.topLeft = data.top;
        this.corners.botLeft = data.left;
        this.corners.botRight = data.bot;
        this.corners.topRight = data.right;
      } else {
        this.tiltDirection = 'towards';
        this.corners.topRight = data.top;
        this.corners.topLeft = data.left;
        this.corners.botRight = data.right;
        this.corners.botLeft = data.bot;
      }
    },
    resetBordersAndCorners: function () {
      for (var border in this.borders) {
        this.borders[border] = null;
      }
      for (var corner in this.corners) {
        // this.corners[corner] = null;
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
    tiltDirection: null,
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
    //Fix the y coordinate so it starts at 0 instead of ending at it
    invertCorners: function (data) {
      var newCorners = data;
      for (var corner in newCorners) {
        if (newCorners[corner]) {
          newCorners[corner][1] = h - newCorners[corner][1];
        }
      }
      return newCorners;
    },
    //figure out the angle of the line from top left corner to bottom left corner and fix it so it's parallel
    //to the left
    correctAngle: function (data) {
      var corners = data.corners;
      if (waitTime) {
        // ctx.beginPath();
        // ctx.moveTo(corners.botLeft[0], corners.botLeft[1]);
        // ctx.lineTo(corners.topLeft[0], corners.topLeft[1]);
        // ctx.closePath();
        // ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(corners.botRight[0], corners.botRight[1]);
        ctx.lineTo(corners.topRight[0], corners.topRight[1]);
        ctx.closePath();
        ctx.strokeStyle = "red";
        ctx.stroke();
      }
      var that = this;
      setTimeout(function () {
        //invert corners so the Y coordinate starts at 0 instead of ending at it
        var invertedCorners = that.invertCorners(corners);
        //Get the difference between the top left coords and bottom left coords
        var dX = invertedCorners.topLeft[0] - invertedCorners.botLeft[0];
        var dY = invertedCorners.topLeft[1] - invertedCorners.botLeft[1];
        //Get the angle of the line in radians
        var theta = Math.atan2(dY, dX);
        //Convert to degrees
        var degrees = theta * 180 / Math.PI;
        //Get the difference of the current angle from 90 degrees
        var rotation = (degrees - 90) * Math.PI / 180;
        var rotateImg = new Image();
        rotateImg.src = canv.toDataURL();
        h = h * 2;
        canv.height = h;
        ctx.clearRect(0, 0, w, h);
        ctx.save();
        ctx.translate(w / 2, h / 2);
        //Rotate the image the difference to get it to 90 degrees
        ctx.rotate(rotation);
        ctx.drawImage(rotateImg, -rotateImg.width / 2, - rotateImg.height / 4);
        ctx.restore();
      }, waitTime);
    }
  };

  var findText = function (data) {

  };

}());