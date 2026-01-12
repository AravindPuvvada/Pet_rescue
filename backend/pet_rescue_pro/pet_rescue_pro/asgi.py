import os
from django.core.asgi import get_asgi_application

os.environ.setdefault(
    'DJANGO_SETTINGS_MODULE',
    'pet_rescue_pro.pet_rescue_pro.settings'
)

application = get_asgi_application()
