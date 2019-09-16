!(function ($) {
  var isDrawing = false;
  var userList = [];
  var renderPointer = 0;
  var isRepeat = false;
  var repeatId = 0;
  var tableLen = table.length;
  var repeatSum = 0;
  var isAjaxing = false;
  var isFast = true;
  var isFastSwitch = false;
  var repeatBeginTime = 0;

  // 如果有WX3DWallSetting.RepeatFillTime为了兼容老代码，以WX3DWallSetting.BeginTime这个值为准
  var repeatFillTime, isEnabledRepeatFill;
  var refreshRepeatFillTime = function (newTime) {
    repeatBeginTime = newTime;
    repeatFillTime = newTime - new Date().getTime();
  };
  if (WX3DWallSetting.RepeatFillTime) {
    repeatFillTime = WX3DWallSetting.RepeatFillTime * 60 * 1000;
  }
  if (WX3DWallSetting.IsRepeatFill) {
    isEnabledRepeatFill = true;
  }
  if (WX3DWallSetting.BeginTime) {
    //repeatBeginTime = new Date(WX3DWallSetting.BeginTime).getTime();
    //var time = new Date(WX3DWallSetting.BeginTime).getTime();
    //repeatFillTime = repeatBeginTime - new Date().getTime();
    refreshRepeatFillTime(new Date(WX3DWallSetting.BeginTime).getTime());
  }

  //if (!repeatFillTime) {
  //  repeatFillTime = -9999;
  //}
  //isRepeat = WX3DWallSetting.IsRepeatFill;

  var TDWall = {
    getJoins: function () {
      //if (isAjaxing) {
      //  return;
      //}
      //isAjaxing = true;

      //WallJoinProvider.GetJoins(function (json) {
      //  //isAjaxing = false;
      //  if (json.Joins && json.Joins.length > 0) {
      //    TDWall.paint3d(json.Joins);
      //    //console.log("ajax %o", json.Joins);
      //  } else {
      //    //setTimeout(function () {
      //    //  //isAjaxing = true;
      //    //  TDWall.getJoins();
      //    //}, 2000);
      //  }
      //}, true);
      //var testI = 1;
      //var testJoins = userList;
      //console.log(1)
      var callBack_standardwall = function (json, isTimeout) {
        if (json.WX3DWallSetting_IsRepeatFill && json.WX3DWallSetting_BeginTime) {
          var newTime = json.WX3DWallSetting_BeginTime.replace(/\/Date\(/, "").replace(/\)\//, "");
          if (newTime !== repeatBeginTime) {
            isEnabledRepeatFill = true;
            refreshRepeatFillTime(new Date(newTime).getTime());
            //repeatBeginTime = newTime;

          }
        }

        if (json.data && json.data.length) {

          TDWall.paint3d(json.data);
          isFastSwitch = true;
        } else {
          if (isFastSwitch && isFast) {
            //TDWall.paint3d(json.Joins);
            isFast = false;
          }
          //if (testI >= 4) {
          //  json.Joins = [
          //    {
          //      JoinId: 1001 + testI * 4,
          //      EventUserJoinImage: "http://file.31huiyi.com/Uploads/Files/2016/01/28/635895721460391942.png"
          //    },
          //    {
          //      JoinId: 1002 + testI * 4,
          //      EventUserJoinImage: "http://file.31huiyi.com/Uploads/Files/2016/01/28/635895721546857263.png"
          //    },
          //    {
          //      JoinId: 1003 + testI * 4,
          //      EventUserJoinImage: "http://file.31huiyi.com/Uploads/Files/2016/01/28/635895721147549057.png"
          //    },
          //    {
          //      JoinId: 1004 + testI * 4,
          //      EventUserJoinImage: "http://file.31huiyi.com/Uploads/Files/2016/01/28/635895721254046499.png"
          //    }
          //  ];
          //  TDWall.paint3d(json.Joins);
          //}
          //testI++;
        }
      }
      window.WallJoinProvider.GetJoins(callBack_standardwall, undefined, isFast);
    },
    paint3d: function (joins) {
      //过滤内容，仅保留有效内容
      var arr = [];
      //var arrIds = [];
      $.each(joins, function (i, e) {
        var tmp = {};
        //tmp = e;
        tmp.JoinId = e.JoinId;
        tmp.EventUserJoinImage = e.EventUserJoinImage.replace("/640x640/crop_true/", "/320x320/crop_true/");
        if (e.EventId === 285808367 && /wallCheckin\/default\.png/.test(e.EventUserJoinImage)) {// && e.EventUserJoinImage === "http://file.31huiyi.com/640x640/crop_true/Uploads/Files/2016/02/05/635902899374083044.jpg") {
        } else {
          arr.push(tmp);
        }
        //arrIds.push(e.JoinId);
      });

      //arrIds = [12204841, 10566013, 10263207, 10259109, 10259083, 10259056, 16544639, 16544668, 16544668, 16544738, 16785856];
      //var repeatJoinIds = $.map(arrIds, function (_e) {
      //  var ret = $.grep(arrIds, function (_f) {
      //    return _f === _e;
      //  });
      //  var val = _e;
      //  if (ret.length > 1) {
      //    val = 0;
      //  }
      //  return val;
      //});

      //userList = userList.concat(joins);
      userList = userList.concat(arr);
      userList = $.grep(userList, function (e, i) {
        var tmp = $.grep(userList, function (f, j) {
          if (i <= j) {
            return false;
          } else {
            return f.JoinId === e.JoinId;
          }
        });
        return tmp.length === 0;
      });
      if (!isDrawing) {
        isDrawing = true;
        this.paint3dCore();
      }
    },
    paint3dCore: function () {
      var _this = this;
      var showOne = function (obj, isFast) {
        if ($('.element').not('.settled').length === 0) {
          $('.element').removeClass('settled');
        }

        var $E;

        if (isFast) {
          $E = $('.element').not('.settled').not('.repeated').eq(0);
          if (!$E.length) {
            return;
          }
        } else {
          $E = $('.element').not('.settled').eq(0);
        }

        var img = document.createElement('img');
        img.style.width = '100%';
        img.style.height = '100%';
        img.src = obj.EventUserJoinImage;
        $E.html(img);
        if (isFast) {
          $E.addClass('repeated');
        } else {
          $E.addClass('settled');
        }


        $('.signimg').remove();
        if (!isFast) {
          var $I = $('<img class="signimg" src="' + obj.EventUserJoinImage + '">');
          $('body').append($I);

          setTimeout(function () {
            $I.addClass('img-animate');
          }, 10);
        }

        repeatSum++;
      }
      var paintTimeOri = 3000;
      //paintTimeOri = 300;
      var paintTime = paintTimeOri;

      var doing = function () {
        if (isEnabledRepeatFill) {
          if (repeatFillTime > 0) {
            repeatFillTime -= 3000;
          } else {
            isRepeat = true;
          }
        }
        //if (repeatFillTime > 0) {
        //  repeatFillTime -= 3000;
        //} else {
        //  if (repeatFillTime != -9999) {
        //    isRepeat = true;
        //  }
        //}

        if (renderPointer < userList.length) {
          var obj = userList[renderPointer];
          showOne(obj);
          ++renderPointer;
        } else {
          if (isRepeat) {
            if (repeatSum < tableLen) {
              paintTime = 100;
              repeatId = ++repeatId % userList.length;

              //console.log("%o %o %o", repeatId, userList.length, userList);
              var obj2 = userList[repeatId];
              showOne(obj2, true);
            } else {
              paintTime = paintTimeOri;
            }
          } else {

          }
        }

        if (paintTime) {
          setTimeout(function () {
            doing();
          }, paintTime);
        } else {
          doing();
        }
      }

      setTimeout(function () {
        //console.log("%o %o", renderPointer, userList.length);
        doing();
      }, paintTime);

      window.screenrepeat = function () {
        isRepeat = true;

        while (repeatSum < tableLen) {
          doing()
        }
      }
    }
  };

  $(function () {
    var $body = $('body');
    $body.removeClass('for-android');
    if (WX3DWallSetting.BGType == 0) {
      $body.css('background-color', WX3DWallSetting.BgColor);
    } else if (WX3DWallSetting.BGType == 10) {
      $body.css({
        backgroundImage: 'url(' + fileDomain + WX3DWallSetting.BgImage + ')',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%'
      });
    }
    TDWall.getJoins();
  });
})(jQuery);
