from rest_framework import serializers
from .models import (
    Profile, PetType, Pet, PetMedicalHistory,
    PetReport, PetAdoption, Notification, RewardPoint, FeedbackStory, UserReport
)
from django.contrib.auth.hashers import make_password, check_password
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
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
        """
        Return an absolute URL to the pet image.

        Priority:
        1) pet.image (existing behavior)
        2) latest related PetReport.image (new fallback)
        3) None
        """
        request = self.context.get("request")

        # 1) Prefer pet.image if present
        try:
            if getattr(obj, "image", None):
                # CHANGED: safe attempt to return absolute URL when request is provided
                if request:
                    return request.build_absolute_uri(obj.image.url)
                return f"{settings.MEDIA_URL}{obj.image.name}"
        except Exception:
            # defensive: if obj.image exists but something odd happens, continue to fallback
            pass

        # 2) Fallback -> latest report image (if any)
        try:
            reports_manager = getattr(obj, "reports", None)
            if reports_manager is not None:
                latest_report = reports_manager.order_by("-created_date").first()
                if latest_report and getattr(latest_report, "image", None):
                    if request:
                        return request.build_absolute_uri(latest_report.image.url)
                    # If no request in context, return relative/report url (best-effort)
                    return getattr(latest_report.image, "url", None)
        except Exception:
            # don't raise — just return None (keeps backward compatible behavior)
            pass

        # 3) Nothing found
        return None

    def create(self, validated_data):
        """
        CHANGED: Re-introduced create() to support creating Pet from a string pet_type.
        This was present in the working (old) serializer — missing create() causes creation
        flows to fail when frontend posts {"pet_type": "Dog", ...}.
        """
        pet_type_name = validated_data.pop("pet_type", "")
        if pet_type_name:
            pet_type_obj, _ = PetType.objects.get_or_create(type=pet_type_name)
            validated_data["pet_type"] = pet_type_obj
        return super().create(validated_data)

    def update(self, instance, validated_data):
        """
        Handle pet_type string -> PetType instance on updates too.
        Keep rest of update behavior unchanged.
        """
        pet_type_name = validated_data.pop("pet_type", None)
        if pet_type_name is not None:
            pet_type_obj, _ = PetType.objects.get_or_create(type=pet_type_name)
            # Put the actual object into validated_data so super().update assigns FK correctly
            validated_data["pet_type"] = pet_type_obj

        return super().update(instance, validated_data)

