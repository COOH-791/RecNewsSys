var imageCodeId = ""

$(function () {

    // 打开登录框
    $('.login_btn').click(function () {
        $('.login_form_con').show();
    })

    // 点击关闭按钮关闭登录框或者注册框
    $('.shutoff').click(function () {
        $(this).closest('form').hide();
    })

    // 隐藏错误
    $(".login_form #mobile").focus(function () {
        $("#login-mobile-err").hide();
    });
    $(".login_form #password").focus(function () {
        $("#login-password-err").hide();
    });

    $(".register_form #mobile").focus(function () {
        $("#register-mobile-err").hide();
    });
    $(".register_form #imagecode").focus(function () {
        $("#register-image-code-err").hide();
    });
    $(".register_form #smscode").focus(function () {
        $("#register-sms-code-err").hide();
    });
    $(".register_form #password").focus(function () {
        $("#register-password-err").hide();
    });


    // 点击输入框，提示文字上移
    $('.form_group').on('click focusin', function () {
        $(this).children('.input_tip').animate({
            'top': -5,
            'font-size': 12
        }, 'fast').siblings('input').focus().parent().addClass('hotline');
    })

    // 输入框失去焦点，如果输入框为空，则提示文字下移
    $('.form_group input').on('blur focusout', function () {
        $(this).parent().removeClass('hotline');
        var val = $(this).val();
        if (val == '') {
            $(this).siblings('.input_tip').animate({'top': 22, 'font-size': 14}, 'fast');
        }
    })


    // 打开注册框
    $('.register_btn').click(function () {
        $('.register_form_con').show();
        generateImageCode()
    });


    // 登录框和注册框切换
    $('.to_register').click(function () {
        $('.login_form_con').hide();
        $('.register_form_con').show();
        generateImageCode()
    })

    // 登录框和注册框切换
    $('.to_login').click(function () {
        $('.login_form_con').show();
        $('.register_form_con').hide();
    })

    // 根据地址栏的hash值来显示用户中心对应的菜单
    var sHash = window.location.hash;
    if (sHash != '') {
        var sId = sHash.substring(1);
        var oNow = $('.' + sId);
        var iNowIndex = oNow.index();
        $('.option_list li').eq(iNowIndex).addClass('active').siblings().removeClass('active');
        oNow.show().siblings().hide();
    }

    // 用户中心菜单切换
    var $li = $('.option_list li');
    var $frame = $('#main_frame');

    $li.click(function () {
        if ($(this).index() == 5) {
            $('#main_frame').css({'height': 900});
        } else {
            $('#main_frame').css({'height': 660});
        }
        $(this).addClass('active').siblings().removeClass('active');
        $(this).find('a')[0].click()
    })

    // 登录表单提交
    $(".login_form_con").submit(function (e) {
        e.preventDefault()
        var mobile = $(".login_form #mobile").val();
        var password = $(".login_form #password").val();

        if (!mobile) {
            $("#login-mobile-err").show();
            return;
        }

        if (!password) {
            $("#login-password-err").show();
            return;
        }

        var params = {
            "mobile": mobile,
            "password": password,
        }

        $.ajax({
            url: "/login",
            method: "post",
            data: JSON.stringify(params),
            contentType: "application/json",
            success: function (resp) {
                if (resp.errno == "0") {
                    // 刷新当前界面
                    location.reload();
                } else {
                    $("#login-password-err").html(resp.errmsg);
                    $("#login-password-err").show()
                }
            }
        })
    })


    // 注册按钮点击
    $(".register_form_con").submit(function (e) {
        // 阻止默认提交操作
        e.preventDefault();

        // 取到用户输入的内容
        var mobile = $("#register_mobile").val();  // 提取手机号
        var imageCode = $("#imagecode").val();  // 提取图片验证码
        var sms_code = $("#smscode").val();  // 提取手机验证码
        var password = $("#register_password").val();  // 提取密码

        if (!mobile) {
            $("#register-mobile-err").show();
            return;
        }
        if (!imageCode) {
            $("#image-code-err").html("请填写验证码！");
            $("#image-code-err").show();
            return;
        }
        if (!sms_code) {
            $("#register-sms-code-err").show();
            return;
        }
        if (!password) {
            $("#register-password-err").html("请填写密码!");
            $("#register-password-err").show();
            return;
        }

        if (password.length < 6) {
            $("#register-password-err").html("密码长度不能少于6位");
            $("#register-password-err").show();
            return;
        }

        // 发起注册请求
        var params = {
            "mobile": mobile,
            "sms_code": sms_code,
            "password": password,
            // "image_code": imageCode,
            // "image_code_id": imageCodeId,
        };

        $.ajax({
            url: "/register",
            type: "post",
            // data: params,
            data: JSON.stringify(params),
            contentType: "application/json",
            success: function (resp) {
                if (resp.errno == "0") {
                    // 刷新当前界面
                    location.reload()
                } else {
                    $("#register-password-err").html(resp.errmsg);
                    $("#register-password-err").show();
                }
            }
        })

    });

    // 点击退出按钮
    $('#logout').click(function () {
        // 请求`退出登录`
        $.ajax({
            url: '/logout',
            type: 'post',
            success: function (resp) {
                if (resp.errno == 0) {
                    // `退出登录`成功
                    location.reload();
                }
            }
        })
    })
})


