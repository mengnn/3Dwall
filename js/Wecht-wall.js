// 标准微信签到墙，不应用core.js的，请不要删除此部分兼容性！
// Added by Larry in 2015-12-03 10:27:47
window.util = window.util || (function () {
  function PrivateAjaxPostData(type /* post /get */, url, data, callback, asyncFlag, btn/*可空*/, successAgain) {
    if (btn) {
      //var btnText = "";
      //var $btn = $(btn);
      //if ($btn.is('.disabled,.btn-loading')) {
      //  //if ($btn.is('.btn-loading')) {
      //  //  util.alertError("表单正在提交中，请稍候");
      //  //}
      //  //if ($btn.data("action") === "send_goto") {
      //  //  util.alertError("已经提交成功，页面正在跳转中，请稍候")
      //  //}
      //  return false;
      //}
      //btnText = $btn.html();
      //if (btnText !== "请稍候...") {
      //  $btn.data("btnText", btnText);
      //}
      //btnText && $btn.html('请稍候...').addClass('disabled btn-loading');

      var ret = util.submitDisabled($(btn));
      if (ret === false) {
        return false;
      }
      $('.alert_warning_my').removeClass('alert_warning_my');
    }

    var code = 0;
    return $.ajax({
      type: type,
      url: url,
      data: data,
      async: asyncFlag,
      success: function (json, status, req) {
        var success = json.code == 0;
        var action = json.action;
        var msg = json.msg;
        var data = json.data;
        $('.loading').hide();
        code = +json.code;
        if (btn) {
          $(btn).data("action", action);
        }

        switch (action) {
          case "eval":
            eval(msg);
            break;
          case "alertok":
            if (msg)
              util.alertOK(msg);
            break;
          case "alerterror"://单独错误信息弹出
            {
              if (msg)
                util.alertError(msg);
              if (btn) {
                $(btn).removeClass("disabled");
              }
              break;
            }
          //框需要用户点击后消失
          case "notdisppearalert":
            {
              if (msg)
                util.alertError(msg, { timeout: 0 });
              break;
            }
          case "send_goto":
            if (msg)
              util.alertOK(msg);
            if (btn && successAgain !== true) {
              $(btn).addClass("disabled");
            }
            setTimeout(function () { location.href = data.url; }, 2000);
            return;
          case "reloadError":
            if (msg)
              util.alertError(msg);
            setTimeout(function () {
              location.reload(true);
            }, 2000);
            break;
          case "reload":
            if (msg)
              util.alertOK(msg);
            setTimeout(function () {
              location.reload(true);
            }, 2000);
            break;
          case "goto":
            if (data) {
              location.href = data;
            }
            break;
          case "json":
            //alert(json.data);
            if (callback) {
              callback(json.data);
            }
            return;
          case "alerterrors":
            var s = '';
            for (var o in data) {
              s += data[o];
            }
            util.alertError(s);
            break;
        }

        //回调函数
        if (callback) {
          try {
            callback(json);
          } catch (ex) {

          }
        }
      }
    }).always(function () {
      if (btn) {
        var $btn = $(btn);
        $btn.removeClass('btn-loading');
        if ($btn.length && $btn.data("post") == 1 && code == 0) {

        } else {
          var btnText = $btn.data("btnText");
          var action = $btn.data("action");
          if (action === "send_goto") {
            //$btn.html(btnText);
          } else {
            btnText && $btn.html(btnText).removeClass('disabled');
          }
        }
      }
    });
  }

  //共有的方法
  return {
    submitDisabled: function ($btn) {
      var btnText = "";
      if ($btn.is('.disabled,.btn-loading')) {
        return false;
      }

      btnText = $btn.html();
      if (btnText !== "请稍候...") {
        $btn.data("btnText", btnText);
      }

      var lan = $("html").attr("lang");

      btnText && $btn.html(lan == "en" ? 'Please wait' : '请稍候...').addClass('disabled btn-loading');
    },
    //异步post form提交
    AjaxPost: function (url, $form, $btn, callback) {
      if (!util.ValidateForm($form)) {
        return false;
      }

      return PrivateAjaxPostData("post", url, $form.serialize(), callback, true, $btn);
    },
    //异步post数据
    AjaxPostData: function (url, data, callback, btn/*可空*/) {
      return PrivateAjaxPostData('post', url, data, callback, true, btn);
    },
    //同步post数据
    AjaxPostData_Synchronous: function (url, data, callback, btn/*可空*/) {
      return PrivateAjaxPostData('post', url, data, callback, false, btn);
    },
    AjaxGet: function (url, data, callback, btn/*可空*/) {
      return PrivateAjaxPostData('get', url, data, callback, false, btn);
    },
    ShowLoadding: function () {
      var div = document.getElementById('divLoadding');
      if (div) {
      } else {
        var body = document.getElementsByTagName('body').item(0);
        div = document.createElement('div');
        div.id = "divLoadding";
        div.innerHTML = "正在执行，请稍候……";
        body.appendChild(div);
      }
      isMoveLoadding = true;
      moveLoadding();
    },
    alertOK: function (msg) {
      notyfy({
        text: msg,
        type: 'success',
        dismissQueue: true,
        layout: 'top',
        timeout: 1000,
        buttons: false
      });
    },
    alert: function (msg) {
      var modal = {
        show: function ($child, toShow) {
          var $modal;
          toShow = (typeof (toShow) == "undefined") ? true : !!toShow;
          $modal = $child.closest(".modal");
          $modal.modal(toShow ? "show" : "hide");
        },
        init: function (modalId, option) {
          var id, strDom, $modal, data;
          if (modalId) {
            id = "modal-" + (modalId || "");
            $modal = $("#" + id);
          } else {
            id = "";
            $modal = $();
          }
          if (!$modal.length) {
            option = $.extend({}, {
              modalTitle: "提示",
              modalBody: ""
            }, option);
            var strModalBody = typeof option.modalBody === "string" ? option.modalBody : "";
            var objModalBody = typeof option.modalBody === "object" ? option.modalBody : null;
            data = {
              id: id,
              title: option.modalTitle,
              body: strModalBody
            }
            strDom = modal.dom(data);
            $modal = $(strDom).appendTo("body");
            objModalBody && objModalBody.appendTo($modal.find(".modal-body"));
          } else {
            var strModalBody = typeof option.modalBody === "string" ? option.modalBody : "";
            var objModalBody = typeof option.modalBody === "object" ? option.modalBody : null;
            strModalBody && $modal.find(".modal-body").html(strModalBody);
            objModalBody && objModalBody.appendTo($modal.find(".modal-body"));
          }
          return $modal;
        },
        dom: function (data) {
          var strDom;
          strDom = '<div id="' + data.id + '" class="modal fade" style="">\
            <div class="modal-dialog modal-dialog-style-2">\
              <div class="modal-content">\
                <div class="modal-header">\
                  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>\
                  <div class="modal-title">' + data.title + '</div>\
                </div>\
                <div class="modal-body center">\
                ' + data.body + '\
                </div>\
                <div class="modal-footer">\
                  <span class="btn btn-style-2" data-dismiss="modal">确定</span>\
                ' + '' + '\
                </div>\
              </div>\
            </div>\
          </div>';
          return strDom;
        }
      }
      modal.show(modal.init("modalAlert", {
        modalBody: msg
      }));

    },
    alertError: function (msg, opts) {
      opts = $.extend({}, {
        text: msg,
        type: 'error',
        dismissQueue: true,
        layout: 'top',
        timeout: 3000,
        buttons: false
      }, opts);
      var $notyfyEle = $(".notyfy_container li");
      var notyfyLen = $notyfyEle.length;
      var notyfFlag = true;
      if (notyfyLen <= 0) {
        notyfy(opts);
      }
      else {
        $notyfyEle.each(function () {
          var notyfyText = $(this).text();
          if (notyfyText == opts.text) {
            notyfFlag = false;
          }
        });
        if (notyfFlag) {
          notyfy(opts);
        }
      }
    },
    confirm: function (msg, callbackOk, callbackCancel) {
      var template = '<div class="modal fade">\
        <div class="modal-dialog modal-sm modal-style-confirm">\
        <div class="modal-content">\
          <div class="modal-header">\
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\
            <h3 class="modal-title"></h3>\
          </div>\
          <div class="modal-body center">\
          <p>One fine body&hellip;</p>\
          </div>\
          <div class="modal-footer">\
          <button type="button" class="btn btn-default btn-cancel" data-dismiss="modal">取消</button>\
          <button type="button" class="btn btn-primary btn-ok">确定</button>\
          </div>\
        </div>\
        </div>\
      </div>';
      var modal = $(template);
      modal = modal.appendTo("body");
      modal.find(".modal-body p").text(msg);
      modal.modal("show");

      modal.on("click", ".btn-ok", function () {
        callbackOk && callbackOk();
        modal.modal("hide");
      }).on("click", ".btn-cancel", function () {
        callbackCancel && callbackCancel();
        modal.modal("hide");
      });

      modal.on('hidden.bs.modal', function (e) {
        modal.remove();
      });

    },
    customValidate: function (args) {
      var args = $.extend({}, {
        form: '',
        btn: '',
        validCallback: function () { },
        invalidCallback: function () { }
      }, args);

      var form = $(args.form),
        btn = $(args.btn);

      var opts = $.extend({}, {
        debug: true,
        errorPlacement: function (error, element) {
          var errorBox = element.parent().prev('dt').find('.to-form-error');
          errorBox.append(error);
        }
      }, {});

      var validator = form.validate(opts);

      form.find('.to-control').on('blur', function () {
        validator.element($(form.find('.to-control[name=' + $(this).attr('name') + ']')));
        window.scroll.refresh();
      });

      btn.on('click', function () {
        if (form.valid()) {
          args.validCallback();
          window.scroll.refresh();
        } else {
          args.invalidCallback();
          window.scroll.refresh();
        }
      });
    },
    resetFormTip: function (args) {
      var form = $(args.form);
      if (form)
        form.find('.to-form-error').find('.has-error').html('');
    },
    remoteHtml: function (remote, selector, data, callback, isget) {

      if (remote) {
        if (isget) {
          $.ajax({
            type: "get",
            url: remote,
            cache: false,
            data: {},
            success: function (data) {
              //$(selector).html(data);
              $(selector).get(0).innerHTML = data;

              window.setupControls();
              if (callback)
                callback();

              window.iScrollRefresh();

              //window.pluploadpicker_manage && window.pluploadpicker_manage.init();
              //window.validdate_manage && window.validdate_manage.init();//鍒濆§嬪寲楠岃瘉
              //window.select_manage && window.select_manage.init();//鍒濆§嬪寲select
              //window.timepicker_manage && window.timepicker_manage.init();//鍒濆§嬪寲鏃堕棿
              //window.checkradio_manage && window.checkradio_manage.init();

            }
          });
        } else {

          $(selector).load(remote, data, function () {
            //window.pluploadpicker_manage && window.pluploadpicker_manage.init();
            //window.validdate_manage && window.validdate_manage.init();//初始化验证
            //window.select_manage && window.select_manage.init();//初始化select
            //window.timepicker_manage && window.timepicker_manage.init();//初始化时间
            //window.checkradio_manage && window.checkradio_manage.init();
            window.setupControls();
            if (callback)
              callback();
            window.iScrollRefresh();

          });

        }
      }

    },
    isRepeatPost: function () {

      var date = (new Date()).getTime();

      if (!window.lastPostDate) {
        window.lastPostDate = date;
        return false;
      } else {
        if (date - window.lastPostDate <= 1000) {
          this.alertError('禁止重复提交');
          return true;
        }
        else {
          window.lastPostDate = date;
          return false;
        }
      }

    },
    loadingQueue: function (args) {
      var opts = $.extend({}, {
        delaySecond: 10,
        f: function () { }
      }, args);

      var dlg = $('<div class="to-dlg dlg-count-down">\
              <div class="to-dlg-inner">\
                <div class="count-label-wrapper">\
                  <img src= ' + newstaticDomain + '"/img/eventMobile/h5loding.gif"/>\
                  <div class="count-down-label"></div>\
                </div>\
                <hgroup>\
                  <h2>正在排队中！</h2>\
                  <h3>当前抢票下单人数较多<br/>请您稍安勿躁<br/>在倒计时提交后重新提交。</h3>\
                </group>\
                <a href="javascript:void(0)" class="to-btn btn-exit-lineup">退出排队</a>\
              </div>\
            </div>');

      if ($('.dlg-count-down').length == 0)
        $('#wrapper').append(dlg);

      var label = $('.dlg-count-down .count-down-label');

      var count = opts.delaySecond;
      label.text(count);

      var dlg = $('.dlg-count-down');

      dlg.css({
        'height': $('.to-container').height(),
        'minHeight': $(window).height(),
        'width': $(window).width(),
        "zIndex": 9999999,
        'position': 'fixed'
      });

      $('.to-footer').hide();
      dlg.show();

      var timer = setInterval(function () {
        count--;
        if (count == 0) {
          dlg.hide();
          $('.to-footer').show();
          opts.f();
          clearInterval(timer);
          return;
        }
        label.text(count);
      }, 1000);

      // 绑定退出排队
      $('.btn-exit-lineup').on('click', function () {
        clearInterval(timer);
        dlg.hide();
        $('.to-footer').show();
      });
    }
  }
})();

