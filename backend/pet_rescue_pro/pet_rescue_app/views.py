from rest_framework import viewsets, status
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.hashers import make_password, check_password
from .models import (
    Profile, Pet, PetType,
    PetMedicalHistory, PetReport, PetAdoption, Notification
)
from .serializers import (
    ProfileSerializer, PetTypeSerializer, PetSerializer,
    PetMedicalHistorySerializer, PetReportSerializer,
    PetAdoptionSerializer, NotificationSerializer, LoginSerializer, LostPetRequestSerializer, AdminNotificationSerializer,
      PetReportListSerializer, PetAdoptionListSerializer, AdminApprovalSerializer, UserPetReportSerializer,
        UserAdoptionRequestSerializer, AdminUserSerializer,AdminPetReportSerializer, PasswordResetRequestSerializer, PasswordResetConfirmSerializer,
        RegisterSerializer, VerifyRegisterSerializer,UserAdoptionDetailSerializer
)
from .utils import send_otp_email, verify_otp

from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
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
import random
from django.core.mail import send_mail
from rest_framework.permissions import AllowAny
from django.core.cache import cache
import os
import json
import google.generativeai as genai
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from datetime import timedelta



genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

@csrf_exempt
def chatbot_response(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_message = data.get("message", "")
            section = data.get("section", "")  # ✅ context info from frontend

            # Context-aware prompt
            context = f"""
            You are Pet Rescue Assistant for the project pet_rescue_pro.

            The user is currently in the '{section}' section of the dashboard.

            Rules for context:
            - If in 'pet-owner', focus on pet ownership and lost pet reports.
            - If in 'pet-rescuer', focus on rescue activities and medical history.
            - If in 'pet-adopter', focus on adoption and available pets.
            - If section is empty or unclear, give a friendly response and guide back to project features.
            - If asked for code or technical solutions unrelated to pets, politely decline and say:
                "I can only provide coding help related to Pet Rescue Pro (like adoption forms, pet reports, etc.)."
            General behavior:
            - Be friendly and conversational. Respond to greetings (hi, hello, hey) warmly.
            - If the user asks about general things (weather, math, chit-chat), you may answer briefly,
              but always guide the conversation back to pet rescue, adoption, or project features.
            - Keep your answers concise and helpful, like a real assistant inside the project.
            """

            # Call Gemini
            model = genai.GenerativeModel("gemini-2.5-flash")
            response = model.generate_content(f"{context}\n\nUser: {user_message}\nAssistant:")

            reply = response.text.strip() if response and response.text else "⚠️ No response from Gemini."

        except Exception as e:
            reply = f"⚠️ Error connecting to Gemini API: {str(e)}"

        return JsonResponse({"reply": reply})

    # For GET requests → return health check
    return JsonResponse({"status": "Chatbot API running ✅"}, status=200)

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
    parser_classes = (MultiPartParser, FormParser, JSONParser)
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
    
    # ✅ POST /api/profiles/change_password/
    @action(detail=False, methods=['post'], url_path='change-password')
    def change_password(self, request):
        user = request.user
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")

        if not user.check_password(old_password):
            return Response({"error": "Old password is incorrect"}, status=status.HTTP_400_BAD_REQUEST)

        if not new_password:
            return Response({"error": "New password is required"}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({"message": "Password changed successfully"}, status=status.HTTP_200_OK)

class PetViewSet(viewsets.ModelViewSet):
    queryset = Pet.objects.all().order_by("id")
    serializer_class = PetSerializer
    parser_classes = (MultiPartParser, FormParser,JSONParser)
    permission_classes = [IsAuthenticated]  # ✅ Requires auth

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})  # ✅ pass request to serializer
        return context

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
    parser_classes = (MultiPartParser, FormParser,JSONParser)
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(created_by=user, modified_by=user)

    def perform_update(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(modified_by=user)
    def update(self, request, *args, **kwargs):
        # Get the report instance that is about to be updated
        report = self.get_object()
        
        # Store the original status before any changes are made
        original_status = report.report_status

        # Proceed with the default update behavior
        response = super().update(request, *args, **kwargs)

        # After the update, check if the status was changed by an admin
        new_status = response.data.get('report_status')
        if original_status != new_status and request.user.is_superuser:
            
            # Create a notification for the user who created the report
            Notification.objects.create(
                sender=request.user,          # The admin making the change
                receiver=report.user,         # The user who owns the report
                content=f"An admin updated the status for your pet '{report.pet.name}' to '{new_status}'.",
                pet=report.pet,
                report=report
            )
        return response


# -------------------------
# PetAdoption ViewSet
# -------------------------
# -------------------------
# PetAdoption ViewSet
# -------------------------
class PetAdoptionViewSet(viewsets.ModelViewSet):
    queryset = PetAdoption.objects.all().order_by("id")
    serializer_class = PetAdoptionSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(requestor=user,created_by=user, modified_by=user)

        # ✨ START: New logic to notify the admin
        # Find the admin user to notify
        try:
            admin_user = Profile.objects.get(is_superuser=True)
        except Profile.DoesNotExist:
            admin_user = None

        # If an admin exists, create the notification
        if admin_user:
            Notification.objects.create(
                sender=user,
                receiver=admin_user,
                content=f"User '{user.username}' has submitted a claim for the pet '{adoption_instance.pet.name}'.",
                pet=serializer.pet
            )
        # ✨ END: New logic

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

    @action(detail=True, methods=['patch'])
    def mark_as_read(self, request, pk=None):
        try:
            notification = self.get_object()
        except Notification.DoesNotExist:
            return Response({"detail": "Notification not found"}, status=status.HTTP_404_NOT_FOUND)
        
        notification.is_read = True
        notification.save()
        
        # Return the updated notification data
        serializer = self.get_serializer(notification)
        return Response(serializer.data, status=status.HTTP_200_OK)

class RegisterAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        email = data.get("email")
        username = data.get("username")
        password = data.get("password")
        phone = data.get("phone", "")
        address = data.get("address", "")
        pincode = data.get("pincode", "")
        gender = data.get("gender", "")

        # Check if user already exists
        if Profile.objects.filter(email=email).exists():
            return Response({"error": "User with this email already exists."}, status=400)

        # Generate OTP and create user
        otp_code = str(random.randint(100000, 999999))
        Profile.objects.create(
            username=username,
            email=email,
            password=make_password(password),
            phone=phone,
            address=address,
            pincode=pincode,
            gender=gender,
            otp=otp_code,
            is_verified=False,
        )

        # Send professional HTML OTP email with same OTP
        send_otp_email(email, purpose="account verification", otp=otp_code)

        return Response({"message": "OTP sent!"}, status=201)



class VerifyRegisterAPIView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        data = request.data
        email = data.get("email")
        code = data.get("code")

        try:
            user = Profile.objects.get(email=email)
        except Profile.DoesNotExist:
            return Response({"error": "User not found."}, status=400)

        if user.otp == code:
            user.is_verified = True
            user.otp = ""
            user.save()
            return Response({"message": "Account verified successfully!"}, status=200)

        return Response({"error": "Invalid OTP."}, status=400)


# ---------------- Login ----------------
class LoginAPIView(APIView):
    permission_classes = [AllowAny]  # keep open for all

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data["email"]
            password = serializer.validated_data["password"]

            try:
                user = Profile.objects.get(email=email)
            except Profile.DoesNotExist:
                return Response({"error": "Invalid credentials"}, status=400)

            # 🔹 Check password
            if not check_password(password, user.password):
                return Response({"error": "Invalid credentials"}, status=400)

            # 🔹 If superuser, force is_verified = True
            if user.is_superuser:
                if not user.is_verified:
                    user.is_verified = True
                    user.save()

            # 🔹 If not superuser, block unverified users
            elif not user.is_verified:
                return Response({"error": "Account not verified. Please verify your email first."}, status=403)

            # 🔹 Generate tokens
            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "is_superuser": user.is_superuser,
                }
            }, status=200)

        return Response(serializer.errors, status=400)

