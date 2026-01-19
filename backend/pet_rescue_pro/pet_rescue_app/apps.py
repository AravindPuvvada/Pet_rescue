from django.apps import AppConfig


class PetRescueAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'pet_rescue_app'
    def ready(self):
        import pet_rescue_app.signals
