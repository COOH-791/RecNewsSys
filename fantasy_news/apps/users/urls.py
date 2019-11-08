from django.conf.urls import url

from .views import LoginView, RegisterView, LoginOutView, UserCenterView, UserPicView, UserCollection, UserCollect, \
    UserBaseInfoView, CommentView, UserPassView

urlpatterns = [
    url(r'^login', LoginView.as_view(), name="login"),
    url(r'^register', RegisterView.as_view(), name="register"),
    url(r'^logout', LoginOutView.as_view(), name="logout"),
    url(r'^user$', UserCenterView.as_view(), name="userCenter"),
    url(r'^user_pic_info', UserPicView.as_view(), name="userPic"),
    url(r'^user_collection', UserCollection.as_view(), name="user_collection"),
    url(r'^news/collect', UserCollect.as_view(), name="userCollect"),
    url(r'user_base_info', UserBaseInfoView.as_view(), name="user_base_info"),
    url(r'comment', CommentView.as_view(), name="comment"),
    url(r'^user_pass_info', UserPassView.as_view(), name="userPass")
]
