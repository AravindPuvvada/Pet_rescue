from django.contrib import admin
from django.utils.html import format_html
from .models import User, Pet

# Register User model
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email', 'role')  # only fields that exist in your model
    search_fields = ('username', 'email')
    list_filter = ('role',)
    ordering = ('username',)  # optional: order users alphabetically

# Register Pet model
@admin.register(Pet)
class PetAdmin(admin.ModelAdmin):
    list_display = list_display = ('id', 'name', 'pet_type', 'breed', 'color', 'location', 'status', 'owner', 'pet_image')
    search_fields = ('name', 'pet_type', 'breed', 'color', 'location')
    list_filter = ('status', 'pet_type')
    ordering = ('name',)  # optional: order pets alphabetically

    # Custom method to display image
    def pet_image(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="60" height="60" style="object-fit:cover;border-radius:5px;" />', obj.image.url)
        return "-"
    pet_image.short_description = "Image"
