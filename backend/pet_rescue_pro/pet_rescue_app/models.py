# from django.db import models
# from django.contrib.auth.hashers import make_password

# class User(models.Model):
#     ROLE_CHOICES = [
#         ("ADMIN", "ADMIN"),
#         ("USER", "USER"),
#     ]
#     username = models.CharField(max_length=100, unique=True)
#     email = models.EmailField(unique=True)
#     # store hashed password (we’ll hash before saving)
#     password = models.CharField(max_length=255)
#     role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="USER")

#     def save(self, *args, **kwargs):
#         # If the password is not already hashed (very naive check), hash it
#         if not self.password.startswith("pbkdf2_"):
#             self.password = make_password(self.password)
#         super().save(*args, **kwargs)

#     def __str__(self):
#         return f"{self.username} ({self.email})"

#     class Meta:
#         db_table = "user"

# class Pet(models.Model):
#     STATUS_CHOICES = [("Lost", "Lost"), ("Found", "Found")]
#     name = models.CharField(max_length=100)
#     pet_type = models.CharField(max_length=50)
#     breed = models.CharField(max_length=100, blank=True)
#     color = models.CharField(max_length=50, blank=True)
#     location = models.CharField(max_length=200, blank=True)
#     status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Lost")
#     image = models.ImageField(upload_to="pets/", blank=True, null=True)  # <-- added

#     def __str__(self):
#         return self.name

#     class Meta:
#         db_table = "pet"

from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
from django.conf import settings

class UserManager(BaseUserManager):
    def create_user(self, email, username, password=None, role="USER"):
        if not email:
            raise ValueError("Users must have an email address")
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, role=role)
        user.set_password(password)  # hashes password
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password):
        user = self.create_user(email, username, password, role="ADMIN")
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ("ADMIN", "ADMIN"),
        ("USER", "USER"),
    ]
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="USER")
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)  # required for admin
    date_joined = models.DateTimeField(default=timezone.now)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return f"{self.username} ({self.email})"

    class Meta:
        db_table = "user"


class Pet(models.Model):
    STATUS_CHOICES = [("Lost", "Lost"), ("Found", "Found")]
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="pets")
    name = models.CharField(max_length=100)
    pet_type = models.CharField(max_length=50)
    breed = models.CharField(max_length=100, blank=True)
    color = models.CharField(max_length=50, blank=True)
    location = models.CharField(max_length=200, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Lost")
    image = models.ImageField(upload_to="pets/", blank=True, null=True)

    def __str__(self):
        return self.name
    class Meta:
        db_table = "pet"
    


