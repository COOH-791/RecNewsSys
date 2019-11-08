from django.conf.urls import url

from .views import ImageCodeView, SmsCodeView

urlpatterns = [
    url(r'^image_code$', ImageCodeView.as_view(), name="image_code"),
    url(r'^smscode$', SmsCodeView.as_view(), name="sms_code")
]
