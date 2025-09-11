from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    ProfileViewSet, PetViewSet, PetTypeViewSet,
    PetMedicalHistoryViewSet, PetReportViewSet, PetAdoptionViewSet,
    NotificationViewSet, RegisterAPIView, LoginAPIView, LostPetRequestAPIView
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.conf import settings
from django.conf.urls.static import static
from .views import AdminNotificationsAPIView


# Create router and register viewsets
router = DefaultRouter()
router.register(r"profiles", ProfileViewSet, basename="profile")
router.register(r"pets", PetViewSet, basename="pet")
router.register(r"pet-types", PetTypeViewSet, basename="pettype")
router.register(r"pet-medical-history", PetMedicalHistoryViewSet, basename="petmedicalhistory")
router.register(r"pet-reports", PetReportViewSet, basename="petreport")
router.register(r"pet-adoptions", PetAdoptionViewSet, basename="petadoption")
router.register(r"notifications", NotificationViewSet, basename="notification")

# URL patterns for registration, login, JWT
urlpatterns = [
    path("register/", RegisterAPIView.as_view(), name="register"),
    path("login/",    LoginAPIView.as_view(),    name="login"),
    path("token/",    TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("profile_details/", ProfileViewSet.as_view({"get": "profile_details"}), name="profile-details"),
    path("lost-pet-request/", LostPetRequestAPIView.as_view(), name="lost-pet-request"),
    path("admin/notifications/", AdminNotificationsAPIView.as_view(), name="admin-notifications"),
]

# Include all router URLs
urlpatterns += router.urls

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