// 生成一个图片验证码的编号，并设置页面中图片验证码img标签的src属性
function generateImageCode() {
    // 1. 生成一个编号
    // 严格一点的使用uuid保证编号唯一， 不是很严谨的情况下，也可以使用时间戳
    imageCodeId = generateUUID();

    // 2. 拼接验证码地址
    var imageCodeUrl = "/image_code?code_id=" + imageCodeId;
    // 3. 设置页面中图片验证码img标签的src属性
    $(".get_pic_code").attr("src", imageCodeUrl)
}

// 发送短信验证码
function sendSMSCode() {
    // 校验参数，保证输入框有数据填写
    $(".get_code").removeAttr("onclick");
    var mobile = $("#register_mobile").val();
    if (!mobile) {
        $("#register-mobile-err").html("请填写正确的手机号！");
        $("#register-mobile-err").show();
        $(".get_code").attr("onclick", "sendSMSCode();");
        return;
    }
    var imageCode = $("#imagecode").val();
    if (!imageCode) {
        $("#image-code-err").html("请填写验证码！");
        $("#image-code-err").show();
        $(".get_code").attr("onclick", "sendSMSCode();");
        return;
    }

    // 发送短信验证码
    var params = {
        "mobile": mobile,
        "image_code": imageCode,
        "image_code_id": imageCodeId
    };

    $.ajax({
        // 请求地址
        url: "/smscode",
        // 请求方式
        method: "POST",
        // 请求内容
        data: JSON.stringify(params),
        // 请求内容的数据类型
        contentType: "application/json",
        // 响应数据的格式
        dataType: "json",
        success: function (resp) {
            if (resp.errno == "0") {
                // 倒计时60秒，60秒后允许用户再次点击发送短信验证码的按钮
                var num = 60;
                // 设置一个计时器
                var t = setInterval(function () {
                    if (num == 1) {
                        // 如果计时器到最后, 清除计时器对象
                        clearInterval(t);
                        // 将点击获取验证码的按钮展示的文本回复成原始文本
                        $(".get_code").html("获取验证码");
                        // 将点击按钮的onclick事件函数恢复回去
                        $(".get_code").attr("onclick", "sendSMSCode();");
                    } else {
                        num -= 1;
                        // 展示倒计时信息
                        $(".get_code").html(num + "秒");
                    }
                }, 1000)
            } else {
                // 表示后端出现了错误，可以将错误信息展示到前端页面中
                $("#register-sms-code-err").html(resp.errmsg);
                $("#register-sms-code-err").show();
                // 将点击按钮的onclick事件函数恢复回去
                $(".get_code").attr("onclick", "sendSMSCode();");
                // 如果错误码是4004，代表验证码错误，重新生成验证码
                if (resp.errno == "4004") {
                    generateImageCode()
                }
            }
        }
    })
}

// 调用该函数模拟点击左侧按钮
function fnChangeMenu(n) {
    var $li = $('.option_list li');
    if (n >= 0) {
        $li.eq(n).addClass('active').siblings().removeClass('active');
        // 执行 a 标签的点击事件
        $li.eq(n).find('a')[0].click()
    }
}

// 一般页面的iframe的高度是660
// 新闻发布页面iframe的高度是900
function fnSetIframeHeight(num) {
    var $frame = $('#main_frame');
    $frame.css({'height': num});
}

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

function generateUUID() {
    var d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
        d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

function logout() {
    $.ajax({
        url: "/logout",
        type: "post",
        contentType: "application/json",
        headers: {
            "X-CSRFToken": getCookie("csrf_token")
        },
        success: function (resp) {
            // 刷新当前界面
            location.reload()
        }
    })
}

// 登录表单提交
$(".login_form_con").submit(function (e) {
    e.preventDefault()
    var mobile = $(".login_form #mobile").val()
    var password = $(".login_form #password").val()

    if (!mobile) {
        $("#login-mobile-err").show();
        return;
    }

    if (!password) {
        $("#login-password-err").show();
        return;
    }

    var params = {
        "mobile": mobile,
        "password": password,
    }

    $.ajax({
        url: "/passport/login",
        method: "post",
        data: JSON.stringify(params),
        contentType: "application/json",
        success: function (resp) {
            if (resp.errno == "0") {
                // 刷新当前界面
                location.reload();
            } else {
                $("#login-password-err").html(resp.errmsg);
                $("#login-password-err").show()
            }
        }
    })
});

$(function() {
           // 返回顶部
    if ($('#back-to-top').length) {
        var scrollTrigger = 100; // px

        // $(window).scrollTop()与 $(document).scrollTop()产生结果一样
        // 一般使用document注册事件，window使用情况如 scroll, scrollTop, resize
        $(window).on('scroll', function() {
            if ($(window).scrollTop() > scrollTrigger) {
                $('#back-to-top').addClass('show');
            } else {
                $('#back-to-top').removeClass('show');
            }
        });

        $('#back-to-top').on('click', function() {
            // html,body 都写是为了兼容浏览器
            $('html,body').animate({
                scrollTop: 0
            }, 600);
            return false; //在大多数情况下，为事件处理函数返回false，可以防止默认的事件行为。例如默认情况下点击一个<a>元素，页面会跳转到钙元素href属性指定的页。
        });
    }
});