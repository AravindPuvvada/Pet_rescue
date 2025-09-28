from django.contrib import admin
from .models import (
    Profile, PetType, Pet, PetMedicalHistory,
    PetReport, PetAdoption, Notification, UserReport, FeedbackStory
)
from django.utils.html import format_html


# -------------------------
# Profile Admin
# -------------------------
# @admin.register(Profile)
# class ProfileAdmin(admin.ModelAdmin):
#     list_display = ("username", "email", "gender", "phone", "pincode", "profile_image_tag")
#     search_fields = ("username", "email", "phone", "pincode")
#     list_filter = ("gender",)
#     readonly_fields = ("profile_image_tag",)

#     def profile_image_tag(self, obj):
#         if obj.profile_image:
#             return format_html('<img src="{}" style="width:50px;height:50px;border-radius:50%;" />', obj.profile_image.url)
#         return "-"
#     profile_image_tag.short_description = "Profile Image"
from django.contrib.auth.admin import UserAdmin
@admin.register(Profile)
class ProfileAdmin(UserAdmin):
    model = Profile
    list_display = ("username", "email", "gender", "phone", "pincode", "profile_image_tag", "is_verified", "is_active","otp")
    search_fields = ("username", "email", "phone", "pincode")
    list_filter = ("gender", "is_staff", "is_active", "is_superuser")
    readonly_fields = ("profile_image_tag",)

    # 🔹 Define image preview
    def profile_image_tag(self, obj):
        if obj.profile_image:
            return format_html('<img src="{}" style="width:50px;height:50px;border-radius:50%;" />', obj.profile_image.url)
        return "-"
    profile_image_tag.short_description = "Profile Image"

    # 🔹 Field arrangement
    fieldsets = (
        (None, {"fields": ("email", "username", "password")}),
        ("Personal Info", {"fields": ("gender", "phone", "address", "pincode", "profile_image", "profile_image_tag")}),
        ("Permissions", {"fields": ("is_staff", "is_active", "is_superuser", "groups", "user_permissions")}),
        ("Important Dates", {"fields": ("last_login",)}),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "username", "password1", "password2", "is_staff", "is_active"),
        }),
    )

    ordering = ("email",)


# -------------------------
# PetType Admin
# -------------------------
@admin.register(PetType)
class PetTypeAdmin(admin.ModelAdmin):
    list_display = ("type",)
    search_fields = ("type",)


# -------------------------
# Pet Admin
# -------------------------
@admin.register(Pet)
class PetAdmin(admin.ModelAdmin):
    list_display = ("name", "pet_type", "gender", "breed", "age", "is_diseased", "is_vaccinated", "pet_image_tag")
    search_fields = ("name", "breed", "color", "city", "state")
    list_filter = ("pet_type", "gender", "is_diseased", "is_vaccinated")
    readonly_fields = ("pet_image_tag",)

    def pet_image_tag(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="width:60px;height:60px;" />', obj.image.url)
        return "-"
    pet_image_tag.short_description = "Pet Image"


# -------------------------
# PetMedicalHistory Admin
# -------------------------
@admin.register(PetMedicalHistory)
class PetMedicalHistoryAdmin(admin.ModelAdmin):
    list_display = ("pet", "vaccination_name", "disease_name", "stage", "no_of_years", "last_vaccinated_date")
    search_fields = ("pet__name", "vaccination_name", "disease_name")
    list_filter = ("stage",)


# -------------------------
# PetReport Admin
# -------------------------
@admin.register(PetReport)
class PetReportAdmin(admin.ModelAdmin):
    list_display = ("pet_id","pet", "user", "pet_status", "report_status", "is_resolved", "report_image_tag","created_date")
    search_fields = ("pet__name", "user__username")
    list_filter = ("pet_status", "report_status", "is_resolved")
    readonly_fields = ("report_image_tag",)
    
    def report_image_tag(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="width:60px;height:60px;" />', obj.image.url)
        return "-"
    report_image_tag.short_description = "Report Image"


# -------------------------
# PetAdoption Admin
# -------------------------
@admin.register(PetAdoption)
class PetAdoptionAdmin(admin.ModelAdmin):
    list_display = ("pet_id","pet", "requestor", "status")
    search_fields = ("pet__name", "requestor__username")
    list_filter = ("status",)


# -------------------------
# Notification Admin
# -------------------------
@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("sender", "content", "is_read")
    search_fields = ("sender__username", "content")
    list_filter = ("is_read",)


@admin.register(UserReport)
class UserReportAdmin(admin.ModelAdmin):
    # Change 'user' to 'pet_report_creator' in this list
    list_display = ('id', 'pet_report', 'pet_report_creator', 'report_type', 'report_status', 'created_by')
    
    # Also update any other places that might reference 'user'
    list_filter = ('report_status', 'report_type')
    search_fields = ('pet_report_petname', 'pet_report_creator_email') # Check if you have search_fields


@admin.register(FeedbackStory)
class FeedbackStoryAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "title", "pet_name", "submitted_at", "has_image")
    list_filter = ("submitted_at", "user")
    search_fields = ("title", "story", "pet_name", "user__user__username")  # user__user if Profile links to User
    readonly_fields = ("submitted_at",)
    
    def has_image(self, obj):
        return bool(obj.image)
    has_image.boolean = True
    has_image.short_description = "Image Uploaded"