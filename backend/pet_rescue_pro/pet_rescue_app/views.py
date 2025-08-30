from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.hashers import check_password
from .models import (
    Profile, Pet, PetType, Group,
    PetMedicalHistory, PetReport, PetAdoption, Notification
)
from .serializers import (
    ProfileSerializer, PetSerializer, PetTypeSerializer, GroupSerializer,
    PetMedicalHistorySerializer, PetReportSerializer, PetAdoptionSerializer, NotificationSerializer,
    LoginSerializer
)
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken


# -------------------------
# Group ViewSet
# -------------------------
class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all().order_by("id")
    serializer_class = GroupSerializer


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
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(created_by=user, modified_by=user)

    def perform_update(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(modified_by=user)


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
# Mapping frontend role to Django Group
ROLE_MAPPING = {
    "ADMIN": "admin",
    "PET_OWNER": "pet_owner",
    "PET_RESCUER": "pet_rescuer",
    "PET_ADOPTER": "pet_adaptor",  # match your Group names
}

class RegisterAPIView(APIView):
    def post(self, request):
        serializer = ProfileSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Assign Group based on role
            frontend_role = request.data.get("role", "PET_OWNER")
            group_name = ROLE_MAPPING.get(frontend_role)
            if group_name:
                group, created = Group.objects.get_or_create(name=group_name)
                user.role.add(group)

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
            roles = list(user.role.values_list("name", flat=True))
            return Response({
                "refresh_token": str(refresh),
                "access_token": str(refresh.access_token),
                "user_id": user.id,
                "username": user.username,
                "email": user.email,
                "roles": roles,
                "detail": "Login successful"
            })
        
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)





