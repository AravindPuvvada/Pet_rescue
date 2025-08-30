from rest_framework import serializers
from .models import User, Pet
from django.contrib.auth.hashers import make_password, check_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "role"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        validated_data["password"] = make_password(validated_data["password"])
        return super().create(validated_data)


class PetSerializer(serializers.ModelSerializer):
    # Return full URL for image
    image = serializers.SerializerMethodField()

    class Meta:
        model = Pet
        fields = ['id', 'name', 'pet_type', 'breed', 'color', 'location', 'status', 'image']

    def get_image(self, obj):
        request = self.context.get("request")
        if obj.image:
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
