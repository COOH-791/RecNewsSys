function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}


$(function(){

    // 打开登录框
    $('.comment_form_logout').click(function () {
        $('.login_form_con').show();
    });

    // 收藏
    $(".collection").click(function () {
        // 获取收藏的`新闻id`
        var news_id = $(this).attr("data-news-id");
        var action = "do";

        // 组织参数
        var params = {
            "news_id": news_id,
            "action": action
        };

        // TODO 请求收藏新闻
        $.ajax({
            url: "/news/collect",
            type: "post",
            data: JSON.stringify(params),
            contentType: "application/json",
            headers: {
                "X-CSRFToken": getCookie("csrf_token")
            },
            success: function (resp) {
                if (resp.errno == "0") {
                    // `收藏`成功
                    // 隐藏`收藏`按钮
                    $(".collection").hide();
                    // 显示`已收藏`按钮
                    $(".collected").show();
                    location.reload();
                }
                else if (resp.errno == "5002") {
                    // 用户登录
                    $(".login_form_con").show();
                }
                else {
                    // `收藏`失败
                    alert(resp.errmsg);
                }
            }
        })


    });

    // 取消收藏
    $(".collected").click(function () {
        // 获取收藏的`新闻id`
        var news_id = $(this).attr("data-news-id");
        var action = "undo";

        // 组织参数
        var params = {
            "news_id": news_id,
            "action": action
        };

        // TODO 请求取消收藏新闻
        $.ajax({
            url: "/news/collect",
            type: "post",
            data: JSON.stringify(params),
            contentType: "application/json",
            headers: {
                "X-CSRFToken": getCookie("csrf_token")
            },
            success: function (resp) {
                if (resp.errno == "0") {
                    // `取消收藏`成功
                    // 显示`收藏`按钮
                    $(".collection").show();
                    // 隐藏`已收藏`按钮
                    $(".collected").hide();
                    location.reload();
                }
                else if (resp.errno == "4101") {
                    // 用户登录
                    $(".login_form_con").show();
                }
                else {
                    // `收藏`失败
                    alert(resp.errmsg);
                }
            }
        })

    });

    // 更新评论条数
    function updateCommentCount() {
        var length = $(".comment_list").length;
        $(".comment_count").html(length + "条评论");
        $(".comment").html(length);
    }

    // 评论提交
    $(".comment_form").submit(function (e) {
        // // 阻止表单默认提交行为
        e.preventDefault();

        // 获取参数
        var news_id = $(this).attr("data-news-id");
        var comment = $(".comment_input").val();

        // 组织参数
        var params = {
            "news_id": news_id,
            "content": comment
        };

        // TODO 请求对新闻`进行评论`
        $.ajax({
            url: "/comment",
            type: "post",
            data: JSON.stringify(params),
            contentType: "application/json",
            headers: {
                "X-CSRFToken": getCookie("csrf_token")
            },
            success: function (resp) {
                if (resp.errno == '0') {
                    // `评论`成功
                    alert('评论成功');
                    location.reload();
                //     var comment = resp.comment;
                //     // 拼接内容
                //     var comment_html = '';
                //     comment_html += '<div class="comment_list">';
                //     comment_html += '<div class="person_pic fl">';
                //     if (comment.user.avatar_url) {
                //       comment_html += '<img src="' + comment.user.avatar_url + '" alt="用户图标">';
                //     }else {
                //       comment_html += '<img src="/static/news/images/person01.png" alt="用户图标">';
                //     }
                //     comment_html += '</div>';
                //     comment_html += '<div class="user_name fl">' + comment.user.nick_name + '</div>';
                //     comment_html += '<div class="comment_text fl">';
                //     comment_html += comment.content;
                //     comment_html += '</div>';
                //     comment_html += '<div class="comment_time fl">' + comment.create_time + '</div>';
                //     comment_html += '<a href="javascript:;" class="comment_up fr" data-comment-id="' + comment.id + '" data-news-id="' + comment.news_id + '">赞</a>';
                //     comment_html += '<a href="javascript:;" class="comment_reply fr">回复</a>';
                //     comment_html += '<form class="reply_form fl" data-comment-id="' + comment.id + '" data-news-id="' + news_id + '">';
                //     comment_html += '<textarea class="reply_input"></textarea>';
                //     comment_html += '<input type="button" value="回复" class="reply_sub fr">';
                //     comment_html += '<input type="reset" name="" value="取消" class="reply_cancel fr">';
                //     comment_html += '</form>';
                //     comment_html += '</div>';
                //     // 拼接到内容的前面
                //     $(".comment_list_con").prepend(comment_html);
                //     // 让comment_sub 失去焦点
                //     $('.comment_sub').blur();
                //     // 清空新闻评论输入框内容
                //     $(".comment_input").val("");
                //
                //     // 更新页面的新闻评论数量
                //     updateCommentCount();
                //     window.location.reload();
                }
                else {
                    // `评论`失败
                    alert(resp.errmsg);
                }
            }
        })
    });

    $('.comment_list_con').delegate('a,input','click',function(){

        var sHandler = $(this).prop('class');

        if(sHandler.indexOf('comment_reply')>=0)
        {
            $(this).next().toggle();
        }

        if(sHandler.indexOf('reply_cancel')>=0)
        {
            $(this).parent().toggle();
        }

        if(sHandler.indexOf('comment_up')>=0)
        {
            var $this = $(this);
            // 默认点击时代表`点赞`
            var action = 'do';

            if(sHandler.indexOf('has_comment_up')>=0)
            {
                // 如果当前该评论已经是点赞状态，再次点击会进行到此代码块内，代表要取消点赞
                $this.removeClass('has_comment_up');
                // 如果已经点赞，设置为`取消点赞`
                action = 'undo';
            }else {
                $this.addClass('has_comment_up')
            }

            // 获取`评论id`
            var comment_id = $this.attr('data-comment-id');

            // 组织参数
            var params = {
                "comment_id": comment_id,
                "action": action
            };

            // TODO 请求`点赞`或`取消点赞`
            $.ajax({
                url: "/comment_like",
                type: "post",
                data: JSON.stringify(params),
                contentType: "application/json",
                headers: {
                    "X-CSRFToken": getCookie("csrf_token")
                },
                success: function (resp) {
                    if (resp.errno == "0") {
                        // 操作成功
                        // 更新页面上`评论点赞数量`
                       var like_count = $this.html();

                       if (isNaN(like_count)) {
                           like_count = 0;
                       }

                       if (action == 'do') {
                           // 点赞数+1
                           like_count = parseInt(like_count) + 1;
                       }
                       else {
                           // 点赞数-1
                           like_count = parseInt(like_count) - 1;
                       }
                       $this.html(like_count);
                    }
                    else if (resp.errno == "4101") {
                        // 用户未登录
                        $(".login_form_con").show();
                    }
                    else
                    {
                        // 操作失败
                        alert(resp.errmsg);
                    }
                }
            })

        }

        if(sHandler.indexOf('reply_sub')>=0)
        {
            alert('回复评论');
            // 获取参数
            var $this = $(this);
            var news_id = $this.parent().attr('data-news-id');
            var parent_id = $this.parent().attr('data-comment-id');
            var comment = $this.prev().val();

            if (!comment) {
                alert("请输入评论内容");
                return;
            }

            // 组织参数
            var params = {
                "news_id": news_id,
                "content": comment,
                "parent_id": parent_id
            };

            // TODO 请求`回复评论`
            $.ajax({
                url: "/news/comment",
                type: "post",
                data: JSON.stringify(params),
                contentType: "application/json",
                headers: {
                    "X-CSRFToken": getCookie("csrf_token")
                },
                success: function (resp) {
                    if (resp.errno == "0") {
                        // `回复评论`成功
                        var comment = resp.comment;
                        // 拼接内容
                        var comment_html = "";
                        comment_html += '<div class="comment_list">';
                        comment_html += '<div class="person_pic fl">';
                        if (comment.user.avatar_url) {
                            comment_html += '<img src="' + comment.user.avatar_url + '" alt="用户图标">';
                        }else {
                            comment_html += '<img src="/static/news/images/person01.png" alt="用户图标">';
                        }
                        comment_html += '</div>';
                        comment_html += '<div class="user_name fl">' + comment.user.nick_name + '</div>';
                        comment_html += '<div class="comment_text fl">';
                        comment_html += comment.content;
                        comment_html += '</div>';
                        comment_html += '<div class="reply_text_con fl">';
                        comment_html += '<div class="user_name2">' + comment.parent.user.nick_name + '</div>';
                        comment_html += '<div class="reply_text">';
                        comment_html += comment.parent.content;
                        comment_html += '</div>';
                        comment_html += '</div>';
                        comment_html += '<div class="comment_time fl">' + comment.create_time + '</div>';

                        comment_html += '<a href="javascript:;" class="comment_up fr" data-comment-id="' + comment.id + '" data-news-id="' + comment.news_id + '">赞</a>';
                        comment_html += '<a href="javascript:;" class="comment_reply fr">回复</a>';
                        comment_html += '<form class="reply_form fl" data-comment-id="' + comment.id + '" data-news-id="' + news_id + '">';
                        comment_html += '<textarea class="reply_input"></textarea>';
                        comment_html += '<input type="button" value="回复" class="reply_sub fr">';
                        comment_html += '<input type="reset" name="" value="取消" class="reply_cancel fr">';
                        comment_html += '</form>';

                        comment_html += '</div>';

                        $(".comment_list_con").prepend(comment_html);
                        // 请空输入框
                        $this.prev().val('');
                        // 关闭
                        $this.parent().hide();

                        // 更新页面的新闻评论数量
                        updateCommentCount();
                    }
                    else {
                        // `回复评论`失败
                        alert(resp.errmsg);
                    }
                }
            })

        }
    });

    // 关注当前新闻作者
    $(".focus").click(function () {
        // 获取参数
        var user_id = $(this).attr("data-user-id");
        var action = "do";

        // 组织参数
        var params = {
            "user_id": user_id,
            "action": action
        };

        // 请求关注当前新闻作者
        $.ajax({
            url: "/user/follow",
            type: "post",
            data: JSON.stringify(params),
            contentType: "application/json",
            success: function (resp) {
                if (resp.errno == "0") {
                    // `关注`成功
                    // 隐藏`关注`按钮
                    $(".focus").hide();
                    // 显示`已关注`按钮
                    $(".focused").show();

                    // 设置页面上作者粉丝数量
                    var count = $(".follows b").html();
                    $(".follows b").html(parseInt(count)+1);
                }
                else if (resp.errno == "3002") {
                    // 用户未登录
                    $(".login_form_con").show();
                }
                else {
                    // `关注`失败
                    alert(resp.errmsg);
                }
            }
        })
    });

    // 取消关注当前新闻作者
    $(".focused").click(function () {
          // 获取参数
        var user_id = $(this).attr("data-user-id");
        var action = "undo";

        // 组织参数
        var params = {
            "user_id": user_id,
            "action": action
        };

        // 请求关注当前新闻作者
        $.ajax({
            url: "/user/follow",
            type: "post",
            data: JSON.stringify(params),
            contentType: "application/json",
            success: function (resp) {
                if (resp.errno == "0") {
                    // `关注`成功
                    // 显示`关注`按钮
                    $(".focus").show();
                    // 隐藏`已关注`按钮
                    $(".focused").hide();

                    // 设置页面上作者粉丝数量
                    var count = $(".follows b").html();
                    $(".follows b").html(parseInt(count)-1);
                }
                else if (resp.errno == "3002") {
                    // 用户未登录
                    $(".login_form_con").show();
                }
                else {
                    // `关注`失败
                    alert(resp.errmsg);
                }
            }
        })
    });
});