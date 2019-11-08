import json
import random
import re

from django import http
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth import login, logout, authenticate
from django.core.paginator import Paginator, EmptyPage
from django.db import DatabaseError
from django.forms import model_to_dict
from django.shortcuts import render, redirect
from django.urls import reverse
from django_redis import get_redis_connection
from django.views import View

# Create your views here.
from apps.users.models import User, Collection, Comment


#  登录
class LoginView(View):
    def get(self, request):
        return http.HttpResponse("ok")

    def post(self, request):
        # 取值
        _data = json.loads(request.body.decode())
        mobile = _data["mobile"]
        password = _data["password"]
        # 先查询手机号的username
        result = User.objects.filter(mobile=mobile)
        if not result:
            return http.JsonResponse({'errno': 1, 'errmsg': '手机号或密码错误'})

        username = [x.username for x in result][0]
        user = authenticate(username=username, password=password)
        if user is None:
            return http.JsonResponse({'errno': 1, 'errmsg': '手机号或密码错误'})

        # 状态保持
        login(request, user)
        response = http.JsonResponse({'errno': 0, 'errmsg': '登录成功'})
        response.set_cookie('username', user.username, max_age=3600 * 24 * 15)
        return response


# 注册
class RegisterView(View):
    def get(self, request):
        http.HttpResponse("ok")

    def post(self, request):
        _data = json.loads(request.body.decode())
        mobile = _data["mobile"]
        sms_code = _data["sms_code"]
        password = _data["password"]

        if not re.match(r"^1[3-9]\d{9}$", mobile):
            return http.JsonResponse({'errno': 1, 'errmsg': '请输入正确的手机号'})

        redis_conn = get_redis_connection('code')
        sms_code_saved = redis_conn.get('sms_%s' % mobile)
        if not sms_code_saved:
            return http.JsonResponse({'errno': 1, 'errmsg': '手机验证码过期'})

        if sms_code != sms_code_saved.decode():
            print(sms_code, sms_code_saved)
            return http.JsonResponse({'errno': 1, 'errmsg': '手机验证码错误'})

        # 保存数据
        try:
            username = str("user" + str(random.randint(0, 100)))
            user = User.objects.create_user(username=username, password=password, mobile=mobile)
        except DatabaseError:
            return http.JsonResponse({'errno': 1, 'errmsg': '注册失败'})

        # 实现状态保持
        login(request, user)
        response = http.JsonResponse({'errno': 0, 'errmsg': '注册成功'})
        response.set_cookie('username', user.username, max_age=3600 * 24 * 15)
        return response


# 退出登录
class LoginOutView(View):
    def get(self, request):
        logout(request)
        response = redirect(reverse("index:index"))
        response.delete_cookie("username")

        return response


# 添加收藏(新闻交互)
class UserCollect(View):
    """
    添加收藏
    """

    def get(self, request):
        http.HttpResponse("ok")

    def post(self, request):
        _data = json.loads(request.body.decode())
        action = _data["action"]
        news_id = _data["news_id"]
        if not all([action, news_id]):
            return http.JsonResponse({'errno': 5001, 'errmsg': '缺少参数'})

        if not request.user.id:
            return http.JsonResponse({'errno': 5002, "errmsg": "未登录"})

        if action == "do":
            try:
                affair = Collection.objects.create(news_id_id=news_id, user_id_id=request.user.id)
                affair.save()
                print("收藏成功")
                return http.JsonResponse({'errno': 0, 'errmsg': '收藏成功'})
            except DatabaseError:
                return http.JsonResponse({'errno': 5001, 'errmsg': '收藏失败'})

        elif action == "undo":  # 取消关注
            try:
                affair = Collection.objects.get(news_id_id=news_id, user_id_id=request.user.id)
                affair.delete()
                print("取消收藏成功")
                return http.JsonResponse({'errno': 0, 'errmsg': '取消收藏成功'})
            except DatabaseError:
                return http.JsonResponse({'errno': 5004, 'errmsg': '取消收藏失败'})


# 用户中心(新闻交互)
class UserCenterView(LoginRequiredMixin, View):
    """
    用户中心
    """

    def get(self, request):
        username = request.user.username
        user = User.objects.filter(username=username)
        return render(request, "index/user.html", {"user": user, "username": username})


# 基本资料(新闻交互)
class UserBaseInfoView(LoginRequiredMixin, View):
    def get(self, request):
        user_id = request.user.id
        user = User.objects.get(id=user_id)
        return render(request, "index/user_base_info.html", {"user": user})

    def post(self, request):
        _data = json.loads(request.body.decode())
        gender = _data["gender"]
        nick_name = _data["nick_name"]
        signature = _data["signature"]
        print(gender, nick_name, signature)
        if not all([gender, nick_name, signature]):
            return http.JsonResponse({"errno": 4001, "errmsg": "确少参数"})

        try:
            user = User.objects.get(id=request.user.id)
            user.username = nick_name
            user.gender = gender
            user.signature = signature
            user.save()
            return http.JsonResponse({'errno': 1, 'errmsg': '修改成功'})
        except DatabaseError:
            return http.JsonResponse({'errno': 1, 'errmsg': '保存失败'})


# 收藏列表(新闻交互)
class UserCollection(LoginRequiredMixin, View):
    """
    收藏列表
    """
    def get(self, request):
        num_page = request.GET.get("page")
        if not num_page:
            num_page = 1
        user_id = request.user.id  # 提取用户id
        affair = Collection.objects.filter(user_id_id=user_id)
        _data = [model_to_dict(x.news_id) for x in affair]  # 构造字典

        paginator = Paginator(_data, 8, 3)  # 分页对象
        try:
            content = paginator.page(num_page)
        except EmptyPage:
            return http.HttpResponseNotFound("empty page")

        return render(request, "index/user_collection.html", {"collection_news": content, "paginate": paginator})


# 密码(新闻交互)
class UserPicView(LoginRequiredMixin, View):
    def get(self, request):
        return render(request, "index/user_pic_info.html")

    def post(self, request):
        pass


# 评论(新闻交互)
class CommentView(LoginRequiredMixin, View):
    def post(self, request):
        # 取值
        _data = json.loads(request.body.decode())
        content = _data["content"]
        news_id = _data["news_id"]
        user_id = request.user.id

        # 验证
        if not all([content, news_id, user_id]):
            return http.JsonResponse({"errno": 4008, "errmsg": "缺失参数"})

        # 入库
        try:
            affair = Comment.objects.create(user_info_id=user_id, new_info_id=news_id, content=content)
            affair.save()
            print("评论成功!")
            return http.JsonResponse({'errno': 0, 'errmsg': '评论成功'})
        except DatabaseError:
            return http.JsonResponse({'errno': 5001, 'errmsg': '评论失败'})


class UserPassView(LoginRequiredMixin, View):
    def get(self, request):
        return render(request, "index/user_pass_info.html")


