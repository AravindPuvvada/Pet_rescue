from django.db import models
from django.contrib.auth.hashers import make_password
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
class BaseModel(models.Model):
    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)
    # created_by, modified_by can be nullable for existing rows
    created_by = models.ForeignKey('Profile', null=True, blank=True, on_delete=models.SET_NULL, related_name='created_%(class)s_set')
    modified_by = models.ForeignKey('Profile', null=True, blank=True, on_delete=models.SET_NULL, related_name='modified_%(class)s_set')

    class Meta:
        abstract = True

class ProfileManager(BaseUserManager):
    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError("Users must have an email address")
        if not username:
            raise ValueError("Users must have a username")

        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)
        return self.create_user(email, username, password, **extra_fields)


class Profile(AbstractBaseUser, PermissionsMixin):
    GENDER_CHOICES = [
        ("Male", "Male"),
        ("Female", "Female"),
        ("Other", "Other"),
    ]

    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    pincode = models.BigIntegerField(blank=True, null=True)
    profile_image = models.ImageField(upload_to="profile_images/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    otp = models.CharField(max_length=6, blank=True, null=True)
    is_verified = models.BooleanField(default=False)

    # 🔹 Required for Django Admin
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    objects = ProfileManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.email



class PetType(models.Model):
    type = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.type


class Pet(BaseModel):
    GENDER_CHOICES = [("Male", "Male"), ("Female", "Female")]

    name = models.CharField(max_length=100)
    pet_type = models.ForeignKey(PetType, on_delete=models.CASCADE)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES,blank=True, null=True)
    breed = models.CharField(max_length=100, blank=True, null=True)
    color = models.CharField(max_length=50, blank=True, null=True)
    age = models.IntegerField(blank=True, null=True)
    weight = models.IntegerField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    pincode = models.BigIntegerField(blank=True, null=True)
    image = models.ImageField(upload_to="pet_images/", blank=True, null=True)
    is_diseased = models.BooleanField(default=False)
    is_vaccinated = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class PetMedicalHistory(BaseModel):
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE, related_name="medical_history")
    last_vaccinated_date = models.DateField(blank=True, null=True)
    vaccination_name = models.CharField(max_length=100, blank=True, null=True)
    disease_name = models.CharField(max_length=100, blank=True, null=True)
    stage = models.IntegerField(blank=True, null=True)
    no_of_years = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return f"{self.pet.name} Medical History"


class PetReport(BaseModel):
    PET_STATUS_CHOICES = [("Lost", "Lost"), ("Found", "Found"), ("Adopted", "Adopted")]
    REPORT_STATUS_CHOICES = [("Pending", "Pending"), ("Accepted", "Accepted"),("Rejected", "Rejected"), ("Resolved", "Resolved"), ("Reunited", "Reunited")]

    pet = models.ForeignKey(Pet, on_delete=models.CASCADE, related_name="reports")
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    pet_status = models.CharField(max_length=20, choices=PET_STATUS_CHOICES)
    report_status = models.CharField(max_length=20, choices=REPORT_STATUS_CHOICES, default="Pending")
    image = models.ImageField(upload_to="report_images/", blank=True, null=True)
    is_resolved = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.pet.name} - {self.pet_status}"


class PetAdoption(BaseModel):
    STATUS_CHOICES = [("Pending", "Pending"), ("Approved", "Approved"), ("Rejected", "Rejected")]

    pet = models.ForeignKey(Pet, on_delete=models.CASCADE)
    requestor = models.ForeignKey(Profile, on_delete=models.CASCADE)
    message = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Pending")

    def __str__(self):
        return f"Adoption Request for {self.pet.name} by {self.requestor.username}"


class Notification(models.Model):
    sender = models.ForeignKey(Profile, on_delete=models.CASCADE)  # Who created/sent the notification
    receiver = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="notifications", null=True, blank=True)  
    # ← NEW: Who should receive the notification

    content = models.TextField()
    
    pet = models.ForeignKey(Pet, on_delete=models.SET_NULL, null=True, blank=True)  
    # ← Already exists: links notification to a specific pet

    report = models.ForeignKey(PetReport, on_delete=models.SET_NULL, null=True, blank=True)  
    # ← Already exists: links notification to a specific pet report

    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        receiver_name = self.receiver.username if self.receiver else "Unknown"
        return f"Notification from {self.sender.username} to {receiver_name}"
    

class RewardPoint(models.Model):
    BADGES = [
        ("Starter", 0),
        ("Bronze", 100),
        ("Silver", 200),
        ("Gold", 500),
        ("Platinum", 1000),
    ]

    user = models.OneToOneField(Profile, on_delete=models.CASCADE)
    points = models.IntegerField(default=0)
    badge = models.CharField(max_length=50, default="Starter")
    reason = models.CharField(max_length=255, blank=True, null=True)  # renamed field

    def add_points(self, points: int, reason: str):
        """
        Add points to this user and update badge.
        Store the reason in reason.
        """
        self.points += points
        self.reason = reason
        self.update_badge()
        self.save()

    def update_badge(self):
        for name, score in reversed(self.BADGES):
            if self.points >= score:
                self.badge = name
                break

    def _str_(self):
        return f"{self.user.username} - {self.points} Points - {self.badge} ({self.reason})"


class FeedbackStory(models.Model):
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    story = models.TextField()
    pet_name = models.CharField(max_length=100)
    submitted_at = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(
        upload_to="feedback_stories/",  # path inside MEDIA_ROOT
        null=True,
        blank=True
    )

    def _str_(self):
        return f"{self.user} - {self.title}"
    
class UserReport(BaseModel):
    """
    Represents a report submitted by a user about an existing PetReport.
    This can be a 'Sighting', 'Reclaim', or 'Adoption' request.
    """
    REPORT_TYPE_CHOICES = [
        ("Sighting", "Sighting"),
        ("Reclaim", "Reclaim"),
        ("Adoption", "Adoption"),
    ]
    
    # Define the new status choices
    REPORT_STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Accepted", "Accepted"),
        ("Rejected", "Rejected"),
        ("Reunited", "Reunited"),
        ("Resolved", "Resolved"), 
    ]


    pet_report = models.ForeignKey(PetReport, on_delete=models.CASCADE, related_name="user_reports")

    pet_report_creator = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="submitted_reports")
    
    report_type = models.CharField(max_length=20, choices=REPORT_TYPE_CHOICES)
    message = models.TextField(blank=False, null=False)
    report_status = models.CharField(max_length=20, choices=REPORT_STATUS_CHOICES, default="Pending")

    def _str_(self):
        return f"{self.report_type} report for Pet Report #{self.pet_report.id}"