# ---------------- Password Reset Request ----------------
class PasswordResetRequestAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data["email"]

            # Check if user exists
            if not Profile.objects.filter(email=email).exists():
                return Response({"error": "No user with this email."}, status=400)

            # Generate OTP
            otp_code = str(random.randint(100000, 999999))

            # Optionally, store OTP in cache (for verification later)
            cache.set(f"otp_{email}", otp_code, timeout=600)  # 10 minutes

            # Send professional HTML OTP email with the same OTP
            send_otp_email(email, purpose="password reset", otp=otp_code)

            return Response({"message": "OTP sent to your email."}, status=200)

        return Response(serializer.errors, status=400)


# ---------------- Password Reset Confirm ----------------
class PasswordResetConfirmAPIView(APIView):
    permission_classes = [AllowAny]   
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data["email"]
            otp = serializer.validated_data["otp"]
            new_password = serializer.validated_data["new_password"]

            if verify_otp(email, otp):
                try:
                    user = Profile.objects.get(email=email)
                except Profile.DoesNotExist:
                    return Response({"error": "User not found."}, status=400)

                user.password = make_password(new_password)
                user.save()
                return Response({"message": "Password updated successfully."}, status=200)

            return Response({"error": "Invalid or expired OTP."}, status=400)

        return Response(serializer.errors, status=400)