var WallJoinProvider = (function () {

  var LastScanLogMongoDBID = ""; //最后一个mongodb的 _id 。不知道传递null
  var WXSignPageSize = $('#WXSignPageSize').val();//一页多少条
  var EventId = $('#EventId').val();//会议 ID -- wallId 时候--eventId=0
  var WXSignId = $('#WXSignId').val();//微信签到 Id
  var tempPrevWall = $('#prevwall').val(); //是否是预览 1表示预览； 0表示真实数据
  //@*执行一次后延迟多少毫秒再次执行*@
  var WXSignLasyMilliseconds = $('#WXSignLasyMilliseconds').val();
  var preview = $("#IsPreview").val();
  var getajax;

  var isTimeout = true;

  var ajaxTime = 0;

  var ajaxAlways = function (callback, flag) {
    if (!flag) {
      if (isTimeout) {
        setTimeout(function () {
          WallJoinProvider.GetJoins(callback, flag);
        }, parseFloat(WXSignLasyMilliseconds));
      } else {
        WallJoinProvider.GetJoins(callback, flag);
      }
    }
  }

  var ajaxstart = function (callback, flag, isFast) {
    if (isFast) {
      isTimeout = false;
    }
    getajax = ajax(callback, flag);
    getajax.always(function () {
      if (ajaxTime === 0) {
        ajaxAlways(callback, flag);
      } else {
        setTimeout(function () {
          ajaxAlways(callback, flag);
        }, ajaxTime);
      }
    });
  }

  var imageUpdateTime = 1;
  var avatarSourceType;
  var formateData = function (oridata) {
    var jsondata = oridata
    var data = jsondata.data
    if (data.length) {
      for (var i = 0; i < data.length; i++) {
        var img = data[i].EventUserJoinImage
        if (/http:\/\/31img.ufile.ucloud.com.cn/.exec(img)) {
          data[i].EventUserJoinImage = data[i].EventUserJoinImage+"?iopcmd=thumbnail&type=8&width=360&height=480&scale=2"
        } else if (/http:\/\/file.31huiyi.com\/Uploads\/Files/.exec(img)){
          data[i].EventUserJoinImage = data[i].EventUserJoinImage+"?iopcmd=thumbnail&type=8&width=360&height=480&scale=2"
        } else if (/http:\/\/file.31huiyi.com\/\/Uploads\/Files/.exec(img)){
          data[i].EventUserJoinImage = data[i].EventUserJoinImage+"?iopcmd=thumbnail&type=8&width=360&height=480&scale=2"
        }
      }
    }
    return jsondata
  }
  var ajax = function (callback, flag) {
    // var url0 = logoWallDomain + "/" + WXSignId + "/screen/refresh?timestamp=" + LastScanLogMongoDBID + "&enc=" + window.enc + "&IsPreview=" + preview;
    var url0 = logoWallDomain + "/" + WXSignId + "/screen/refresh?timestamp=" + LastScanLogMongoDBID + "&enc=" + window.enc + "&IsPreview=" + preview + "&updatetime=" + imageUpdateTime;
    return util.AjaxPostData(url0, {}, function (data) {
      //if (data.Code === 0) {
      if (LastScanLogMongoDBID === data.LastScanLogMongoDBID) {
        ajaxTime = 5000;
      } else {
        ajaxTime = 0;
      }
      LastScanLogMongoDBID = data.LastScanLogMongoDBID;

      if (typeof avatarSourceType === "undefined") {
        avatarSourceType = data.HeadSourceType;
      } else if (avatarSourceType !== data.HeadSourceType) {
        window.location.reload();
      }

      if (LastScanLogMongoDBID !== "000000000000000000000000" && !isTimeout) {
        if (data.data && data.data.length) {
          if (data.UpdateTime) {
            imageUpdateTime = data.UpdateTime
          }

        } else {
          isTimeout = true;
        }
      }
      if (LastScanLogMongoDBID !== "000000000000000000000000") {

        if (data.UpdateTime) {
          imageUpdateTime = data.UpdateTime
        }

      }

      if (callback) {
        data = formateData(data)
        // for (var i = 0; i < data.data.length; i++){
        //  console && console.log(data.data[i].EventUserJoinImage)
        // }
        callback(data, isTimeout);
      }
      //}
    });
  }

  return {
    GetJoins: function (callback, flag, isFast) {
      ajaxstart(callback, flag, isFast);
    },
    SetTimeout: function (_isTimeout) {
      isTimeout = _isTimeout;
    }
  }
})();
