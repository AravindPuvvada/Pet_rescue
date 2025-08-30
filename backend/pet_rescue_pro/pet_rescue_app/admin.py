from django.contrib import admin
from .models import (
    Profile, Group, PetType, Pet, PetMedicalHistory,
    PetReport, PetAdoption, Notification
)
from django.utils.html import format_html

# -------------------------
# Profile Admin
# -------------------------
@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("username", "email", "get_roles", "gender", "phone", "pincode", "profile_image_tag")
    search_fields = ("username", "email", "phone", "pincode")
    list_filter = ("gender", "role__name")  # <-- updated
    readonly_fields = ("profile_image_tag",)

    def get_roles(self, obj):
        return ", ".join([g.name for g in obj.role.all()])
    get_roles.short_description = "Roles"

    def profile_image_tag(self, obj):
        if obj.profile_image:
            return format_html('<img src="{}" style="width:50px;height:50px;border-radius:50%;" />', obj.profile_image.url)
        return "-"
    profile_image_tag.short_description = "Profile Image"


# -------------------------
# Group Admin
# -------------------------
@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


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
    list_display = ("pet", "user", "pet_status", "report_status", "is_resolved", "report_image_tag")
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
    list_display = ("pet", "requestor", "status")
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
