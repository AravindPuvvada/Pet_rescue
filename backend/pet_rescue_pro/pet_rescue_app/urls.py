from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, PetViewSet, RegisterAPIView, LoginAPIView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


router = DefaultRouter()
router.register(r"users", UserViewSet, basename="user")
router.register(r"pets", PetViewSet, basename="pet")

# urlpatterns = [
#     path("register/", RegisterAPIView.as_view(), name="register"),
#     path("login/",    LoginAPIView.as_view(),    name="login"),
# ]
urlpatterns = [
    path("register/", RegisterAPIView.as_view(), name="register"),
    path("login/",    LoginAPIView.as_view(),    name="login"),
    path("token/",    TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]


urlpatterns += router.urls
