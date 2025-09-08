from rest_framework import serializers
from .models import (
    Profile, PetType, Pet, PetMedicalHistory,
    PetReport, PetAdoption, Notification
)

from django.contrib.auth.hashers import make_password, check_password

class ProfileSerializer(serializers.ModelSerializer):
    profile_image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Profile
        fields = [
            "id", "username", "email", "password", "gender",
            "phone", "address", "pincode", "profile_image",
            "created_at", "updated_at"
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

class PetSerializer(serializers.ModelSerializer):
    pet_type = serializers.SlugRelatedField(
        queryset=PetType.objects.all(),
        slug_field="type"  # use the 'type' field of PetType
    )
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
        request = self.context.get("request")
        if obj.image:
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None

class PetReportSerializer(serializers.ModelSerializer):
    pet = serializers.PrimaryKeyRelatedField(queryset=Pet.objects.all())  # Accept pet ID from frontend
    user = serializers.PrimaryKeyRelatedField(read_only=True)  # Automatically set
    image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = PetReport
        fields = [
            "id", "pet", "user", "pet_status", "report_status",
            "image", "is_resolved",
            "created_date", "modified_date", "created_by", "modified_by"
        ]

    def create(self, validated_data):
        # Set the user from request
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            validated_data["user"] = request.user
        return super().create(validated_data)


# ---------------- Pet Medical History ----------------
class PetMedicalHistorySerializer(serializers.ModelSerializer):
    pet = PetSerializer(read_only=True)

    class Meta:
        model = PetMedicalHistory
        fields = [
            "id", "pet", "last_vaccinated_date", "vaccination_name",
            "disease_name", "stage", "no_of_years",
            "created_date", "modified_date", "created_by", "modified_by"
        ]



# ---------------- Pet Adoption ----------------
class PetAdoptionSerializer(serializers.ModelSerializer):
    pet = PetSerializer(read_only=True)
    requestor = ProfileSerializer(read_only=True)

    class Meta:
        model = PetAdoption
        fields = [
            "id", "pet", "requestor", "message", "status",
            "created_date", "modified_date", "created_by", "modified_by"
        ]


# ---------------- Notification ----------------
class NotificationSerializer(serializers.ModelSerializer):
    sender = ProfileSerializer(read_only=True)

    class Meta:
        model = Notification
        fields = ["id", "sender", "content", "is_read",
                  "created_date", "modified_date", "created_by", "modified_by"]


# ---------------- Login Serializer ----------------
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