# ---------------- PetReportSerializer ----------------
class PetReportSerializer(serializers.ModelSerializer):
    pet = serializers.PrimaryKeyRelatedField(read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    image = serializers.ImageField(required=False, allow_null=True)
    image_url = serializers.SerializerMethodField()
    gender = serializers.CharField(source="pet.gender", read_only=True)
    class Meta:
        model = PetReport
        fields = [
            "id", "pet", "user", "pet_status", "report_status",
            "image", "image_url", "is_resolved",
            "created_date", "modified_date", "created_by", "modified_by","gender"
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
    # This field is for reading data (GET requests)
    pet = PetSerializer(read_only=True)
    
    # This field is for writing data (POST requests)
    pet_id = serializers.PrimaryKeyRelatedField(
        queryset=Pet.objects.all(), 
        source='pet', 
        write_only=True
    )
    
    # This field is for reading the user who made the request
    requestor = ProfileSerializer(read_only=True)
    
    # ✅ ADD THESE TWO LINES TO EXPOSE THE AUDIT FIELDS
    created_by = ProfileSerializer(read_only=True)
    modified_by = ProfileSerializer(read_only=True)

    class Meta:
        model = PetAdoption
        fields = [
            "id", 
            "pet",          # For reading
            "pet_id",       # For writing
            "requestor", 
            "message", 
            "status",
            "created_date", 
            "modified_date",
            "created_by",   # ✅ ADD THIS
            "modified_by"   # ✅ ADD THIS
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

class UserAdoptionDetailSerializer(serializers.ModelSerializer):
    """
    Custom serializer for a user's adoption requests.
    It fetches the pet's image from its most recent report
    and includes its medical history.
    """
    # This will hold our custom-structured pet data
    pet = serializers.SerializerMethodField()

    class Meta:
        model = PetAdoption
        fields = [
            "id",             # The adoption request ID
            "status",         # The adoption status
            "message", # The user's message
            "created_date",       
            "pet"             # The nested pet details
        ]

    def get_pet(self, adoption_obj):
        # Get the related Pet instance from the adoption object
        pet = adoption_obj.pet

        # Find the most recent report associated with this pet
        report = PetReport.objects.filter(pet=pet).order_by('-created_date').first()

        # Find the medical history for this pet
        medical_history = PetMedicalHistory.objects.filter(pet=pet).first()

        # Get the request context to build full URLs
        request = self.context.get('request')
        image_url = None

        # ✅ Get the image URL from the REPORT, not the pet
        if report and report.image and hasattr(report.image, 'url'):
            image_url = request.build_absolute_uri(report.image.url)

        # Serialize medical data if it exists
        medical_data = PetMedicalHistorySerializer(medical_history).data if medical_history else None

        # Construct the final pet object for the API response
        return {
            'id': pet.id,
            'name': pet.name,
            'pet_type': str(pet.pet_type) if pet.pet_type else None,
            'gender': pet.gender,
            'breed': pet.breed,
            'color': pet.color,
            'age': pet.age,
            'weight': pet.weight,
            'description': pet.description,
            'city': pet.city,          # ✅ ADD city
            'state': pet.state,        # ✅ ADD state
            'is_diseased': pet.is_diseased,
            'is_vaccinated': pet.is_vaccinated,
            'modified_date': pet.modified_date,
            'image': image_url,  # The image URL from the report
            'medical_history': medical_data  # The nested medical history
        }
    
class RewardPointSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = RewardPoint
        fields = ['user', 'username', 'email', 'points', 'badge', 'reason']

class FeedbackStorySerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    # keep this for upload
    image = serializers.ImageField(required=False, allow_null=True)
    # expose an absolute URL for clients
    image_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = FeedbackStory
        fields = [
            "id", "user",
            "title", "story", "pet_name",
            "submitted_at", "image", "image_url"
        ]

    def get_image_url(self, obj):
        if not obj.image:
            return None
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(obj.image.url)
        return settings.MEDIA_URL + obj.image.name
    
class UserReportSerializer(serializers.ModelSerializer):
    """
    Serializer for admins to READ UserReport instances.
    """
    # RENAME this nested serializer
    pet_report_creator = ProfileSerializer(read_only=True)
    pet_report = AdminPetReportSerializer(read_only=True)
    created_by = ProfileSerializer(read_only=True)  
    modified_by = ProfileSerializer(read_only=True) 

    class Meta:
        model = UserReport
        fields = [
            "id",
            "pet_report",
            "pet_report_creator", 
            "report_type",
            "message",
            "report_status",
            "created_date",
            "modified_date",
            "created_by",  
            "modified_by",
        ]
        read_only_fields = fields


class UserReportCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for users to CREATE a new UserReport.
    It includes validation for business logic.
    """
    pet_report_id = serializers.PrimaryKeyRelatedField(
        queryset=PetReport.objects.filter(report_status="Accepted"),
        source='pet_report',
        write_only=True,
        label="Pet Report ID"
    )

    class Meta:
        model = UserReport
        fields = [
            "pet_report_id",
            "report_type",
            "message",
        ]

    def validate(self, data):
        """
        Custom validation to ensure:
        - "Sighting" is for "Lost" pets.
        - "Reclaim" is for "Found" pets by the original owner.
        - "Adoption" is for "Found" pets that are adoptable.
        """
        pet_report = data.get('pet_report')
        report_type = data.get('report_type')
        request_user = self.context.get('request').user

        if report_type == "Sighting":
            if pet_report.pet_status != "Lost":
                raise serializers.ValidationError({"report_type": "A 'Sighting' report can only be submitted for a 'Lost' pet."})

        elif report_type == "Reclaim":
            if pet_report.pet_status != "Found":
                raise serializers.ValidationError({"report_type": "A 'Reclaim' request can only be made for a 'Found' pet."})
            

        elif report_type == "Adoption":
            if pet_report.pet_status != "Found":
                raise serializers.ValidationError({"report_type": "An 'Adoption' request can only be made for a 'Found' pet."})

            # Optional: Check if the pet is old enough to be adopted (e.g., found > 30 days ago)
            time_cutoff = timezone.now() - timedelta(days=30)
            if pet_report.modified_date > time_cutoff:
                 raise serializers.ValidationError({"pet_report_id": "This pet is not yet available for adoption."})

            # Check if the user is trying to adopt their own reported pet
            if pet_report.user == request_user:
                 raise serializers.ValidationError({"user": "You cannot submit an adoption request for a pet you reported."})

            # Check if an active adoption request already exists for this pet from the same user
            # Note: This checks the original PetAdoption model to prevent duplicate requests system-wide.
            if PetAdoption.objects.filter(pet=pet_report.pet, requestor=request_user, status__in=["Pending", "Approved"]).exists():
                 raise serializers.ValidationError({"pet_report_id": "You already have an active adoption request for this pet."})

        return data