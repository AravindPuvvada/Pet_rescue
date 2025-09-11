from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.hashers import check_password
from .models import (
    Profile, Pet, PetType,
    PetMedicalHistory, PetReport, PetAdoption, Notification
)
from .serializers import (
    ProfileSerializer, PetTypeSerializer, PetSerializer,
    PetMedicalHistorySerializer, PetReportSerializer,
    PetAdoptionSerializer, NotificationSerializer, LoginSerializer, LostPetRequestSerializer, AdminNotificationSerializer
)

from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import action
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import UntypedToken
from django.conf import settings
import jwt
from django.db import transaction
from .models import Notification
# -------------------------
# PetType ViewSet
# -------------------------
class PetTypeViewSet(viewsets.ModelViewSet):
    queryset = PetType.objects.all().order_by("id")
    serializer_class = PetTypeSerializer


# -------------------------
# Profile ViewSet
# -------------------------
class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all().order_by("id")
    serializer_class = ProfileSerializer
    parser_classes = (MultiPartParser, FormParser)
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(created_by=user, modified_by=user)

    def perform_update(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(modified_by=user)

    # ✅ GET /api/profiles/profile_details/
    @action(detail=False, methods=['get'], url_path='profile_details')
    def profile_details(self, request):
        user = request.user
        if not user or not user.is_authenticated:
            return Response({"detail": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            profile = Profile.objects.get(email=user.email)
        except Profile.DoesNotExist:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

# -------------------------
# Pet ViewSet
# -------------------------
class PetViewSet(viewsets.ModelViewSet):
    queryset = Pet.objects.all().order_by("id")
    serializer_class = PetSerializer
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAuthenticated]  # ✅ Requires auth

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(created_by=user, modified_by=user)

    def perform_update(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(modified_by=user)


# -------------------------
# PetMedicalHistory ViewSet
# -------------------------
class PetMedicalHistoryViewSet(viewsets.ModelViewSet):
    queryset = PetMedicalHistory.objects.all().order_by("id")
    serializer_class = PetMedicalHistorySerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(created_by=user, modified_by=user)


# -------------------------
# PetReport ViewSet
# -------------------------
class PetReportViewSet(viewsets.ModelViewSet):
    queryset = PetReport.objects.all().order_by("id")
    serializer_class = PetReportSerializer
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(created_by=user, modified_by=user)

    def perform_update(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(modified_by=user)


# -------------------------
# PetAdoption ViewSet
# -------------------------
class PetAdoptionViewSet(viewsets.ModelViewSet):
    queryset = PetAdoption.objects.all().order_by("id")
    serializer_class = PetAdoptionSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(created_by=user, modified_by=user)

    def perform_update(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(modified_by=user)


# -------------------------
# Notification ViewSet
# -------------------------
class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all().order_by("id")
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(created_by=user, modified_by=user)


# -------------------------
# Register API
# -------------------------

class RegisterAPIView(APIView):
    def post(self, request):
        serializer = ProfileSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "message": "Profile registered successfully",
                "user": serializer.data
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# -------------------------
# Login API with JWT
# -------------------------
class LoginAPIView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        raw_password = serializer.validated_data["password"]

        try:
            user = Profile.objects.get(email=email)
        except Profile.DoesNotExist:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        if check_password(raw_password, user.password):
            refresh = RefreshToken.for_user(user)
            refresh["email"] = user.email
            access_token = str(refresh.access_token)

            return Response({
                "refresh_token": str(refresh),
                "access_token": access_token,
                "user_id": user.id,
                "username": user.username,
                "email": user.email,
                "detail": "Login successful"
            })

        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


# -------------------------
# LostPetRequestAPIView
# -------------------------
class LostPetRequestAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user  # Profile object

        data = request.data
        pet_data = data.get("pet")
        report_data = data.get("report")
        medical_history_data = data.get("medical_history")

        if not pet_data or not report_data:
            return Response(
                {"error": "Pet and Report data are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 1️⃣ Create Pet
        pet_serializer = PetSerializer(data=pet_data, context={"request": request})
        if pet_serializer.is_valid():
            pet = pet_serializer.save(created_by=user, modified_by=user)
        else:
            return Response({"pet": pet_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        # 2️⃣ Create PetReport
        report_serializer = PetReportSerializer(data=report_data, context={"request": request})
        if report_serializer.is_valid():
            report = report_serializer.save(user=user, pet=pet, created_by=user, modified_by=user)
        else:
            return Response({"report": report_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        # 3️⃣ Create PetMedicalHistory (if vaccinated or diseased)
        if pet.is_vaccinated or pet.is_diseased:
            medical_serializer = PetMedicalHistorySerializer(
                data=medical_history_data,
                context={"request": request, "pet": pet}  # pass pet in context
            )
            if medical_serializer.is_valid():
                medical_serializer.save()  # pet and user are already in create() via context
            else:
                return Response(
                    {"medical_history": medical_serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # 4️⃣ Create Notification for Admin
         # 4️⃣ Create Notification for Admin
        notification = Notification.objects.create(
            sender=user,
            content=f"New lost pet reported: {pet.name}",
            pet=pet,
            report=report
        )

        return Response({
            "message": "Lost pet request submitted successfully",
            "pet_id": pet.id,
            "report_id": report.id,
            "notification_id": notification.id
        }, status=status.HTTP_201_CREATED)
    

    def get(self, request):
        user = request.user  

        # ✅ Step 2: filter Lost pets whose reports are Accepted
        reports = PetReport.objects.filter(
            pet_status="Lost",
            report_status="Accepted"
        )

        data = []
        for report in reports:
            data.append({
                "report_id": report.id,
                "report_status": report.report_status,
                "pet_status": report.pet_status,
                "image": report.image.url if report.image else None,
                "pet": {
                    "id": report.pet.id,
                    "name": report.pet.name,
                    "pet_type": str(report.pet.pet_type) if report.pet.pet_type else None,
                    "breed": report.pet.breed,
                    "age": report.pet.age,
                    "color": report.pet.color,
                }
            })

        return Response({"lost_pets": data}, status=status.HTTP_200_OK)


# -------------------------
# AdminNotificationsAPIView
# -------------------------
class AdminNotificationsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # ✅ Only superusers can access
        if not user.is_superuser:
            return Response({"detail": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        # Get all notifications
        notifications = Notification.objects.all().order_by("-created_at")
        notification_list = []

        for notif in notifications:
            # Get pet and report related to this notification
            pet = getattr(notif, "pet", None)
            report = getattr(notif, "report", None)

            notification_list.append({
                "notification_id": notif.id,
                "sender": notif.sender.username if notif.sender else None,
                "content": notif.content,
                "created_at": notif.created_at,
                "pet": PetSerializer(pet).data if pet else None,
                "report": PetReportSerializer(report).data if report else None
            })

        return Response({"notifications": notification_list}, status=status.HTTP_200_OK)