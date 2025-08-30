from django.db import models
from django.contrib.auth.hashers import make_password
from django.utils import timezone

class BaseModel(models.Model):
    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)
    # created_by, modified_by can be nullable for existing rows
    created_by = models.ForeignKey('Profile', null=True, blank=True, on_delete=models.SET_NULL, related_name='created_%(class)s_set')
    modified_by = models.ForeignKey('Profile', null=True, blank=True, on_delete=models.SET_NULL, related_name='modified_%(class)s_set')

    class Meta:
        abstract = True



class Group(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Profile(models.Model):
    GENDER_CHOICES = [
        ("Male", "Male"),
        ("Female", "Female"),
        ("Other", "Other"),
    ]

    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)  # store hashed password
    role = models.ManyToManyField(Group)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    pincode = models.BigIntegerField(blank=True, null=True)
    profile_image = models.ImageField(upload_to="profile_images/", blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.password.startswith("pbkdf2_"):  # hash only if not hashed
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username


class PetType(models.Model):
    type = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.type


class Pet(BaseModel):
    GENDER_CHOICES = [("Male", "Male"), ("Female", "Female")]

    name = models.CharField(max_length=100)
    pet_type = models.ForeignKey(PetType, on_delete=models.CASCADE)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
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
    REPORT_STATUS_CHOICES = [("Pending", "Pending"), ("Accepted", "Accepted"), ("Resolved", "Resolved"), ("Reunited", "Reunited")]

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


class Notification(BaseModel):
    sender = models.ForeignKey(Profile, on_delete=models.CASCADE)
    content = models.TextField()
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"Notification from {self.sender.username}"
