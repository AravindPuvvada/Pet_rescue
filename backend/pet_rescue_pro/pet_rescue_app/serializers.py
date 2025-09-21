from rest_framework import serializers
from .models import (
    Profile, PetType, Pet, PetMedicalHistory,
    PetReport, PetAdoption, Notification
)
from django.contrib.auth.hashers import make_password, check_password
from django.conf import settings

# ---------------- ProfileSerializer ----------------
class ProfileSerializer(serializers.ModelSerializer):
    profile_image = serializers.ImageField(required=False, allow_null=True)
    is_superuser = serializers.BooleanField(read_only=True)  # 👈 Add this

    class Meta:
        model = Profile
        fields = [
            "id", "username", "email", "password", "gender",
            "phone", "address", "pincode", "profile_image",
            "created_at", "updated_at", "is_superuser"  # 👈 Include here
        ]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        validated_data["password"] = make_password(validated_data["password"])
        return Profile.objects.create(**validated_data)

        

# ---------------- Pet & PetType ----------------
class PetTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetType
        fields = ["id", "type"]

# ---------------- PetSerializer ----------------
class PetSerializer(serializers.ModelSerializer):
    pet_type = serializers.CharField(max_length=50)  # Allow free text input
    created_by = ProfileSerializer(read_only=True)
    modified_by = ProfileSerializer(read_only=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = Pet
        fields = [
            "id", "name", "pet_type", "gender", "breed", "color",
            "age", "weight", "description", "address", "state", "city",
            "pincode", "image", "is_diseased", "is_vaccinated",
            "created_date", "modified_date", "created_by", "modified_by"
        ]

    def get_image(self, obj):
        if not obj.image:
            return None
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(obj.image.url)
        return f"{settings.MEDIA_URL}{obj.image.name}"
    
    def create(self, validated_data):
        # Handle pet_type as string instead of ForeignKey
        pet_type_name = validated_data.pop('pet_type', '')
        
        # Get or create PetType
        if pet_type_name:
            pet_type_obj, created = PetType.objects.get_or_create(type=pet_type_name)
            validated_data['pet_type'] = pet_type_obj
        
        return super().create(validated_data)

# ---------------- PetReportSerializer ----------------
class PetReportSerializer(serializers.ModelSerializer):
    pet = serializers.PrimaryKeyRelatedField(read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    image = serializers.ImageField(required=False, allow_null=True)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = PetReport
        fields = [
            "id", "pet", "user", "pet_status", "report_status",
            "image", "image_url", "is_resolved",
            "created_date", "modified_date", "created_by", "modified_by"
        ]

    def get_image_url(self, obj):
        if not obj.image:
            return None
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(obj.image.url)

    def create(self, validated_data):
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            validated_data["user"] = request.user
        return super().create(validated_data)



# ---------------- Pet Medical History ----------------
class PetMedicalHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PetMedicalHistory
        fields = [
            "last_vaccinated_date", "vaccination_name",
            "disease_name", "stage", "no_of_years"
        ]

    def create(self, validated_data):
        pet = self.context.get("pet")
        user = self.context.get("request").user if self.context.get("request") else None

        if not pet:
            raise serializers.ValidationError({"pet": "Pet instance is required"})

        return PetMedicalHistory.objects.create(
            pet=pet,
            created_by=user,
            modified_by=user,
            **validated_data
        )


# ---------------- Pet Adoption ----------------
class PetAdoptionSerializer(serializers.ModelSerializer):
    pet = PetSerializer(read_only=True)
    requestor = ProfileSerializer(read_only=True)
    created_by = ProfileSerializer(read_only=True)
    modified_by = ProfileSerializer(read_only=True)
    class Meta:
        model = PetAdoption
        fields = [
            "id", "pet", "requestor", "message", "status",
            "created_date", "modified_date", "created_by", "modified_by"
        ]

# ---------------- Notification ----------------
# In your serializers.py file
class NotificationSerializer(serializers.ModelSerializer):
    sender = ProfileSerializer(read_only=True)
    receiver = ProfileSerializer(read_only=True)
    pet = PetSerializer(read_only=True)
    report = PetReportSerializer(read_only=True)

    class Meta:
        model = Notification
        fields = [
            "id",             # ✅ id is now sent
            "sender",
            "receiver",
            "content",
            "pet",
            "report",
            "is_read",        # ✅ is_read is now sent
            "created_at"
        ]



# ---------------- Register ----------------
class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    gender = serializers.CharField(required=False, allow_blank=True)
    phone = serializers.CharField(required=False, allow_blank=True)
    address = serializers.CharField(required=False, allow_blank=True)
    pincode = serializers.CharField(required=False, allow_blank=True)

# ---------------- Verify Registration ----------------
class VerifyRegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=6)
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True)
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    address = serializers.CharField(max_length=255, required=False, allow_blank=True)
    pincode = serializers.CharField(max_length=10, required=False, allow_blank=True)
    gender = serializers.CharField(max_length=10, required=False, allow_blank=True)