# -------------------------
# LostPetRequestAPIView
# -------------------------
class LostPetRequestAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        user = request.user  # Profile object

        data = request.data
        
        # Parse JSON data from FormData
        import json
        try:
            pet_data = json.loads(data.get("pet", "{}"))
            report_data = json.loads(data.get("report", "{}"))
            medical_history_data = json.loads(data.get("medical_history", "{}")) if data.get("medical_history") else None
        except json.JSONDecodeError:
            return Response(
                {"error": "Invalid JSON data"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not pet_data or not report_data:
            return Response(
                {"error": "Pet and Report data are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Handle pet image
        pet_image = request.FILES.get('pet_image')
        print(f"Pet image received: {pet_image}")  # Debug log
        if pet_image:
            pet_data['image'] = pet_image

        # 1️⃣ Create Pet
        pet_serializer = PetSerializer(data=pet_data, context={"request": request})
        if pet_serializer.is_valid():
            pet = pet_serializer.save(created_by=user, modified_by=user)
            print(f"Pet created with image: {pet.image}")  # Debug log
        else:
            print("Pet serializer errors:", pet_serializer.errors)  # Debug logging
            return Response({"pet": pet_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        # Handle report image (use same image as pet for now)
        if pet_image:
            report_data['image'] = pet_image

        # 2️⃣ Create PetReport
        report_serializer = PetReportSerializer(data=report_data, context={"request": request})
        if report_serializer.is_valid():
            report = report_serializer.save(user=user, pet=pet, created_by=user, modified_by=user)
            print(f"Report created with image: {report.image}")  # Debug log
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
        try:
            admin_user = Profile.objects.get(is_superuser=True)
        except Profile.DoesNotExist:
            admin_user = None

        # Create the notification and explicitly set the admin as the receiver
        notification = Notification.objects.create(
            sender=user,
            receiver=admin_user, # 👈 SET THE RECEIVER
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
            pet_obj = report.pet
            
            # 💡 Fetch Medical History
            medical_history = PetMedicalHistory.objects.filter(pet=pet_obj).first()
            
            # Map medical fields, defaulting to None if no history exists
            medical_data = {
                "last_vaccinated_date": medical_history.last_vaccinated_date.isoformat() if medical_history and medical_history.last_vaccinated_date else None,
                "vaccination_name": medical_history.vaccination_name if medical_history else None,
                "disease_name": medical_history.disease_name if medical_history else None,
                "stage": medical_history.stage if medical_history else None,
                "no_of_years": medical_history.no_of_years if medical_history else None,
            }
            
            data.append({
                "report_id": report.id,
                "report_status": report.report_status,
                "pet_status": report.pet_status,
                "image": report.image.url if report.image else None,
                "pet": {
                    "id": pet_obj.id,
                    "name": pet_obj.name,
                    "pet_type": str(pet_obj.pet_type) if pet_obj.pet_type else None,
                    "breed": pet_obj.breed,
                    "age": pet_obj.age,
                    "description": pet_obj.description,
                    "color": pet_obj.color,
                    "address": pet_obj.address, 
                    "city": pet_obj.city,
                    "state": pet_obj.state,
                    "gender": pet_obj.gender,
                    "is_diseased": pet_obj.is_diseased,
                    "is_vaccinated": pet_obj.is_vaccinated,
                    # ✅ EMBED MEDICAL DATA
                    "medical_history": medical_data,
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
        
        # Only superusers can access
        if not user.is_superuser:
            return Response({"detail": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        # Filter for notifications where the receiver is the current superuser
        notifications = Notification.objects.filter(receiver=user).order_by("-created_at")
        
        # Use the serializer to handle the data conversion automatically
        serializer = NotificationSerializer(notifications, many=True)
        
        return Response({"notifications": serializer.data}, status=status.HTTP_200_OK)
    


# -------------------------
# Pets List API
# -------------------------
class PetsListAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        tab = request.query_params.get("tab")
        if not tab:
            return Response({"error": "Tab parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

        data = []

        if tab.lower() == "lost":
            reports = PetReport.objects.filter(pet_status="Lost", report_status="Accepted")
            data = PetReportSerializer(reports, many=True, context={"request": request}).data

        elif tab.lower() == "found":
            reports = PetReport.objects.filter(pet_status="Found", report_status="Accepted")
            data = PetReportSerializer(reports, many=True, context={"request": request}).data

        elif tab.lower() == "adopt":
            adoptions = PetAdoption.objects.filter(status="Approved")
            data = PetAdoptionListSerializer(adoptions, many=True, context={"request": request}).data

        else:
            return Response({"error": "Invalid tab value"}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"results": data}, status=status.HTTP_200_OK)


# -------------------------
# Admin Approval API
# -------------------------
class AdminApprovalAPIView(APIView):
    permission_classes = [IsAuthenticated]  # Only logged-in users

    def post(self, request):
        # ✅ Superuser check
        if not request.user.is_superuser:
            return Response(
                {"error": "Only admin can approve or reject requests"},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = AdminApprovalSerializer(data=request.data)
        if serializer.is_valid():
            request_type = serializer.validated_data["request_type"]
            pet_id = serializer.validated_data["pet_id"]
            action = serializer.validated_data["action"]

            # LOST or FOUND
            if request_type in ["lost", "found"]:
                pet_status = "Lost" if request_type == "lost" else "Found"
                try:
                    report = PetReport.objects.get(pet__id=pet_id, pet_status=pet_status)
                    report.report_status = "Accepted" if action == "approve" else "Rejected"
                    report.save()

                    # Notification with receiver
                    Notification.objects.create(
                        sender=request.user,                     # Admin
                        receiver=report.user,                    # ← NEW: user who created the report
                        content=f"Your {request_type} pet request is {report.report_status.lower()}",
                        pet=report.pet,
                        report=report
                    )
                    return Response(
                        {"message": f"{request_type.capitalize()} pet request {report.report_status.lower()} successfully"},
                        status=status.HTTP_200_OK
                    )
                except PetReport.DoesNotExist:
                    return Response({"error": "Pet report not found"}, status=status.HTTP_404_NOT_FOUND)

            # ADOPTION
            elif request_type == "adopt":
                try:
                    adoption = PetAdoption.objects.get(pet__id=pet_id)
                    adoption.status = "Approved" if action == "approve" else "Rejected"
                    adoption.save()

                    # Notification with receiver
                    Notification.objects.create(
                        sender=request.user,                      # Admin
                        receiver=adoption.requestor,             # ← NEW: user who requested adoption
                        content=f"Your adoption request is {adoption.status.lower()}",
                        pet=adoption.pet
                    )
                    return Response(
                        {"message": f"Adoption request {adoption.status.lower()} successfully"},
                        status=status.HTTP_200_OK
                    )
                except PetAdoption.DoesNotExist:
                    return Response({"error": "Adoption request not found"}, status=status.HTTP_404_NOT_FOUND)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# -------------------------
# Show Notifications API
# -------------------------
class UserNotificationsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user  # Get logged-in user

        # Get all notifications for this user, order by latest
        notifications = Notification.objects.filter(receiver=user).order_by('-created_at')

        serializer = NotificationSerializer(notifications, many=True, context={"request": request})
        return Response({"notifications": serializer.data}, status=status.HTTP_200_OK)



# -------------------------
# User Requests List API
# -------------------------
class UserRequestsListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = request.user  # Already Profile because Profile is your AUTH_USER_MODEL

        # fetch reports created by this profile
        reports = PetReport.objects.filter(user=profile)

        # fetch adoption requests made by this profile
        adoptions = PetAdoption.objects.filter(requestor=profile)

        report_data = UserPetReportSerializer(reports, many=True).data
        adoption_data = UserAdoptionRequestSerializer(adoptions, many=True).data

        return Response({
            "reports": report_data,
            "adoptions": adoption_data
        }, status=status.HTTP_200_OK)




class AdminUserListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Only superusers can access this list
        if not user.is_superuser:
            return Response({"detail": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        qs = Profile.objects.all().order_by("-created_at")

        # Simple filters from query params
        gender = request.query_params.get("gender")        # expect: Male / Female / Other
        superuser = request.query_params.get("superuser")  # expect: true / false / 1 / 0

        if gender:
            qs = qs.filter(gender__iexact=gender)

        if superuser is not None:
            s = superuser.lower()
            if s in ("true", "1", "yes"):
                qs = qs.filter(is_superuser=True)
            elif s in ("false", "0", "no"):
                qs = qs.filter(is_superuser=False)
            # otherwise ignore invalid values

        serializer = AdminUserSerializer(qs, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class AdminUserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, user_id):
        user = request.user

        if not user.is_superuser:
            return Response({"detail": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        try:
            target_user = Profile.objects.get(id=user_id)
        except Profile.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = AdminUserSerializer(
            target_user, data=request.data, partial=True, context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        current_password = request.data.get("current_password")
        new_password = request.data.get("new_password")

        if not current_password or not new_password:
            return Response(
                {"error": "Current password and new password are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not check_password(current_password, user.password):
            return Response(
                {"error": "Current password is incorrect"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(new_password) < 6:
            return Response(
                {"error": "New password must be at least 6 characters long"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(new_password)
        user.save()

        return Response(
            {"message": "Password updated successfully"},
            status=status.HTTP_200_OK,
        )
    


class AdminPetReportsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_superuser:
            return Response({"detail": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        reports = PetReport.objects.all().order_by("-created_date")
        serializer = AdminPetReportSerializer(reports, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AdminPetReportDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, report_id):
        if not request.user.is_superuser:
            return Response({"detail": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        try:
            report = PetReport.objects.get(id=report_id)
        except PetReport.DoesNotExist:
            return Response({"detail": "Report not found"}, status=status.HTTP_404_NOT_FOUND)

        action = request.data.get("action")  # "approve" or "reject"
        if action == "approve":
            report.report_status = "Accepted"
        elif action == "reject":
            report.report_status = "Rejected"
        else:
            return Response({"detail": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)

        report.save()
        return Response({"message": f"Report {action}d successfully"}, status=status.HTTP_200_OK)

    def delete(self, request, report_id):
        if not request.user.is_superuser:
            return Response({"detail": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        try:
            report = PetReport.objects.get(id=report_id)
        except PetReport.DoesNotExist:
            return Response({"detail": "Report not found"}, status=status.HTTP_404_NOT_FOUND)

        report.delete()
        return Response({"message": "Report deleted successfully"}, status=status.HTTP_200_OK)
    

class AdminUnreadNotificationCountAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_superuser:
            return Response({"detail": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)
        
        # Filter for notifications where the receiver is the current superuser
        unread_count = Notification.objects.filter(is_read=False, receiver=request.user).count()
        
        return Response({"unread_count": unread_count}, status=status.HTTP_200_OK)
    
class AdminLostPetRequestsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # ✅ Only allow admin
        if not request.user.is_superuser:
            return Response(
                {"error": "Only admin can view lost pet requests"},
                status=status.HTTP_403_FORBIDDEN
            )

        # ✅ Use the detailed AdminPetReportSerializer for a consistent response
        # This ensures all necessary data (user, pet details, dates) is included.
        reports = PetReport.objects.filter(pet_status="Lost").select_related("pet", "user").order_by("-created_date")
        serializer = AdminPetReportSerializer(reports, many=True, context={'request': request})
        
        # ✅ Return the serialized data directly as an array
        return Response(serializer.data, status=status.HTTP_200_OK)


class AdminFoundPetRequestsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Only allow admin access
        if not request.user.is_superuser:
            return Response(
                {"error": "Only admin can view found pet requests"},
                status=status.HTTP_403_FORBIDDEN
            )

        # Use the same detailed serializer, but filter for "Found" status
        reports = PetReport.objects.filter(pet_status="Found").select_related("pet", "user").order_by("-created_date")
        serializer = AdminPetReportSerializer(reports, many=True, context={'request': request})
        
        return Response(serializer.data, status=status.HTTP_200_OK)


class AdminManageReportStatusAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, report_id):
        if not request.user.is_superuser:
            return Response(
                {"error": "Only admin can update report status"},
                status=status.HTTP_403_FORBIDDEN
            )

        report_status = request.data.get("report_status")
        if report_status not in dict(REPORT_STATUS_CHOICES):
            return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            report = PetReport.objects.get(id=report_id)
            report.report_status = report_status
            report.save()

            # Notify user
            Notification.objects.create(
                sender=request.user,
                receiver=report.user,
                content=f"Your pet report status changed to {report_status.lower()}",
                pet=report.pet,
                report=report
            )

            return Response(
                {"message": f"Report status updated to {report_status}"},
                status=status.HTTP_200_OK
            )
        except PetReport.DoesNotExist:
            return Response({"error": "Report not found"}, status=status.HTTP_404_NOT_FOUND)



class FoundPetRequestAPIView(APIView): # Inheriting from APIView for public read access
    permission_classes = [IsAuthenticated] # Assuming users must be logged in to view

    def get(self, request):
        # 1. Filter Accepted 'Found' reports
        reports = PetReport.objects.filter(
            pet_status="Found",
            report_status="Accepted"
        )

        data = []
        for report in reports:
            pet_obj = report.pet
            medical_history = PetMedicalHistory.objects.filter(pet=pet_obj).first()
            
            medical_data = {
                "last_vaccinated_date": medical_history.last_vaccinated_date.isoformat() if medical_history and medical_history.last_vaccinated_date else None,
                "vaccination_name": medical_history.vaccination_name if medical_history else None,
                "disease_name": medical_history.disease_name if medical_history else None,
                "stage": medical_history.stage if medical_history else None,
                "no_of_years": medical_history.no_of_years if medical_history else None,
            }
            
            data.append({
                "report_id": report.id,
                "report_status": report.report_status,
                "pet_status": report.pet_status,
                "image": report.image.url if report.image else None,
                "created_date": report.created_date.isoformat(),
                "pet": {
                    "id": pet_obj.id,
                    "name": pet_obj.name,
                    "pet_type": str(pet_obj.pet_type) if pet_obj.pet_type else None,
                    "breed": pet_obj.breed,
                    "age": pet_obj.age,
                    "color": pet_obj.color,
                    "address": pet_obj.address, 
                    "description": pet_obj.description,
                    "city": pet_obj.city,
                    "state": pet_obj.state,
                    "pincode": pet_obj.pincode, # Added pincode
                    "gender": pet_obj.gender,
                    "is_diseased": pet_obj.is_diseased,
                    "is_vaccinated": pet_obj.is_vaccinated,
                    "medical_history": medical_data,
                }
            })
        return Response({"found_pets": data}, status=status.HTTP_200_OK)
    

class UserLostPetsAPIView(APIView):
    """
    An API endpoint that returns a list of lost pets reported
    by the currently authenticated user.
    """
    permission_classes = [IsAuthenticated] # Ensures only logged-in users can access

    def get(self, request):
        # Filter PetReport objects by the current user and where the pet status is 'Lost'
        reports = PetReport.objects.filter(
        user=request.user,          # ✅ Filters for the currently logged-in user
        pet_status="Lost",          # ✅ Filters for reports where the pet is 'Lost'
        report_status="Accepted"    # ✅ Filters for reports that have been 'Accepted'
        ).order_by("-created_date")

        data = []
        for report in reports:
            pet_obj = report.pet
            medical_history = PetMedicalHistory.objects.filter(pet=pet_obj).first()
            
            medical_data = {
                "last_vaccinated_date": medical_history.last_vaccinated_date.isoformat() if medical_history and medical_history.last_vaccinated_date else None,
                "vaccination_name": medical_history.vaccination_name if medical_history else None,
                "disease_name": medical_history.disease_name if medical_history else None,
                "stage": medical_history.stage if medical_history else None,
                "no_of_years": medical_history.no_of_years if medical_history else None,
            }
            
            data.append({
                "report_id": report.id,
                "report_status": report.report_status,
                "pet_status": report.pet_status,
                "image": report.image.url if report.image else None,
                "created_date": report.created_date.isoformat(),
                "pet": {
                    "id": pet_obj.id,
                    "name": pet_obj.name,
                    "pet_type": str(pet_obj.pet_type) if pet_obj.pet_type else None,
                    "breed": pet_obj.breed,
                    "age": pet_obj.age,
                    "description": pet_obj.description,
                    "color": pet_obj.color,
                    "address": pet_obj.address, 
                    "city": pet_obj.city,
                    "state": pet_obj.state,
                    "gender": pet_obj.gender,
                    "is_diseased": pet_obj.is_diseased,
                    "is_vaccinated": pet_obj.is_vaccinated,
                    "medical_history": medical_data,
                    
                }
            })

        # Use the same response structure as the other endpoint
        return Response({"lost_pets": data}, status=status.HTTP_200_OK)
    
class UserFoundPetsAPIView(APIView):
    """
    An API endpoint that returns a list of found pets reported
    by the currently authenticated user.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Filter reports by the current user and for 'Found' pets
        reports = PetReport.objects.filter(user=request.user, pet_status="Found", report_status="Accepted").order_by("-created_date")

        data = []
        for report in reports:
            pet_obj = report.pet
            medical_history = PetMedicalHistory.objects.filter(pet=pet_obj).first()
            
            medical_data = {
                "last_vaccinated_date": medical_history.last_vaccinated_date.isoformat() if medical_history and medical_history.last_vaccinated_date else None,
                "vaccination_name": medical_history.vaccination_name if medical_history else None,
                "disease_name": medical_history.disease_name if medical_history else None,
                "stage": medical_history.stage if medical_history else None,
                "no_of_years": medical_history.no_of_years if medical_history else None,
            }
            
            data.append({
                "report_id": report.id,
                "report_status": report.report_status,
                "pet_status": report.pet_status,
                "image": report.image.url if report.image else None,
                "created_date": report.created_date.isoformat(),
                "pet": {
                    "id": pet_obj.id,
                    "name": pet_obj.name,
                    "pet_type": str(pet_obj.pet_type) if pet_obj.pet_type else None,
                    "breed": pet_obj.breed,
                    "age": pet_obj.age,
                    "description": pet_obj.description,
                    "color": pet_obj.color,
                    "address": pet_obj.address, 
                    "city": pet_obj.city,
                    "state": pet_obj.state,
                    "gender": pet_obj.gender,
                    "is_diseased": pet_obj.is_diseased,
                    "is_vaccinated": pet_obj.is_vaccinated,
                    "medical_history": medical_data,
                }
            })
        
        # We'll use the same response key 'found_pets' for consistency
        return Response({"found_pets": data}, status=status.HTTP_200_OK)
    
class AdoptionPetsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # Fetch all PetAdoption entries (you can filter by status if needed)
        adoption_requests = PetAdoption.objects.all()
        serializer = PetAdoptionSerializer(adoption_requests, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserPetAdoptionsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_adoptions = PetAdoption.objects.filter(requestor=request.user).order_by("-created_date")

        # ✅ USE THE NEW, DETAILED SERIALIZER
        serializer = UserAdoptionDetailSerializer(user_adoptions, many=True, context={'request': request})
        
        return Response(serializer.data, status=status.HTTP_200_OK)

class AdoptablePetsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        # time_cutoff = timezone.now() - timedelta(days=30) 
        time_cutoff = timezone.now() - timedelta(minutes=1)  # For testing, set to 1 minute
        # 2. Filter Pet Reports based on the adoption criteria
        reports = PetReport.objects.filter(
            pet_status="Found",          # Must be a found pet
            report_status="Accepted",    # The report must have been accepted by an admin
            modified_date__lte=time_cutoff  # Accepted more than 30 days ago
        ).order_by("-created_date")

        # 3. Serialize the data in the same format as your other pet list endpoints
        data = []
        for report in reports:
            pet_obj = report.pet
            medical_history = PetMedicalHistory.objects.filter(pet=pet_obj).first()
            
            medical_data = {
                "last_vaccinated_date": medical_history.last_vaccinated_date.isoformat() if medical_history and medical_history.last_vaccinated_date else None,
                "vaccination_name": medical_history.vaccination_name if medical_history else None,
                "disease_name": medical_history.disease_name if medical_history else None,
                "stage": medical_history.stage if medical_history else None,
                "no_of_years": medical_history.no_of_years if medical_history else None,
            }
            
            data.append({
                "report_id": report.id,
                "report_status": report.report_status,
                "pet_status": report.pet_status,
                "image": report.image.url if report.image else None,
                "created_date": report.created_date.isoformat(),
                "pet": {
                    "id": pet_obj.id,
                    "name": pet_obj.name,
                    "pet_type": str(pet_obj.pet_type) if pet_obj.pet_type else None,
                    "breed": pet_obj.breed,
                    "age": pet_obj.age,
                    "color": pet_obj.color,
                    "address": pet_obj.address, 
                    "description": pet_obj.description,
                    "city": pet_obj.city,
                    "state": pet_obj.state,
                    "pincode": pet_obj.pincode,
                    "gender": pet_obj.gender,
                    "is_diseased": pet_obj.is_diseased,
                    "is_vaccinated": pet_obj.is_vaccinated,
                    "medical_history": medical_data,
                }
            })
            
        # Use a new key 'adoptable_pets' for clarity on the frontend
        return Response({"adoptable_pets": data}, status=status.HTTP_200_OK)


# -------------------------
# Recent Pets ViewSet
# -------------------------
class RecentPetsAPIView(APIView):
    """
    API to fetch 10 most recently added pets.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        pets = Pet.objects.all().order_by('-created_date')[:10]
        serializer = PetSerializer(pets, many=True, context={"request": request})
        return Response({
            "recent_pets": serializer.data
        }, status=status.HTTP_200_OK)