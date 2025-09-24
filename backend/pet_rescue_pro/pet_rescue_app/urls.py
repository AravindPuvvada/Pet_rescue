from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    ProfileViewSet, PetViewSet, PetTypeViewSet,
    PetMedicalHistoryViewSet, PetReportViewSet, PetAdoptionViewSet,
    NotificationViewSet, RegisterAPIView, LoginAPIView, LostPetRequestAPIView, PetsListAPIView, AdminApprovalAPIView, UserNotificationsAPIView, UserRequestsListAPIView,
    AdminUserListView, AdminUserDetailView, AdminPetReportsAPIView, AdminPetReportDetailAPIView, AdminUnreadNotificationCountAPIView,
    AdminLostPetRequestsAPIView, AdminManageReportStatusAPIView, VerifyRegisterAPIView,
    PasswordResetRequestAPIView, PasswordResetConfirmAPIView,AdminFoundPetRequestsAPIView,AdminChangePasswordView,
    FoundPetRequestAPIView, UserLostPetsAPIView, UserFoundPetsAPIView, AdoptionPetsView,UserPetAdoptionsAPIView, AdoptablePetsAPIView,
    RecentPetsAPIView, MyRewardView, AllRewardsView, FeedbackStoryAPIView, UserReportViewSet
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.conf import settings
from django.conf.urls.static import static
from .views import AdminNotificationsAPIView
from . import views


# Create router and register viewsets
router = DefaultRouter()
router.register(r"profiles", ProfileViewSet, basename="profile")
router.register(r"pets", PetViewSet, basename="pet")
router.register(r"pet-types", PetTypeViewSet, basename="pettype")
router.register(r"pet-medical-history", PetMedicalHistoryViewSet, basename="petmedicalhistory")
router.register(r"pet-reports", PetReportViewSet, basename="petreport")
router.register(r"pet-adoptions", PetAdoptionViewSet, basename="petadoption")
router.register(r"notifications", NotificationViewSet, basename="notification")
router.register(r"user-reports", UserReportViewSet, basename="userreport")

# URL patterns for registration, login, JWT
urlpatterns = [
    path("register/", RegisterAPIView.as_view(), name="register"),
    path("login/", LoginAPIView.as_view(),    name="login"),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("profile_details/", ProfileViewSet.as_view({"get": "profile_details"}), name="profile-details"),
    path("lost-pet-request/", LostPetRequestAPIView.as_view(), name="lost-pet-request"),
    path("admin/notifications/", AdminNotificationsAPIView.as_view(), name="admin-notifications"),
    path("pets-list/", PetsListAPIView.as_view(), name="pets-list"),
    path("admin/approve/", AdminApprovalAPIView.as_view(), name="admin-approve"),
    path("get-notifications/", UserNotificationsAPIView.as_view(), name="user-notifications"),
    path('my-requests/', UserRequestsListAPIView.as_view(), name='my-requests'),
    path("admin/users/", AdminUserListView.as_view(), name="admin-user-list"),
    path("admin/users/<int:user_id>/", AdminUserDetailView.as_view(), name="admin-user-detail"),
    path("admin/reports/", AdminPetReportsAPIView.as_view(), name="admin-reports"),
    path("admin/reports/<int:report_id>/", AdminPetReportDetailAPIView.as_view(), name="admin-report-detail"),
    path('admin/notifications/unread-count/', AdminUnreadNotificationCountAPIView.as_view(), name='admin-unread-count'),
    path("admin/lost-pet-requests/", AdminLostPetRequestsAPIView.as_view(), name="admin-lost-pet-requests"),
    path("admin/manage-report/<int:report_id>/", AdminManageReportStatusAPIView.as_view(), name="admin-manage-report"),
    path("verify-register/", VerifyRegisterAPIView.as_view(), name="verify-register"),
    path("password-reset-request/", PasswordResetRequestAPIView.as_view(), name="password-reset-request"),
    path("password-reset-confirm/", PasswordResetConfirmAPIView.as_view(), name="password-reset-confirm"),
    path("admin/found-pet-requests/", AdminFoundPetRequestsAPIView.as_view(), name="admin-found-pet-requests"),
    path("admin/users/", AdminUserListView.as_view(), name="admin-user-list"),
    path("admin/users/<int:user_id>/", AdminUserDetailView.as_view(), name="admin-user-detail"),
    path("admin/change-password/", AdminChangePasswordView.as_view(), name="admin-change-password"),
    path("found-pet-request/", FoundPetRequestAPIView.as_view(), name="found-pet-request"),
    path("chatbot/", views.chatbot_response, name="chatbot"),
    path("my-lost-pets/", UserLostPetsAPIView.as_view(), name="my-lost-pets"),
    path("my-found-pets/", UserFoundPetsAPIView.as_view(), name="my-found-pets"),
    path("my-pet-adoptions/", UserPetAdoptionsAPIView.as_view(), name="my-pet-adoptions"),
    path("my-pet-adoptions/", UserPetAdoptionsAPIView.as_view(), name="my-pet-adoptions"),
    path("adoptable-pets/", AdoptablePetsAPIView.as_view(), name="adoptable-pets"),
    path("pets/recent/", RecentPetsAPIView.as_view(), name="recent-pets"),
    path("my-rewards/", MyRewardView.as_view(), name="my-rewards"),
    path("all-rewards/", AllRewardsView.as_view(), name="all-rewards"),
    path("feedback-stories/", FeedbackStoryAPIView.as_view(), name="feedback-list-create"),
]

# Include all router URLs
urlpatterns += router.urls

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