# ---------------- Login ----------------
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

# ---------------- Password Reset Request ----------------
class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

# ---------------- Password Reset Confirm ----------------
class PasswordResetConfirmSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)
    new_password = serializers.CharField(write_only=True)



# ---------------- Lost Pet Request (Nested) ----------------
class LostPetRequestSerializer(serializers.Serializer):
    pet = PetSerializer()
    report = PetReportSerializer()
    medical_history = PetMedicalHistorySerializer(required=False)

# ---------------- AdminNotificationSerializer ----------------
class AdminNotificationSerializer(serializers.ModelSerializer):
    pet = PetSerializer(source="sender_pet", read_only=True)
    report = PetReportSerializer(source="sender_report", read_only=True)

    class Meta:
        model = Notification
        fields = ["id", "sender", "content", "pet", "report", "created_at"]



class PetReportListSerializer(serializers.ModelSerializer):
    pet = PetSerializer(read_only=True)

    class Meta:
        model = PetReport
        fields = ["id", "pet_status", "report_status", "image", "pet"]

class PetAdoptionListSerializer(serializers.ModelSerializer):
    pet = PetSerializer(read_only=True)
    requestor = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = PetAdoption
        fields = ["id", "pet", "requestor", "message", "status"]


class AdminApprovalSerializer(serializers.Serializer):
    request_type = serializers.ChoiceField(choices=["lost", "found", "adopt"])
    pet_id = serializers.IntegerField()
    action = serializers.ChoiceField(choices=["approve", "reject"])


class UserPetReportSerializer(serializers.ModelSerializer):
    pet_name = serializers.CharField(source="pet.name", read_only=True)

    class Meta:
        model = PetReport
        fields = [
            "id",
            "pet_name",
            "pet_status",     # ✅ instead of report_type
            "report_status",
            "image",
            "is_resolved",
        ]



class UserAdoptionRequestSerializer(serializers.ModelSerializer):
    pet_name = serializers.CharField(source="pet.name", read_only=True)

    class Meta:
        model = PetAdoption
        fields = ["id", "pet_name", "status"]


class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = [
            "id",
            "username",
            "email",
            "gender",
            "phone",
            "address",
            "pincode",
            "profile_image",   # ✅ from model
            "created_at",      # ✅ matches your model field
            "updated_at",      # ✅ matches your model field
            "is_active",
            "is_staff",
            "is_superuser"
        ]
        read_only_fields = ["id", "email", "created_at", "updated_at"]

class AdminPetReportSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source="user.username", read_only=True)
    pet = PetSerializer(read_only=True)
    image_url = serializers.SerializerMethodField() # ✅ Add this field

    class Meta:
        model = PetReport
        # ✅ Add 'image_url' to the list of fields
        fields = ["id", "pet", "user", "pet_status", "report_status", "image_url", "created_date", "modified_date"]

    # ✅ Add this method to generate the full image URL
    def get_image_url(self, obj):
        if obj.image and hasattr(obj.image, 'url'):
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.image.url)
        return None