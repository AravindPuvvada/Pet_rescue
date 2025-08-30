# from rest_framework import viewsets, status
# from rest_framework.response import Response
# from rest_framework.views import APIView
# from django.contrib.auth.hashers import check_password
# from .models import User, Pet
# from .serializers import UserSerializer, PetSerializer, LoginSerializer
# from rest_framework.parsers import MultiPartParser, FormParser
# from rest_framework.permissions import IsAuthenticated
# from rest_framework_simplejwt.tokens import RefreshToken

# # -------------------------
# # User and Pet ViewSets
# # -------------------------

# class UserViewSet(viewsets.ModelViewSet):
#     queryset = User.objects.all().order_by("id")
#     serializer_class = UserSerializer


# class PetViewSet(viewsets.ModelViewSet):
#     queryset = Pet.objects.all().order_by("id")
#     serializer_class = PetSerializer
#     parser_classes = (MultiPartParser, FormParser)
#     permission_classes = [IsAuthenticated]  # JWT protected


# # -------------------------
# # Register API
# # -------------------------

# class RegisterAPIView(APIView):
#     def post(self, request):
#         ser = UserSerializer(data=request.data)
#         if ser.is_valid():
#             ser.save()
#             # return Response(ser.data, status=status.HTTP_201_CREATED)
#             return Response({
#     "message": "User registered successfully",
#     "user": ser.data
# }, status=status.HTTP_201_CREATED)

#         return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)


# # -------------------------
# # Login API with JWT
# # -------------------------

# class LoginAPIView(APIView):
#     def post(self, request):
#         ser = LoginSerializer(data=request.data)
#         ser.is_valid(raise_exception=True)
#         email = ser.validated_data["email"]
#         raw_password = ser.validated_data["password"]

#         try:
#             user = User.objects.get(email=email)
#         except User.DoesNotExist:
#             return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

#         if check_password(raw_password, user.password):
#             refresh = RefreshToken.for_user(user)
#             return Response({
#                 "refresh_token": str(refresh),
#                 "access_token": str(refresh.access_token),
#                 "user_id": user.id,
#                 "username": user.username,
#                 "email": user.email,
#                 "role": user.role,
#                 "detail": "Login successful"
#             })
        
#         return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.hashers import check_password
from .models import User, Pet
from .serializers import UserSerializer, PetSerializer, LoginSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

# -------------------------
# User and Pet ViewSets
# -------------------------

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by("id")
    serializer_class = UserSerializer


class PetViewSet(viewsets.ModelViewSet):
    queryset = Pet.objects.all().order_by("id")
    serializer_class = PetSerializer
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAuthenticated]  # JWT protected

    def perform_create(self, serializer):
        """
        Automatically set the currently logged-in user as the owner of the pet.
        """
        serializer.save(owner=self.request.user)


# -------------------------
# Register API
# -------------------------

class RegisterAPIView(APIView):
    def post(self, request):
        ser = UserSerializer(data=request.data)
        if ser.is_valid():
            ser.save()
            return Response({
                "message": "User registered successfully",
                "user": ser.data
            }, status=status.HTTP_201_CREATED)
        return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)


# -------------------------
# Login API with JWT
# -------------------------

class LoginAPIView(APIView):
    def post(self, request):
        ser = LoginSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        email = ser.validated_data["email"]
        raw_password = ser.validated_data["password"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        if check_password(raw_password, user.password):
            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh_token": str(refresh),
                "access_token": str(refresh.access_token),
                "user_id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role,
                "detail": "Login successful"
            })
        
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
