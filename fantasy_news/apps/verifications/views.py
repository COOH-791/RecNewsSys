import random

from django import http
from django.shortcuts import render
import json
# Create your views here.
from django.views import View
from django_redis import get_redis_connection

from libs.captchas.captcha import captcha

IMAGE_CODE_REDIS_EXPIRES = 120


class ImageCodeView(View):
    """图形验证码"""

    def get(self, request):
        """
        :param request: 请求对象
        :param uuid: 唯一标识图形验证码所属于的用户
        :return: image/jpeg
        """
        uuid = request.GET.get("code_id")

        # 生成图片验证码
        _, text, image = captcha.generate_captcha()

        # 保存图片验证码
        redis_conn = get_redis_connection('code')
        redis_conn.setex('img_%s' % uuid, IMAGE_CODE_REDIS_EXPIRES, text)

        # 响应图片验证码
        return http.HttpResponse(image, content_type='image/jpeg')


class SmsCodeView(View):
    def get(self, request):
        return http.HttpResponse("ok")

    def post(self, request):
        _data = json.loads(request.body.decode())
        mobile = _data["mobile"]
        image_code = _data["image_code"]
        image_code_id = _data["image_code_id"]
        print(mobile, image_code, image_code_id)

        # 校验参数
        if not all([image_code, image_code_id]):
            return http.JsonResponse({'code': 1, 'errmsg': '缺少必传参数'})

        # 创建连接到redis的对象
        redis_conn = get_redis_connection('code')
        # 提取图形验证码
        image_code_server = redis_conn.get('img_%s' % image_code_id)
        if image_code_server is None:
            # 图形验证码过期或者不存在
            return http.JsonResponse({'code': 1, 'errmsg': '图形验证码失效'})
        # 删除图形验证码，避免恶意测试图形验证码
        try:
            redis_conn.delete('img_%s' % image_code_id)
        except Exception as e:
            print(e)

        # 对比图形验证码
        image_code_server = image_code_server.decode()  # bytes转字符串
        if image_code.lower() != image_code_server.lower():  # 转小写后比较
            return http.JsonResponse({'code': 1, 'errmsg': '输入图形验证码有误'})

        # 生成短信验证码：生成6位数验证码
        sms_code = '%06d' % random.randint(0, 999999)

        # 保存短信验证码
        redis_conn.setex('sms_%s' % mobile, 60, sms_code)
        # 为了在测试期间减少短信发送，可以屏蔽发送短信功能，使用打印的方式来获取到真正的验证码值
        # 发送短信验证码
        # send_sms(mobile, sms_code)
        print(">>>>短信验证码>>>>>>", sms_code)

        return http.JsonResponse({'errno': 0, 'errmsg': '发送短信成功'})
