from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.contrib.auth import get_user_model

@receiver(post_migrate)
def create_admin(sender, **kwargs):
    User = get_user_model()

    if not User.objects.filter(email="admin@123.com").exists():
        User.objects.create_superuser(
            email="admin@123.com",
            password="admin123"
        )
