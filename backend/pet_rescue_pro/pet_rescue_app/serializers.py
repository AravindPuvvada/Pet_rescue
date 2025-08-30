from rest_framework import serializers
from .models import Profile, Group, PetType, Pet, PetMedicalHistory, PetReport, PetAdoption, Notification
from django.contrib.auth.hashers import make_password, check_password


# ---------------- Profile & Group ----------------
class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ["id", "name"]


# class ProfileSerializer(serializers.ModelSerializer):
#     role = GroupSerializer(many=True, read_only=True)
#     profile_image = serializers.SerializerMethodField()

#     class Meta:
#         model = Profile
#         fields = [
#             "id", "username", "email", "password", "role", "gender",
#             "phone", "address", "pincode", "profile_image"
#         ]
#         extra_kwargs = {"password": {"write_only": True}}

#     def create(self, validated_data):
#         validated_data["password"] = make_password(validated_data["password"])
#         return super().create(validated_data)

#     def get_profile_image(self, obj):
#         request = self.context.get("request")
#         if obj.profile_image:
#             return request.build_absolute_uri(obj.profile_image.url) if request else obj.profile_image.url
#         return None
# class ProfileSerializer(serializers.ModelSerializer):
#     role = serializers.CharField(write_only=True)  # accept role name from frontend
#     profile_image = serializers.ImageField(required=False, allow_null=True)

#     class Meta:
#         model = Profile
#         fields = [
#             "id", "username", "email", "password", "role", "gender",
#             "phone", "address", "pincode", "profile_image"
#         ]
#         extra_kwargs = {"password": {"write_only": True}}

#     def create(self, validated_data):
#         role_name = validated_data.pop('role')
#         validated_data['password'] = make_password(validated_data['password'])
#         profile = Profile.objects.create(**validated_data)
#         # Assign role if exists
#         try:
#             group = Group.objects.get(name=role_name)
#             profile.role.add(group)
#         except Group.DoesNotExist:
#             pass
#         return profile

class ProfileSerializer(serializers.ModelSerializer):
    role = serializers.CharField(write_only=True)  # role comes from frontend
    profile_image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Profile
        fields = [
            "id", "username", "email", "password", "role", "gender",
            "phone", "address", "pincode", "profile_image"
        ]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        role_name = validated_data.pop('role')
        validated_data['password'] = make_password(validated_data['password'])
        profile = Profile.objects.create(**validated_data)

        # Assign role
        try:
            group = Group.objects.get(name=role_name)
            profile.role.add(group)
        except Group.DoesNotExist:
            pass

        return profile


# ---------------- Pet & PetType ----------------
class PetTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetType
        fields = ["id", "type"]


class PetSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    pet_type = PetTypeSerializer(read_only=True)

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


# ---------------- Pet Report ----------------
class PetReportSerializer(serializers.ModelSerializer):
    pet = PetSerializer(read_only=True)
    user = ProfileSerializer(read_only=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = PetReport
        fields = [
            "id", "pet", "user", "pet_status", "report_status",
            "image", "is_resolved",
            "created_date", "modified_date", "created_by", "modified_by"
        ]

    def get_image(self, obj):
        request = self.context.get("request")
        if obj.image:
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None


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
