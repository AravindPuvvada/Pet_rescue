# # pet_rescue_app/utils.py
# import random
# from django.core.cache import cache
# from django.core.mail import send_mail
# from django.conf import settings

# def generate_otp(email):
#     otp = str(random.randint(100000, 999999))
#     cache.set(f"otp_{email}", otp, timeout=600)  # valid 10 mins
#     return otp

# def send_otp_email(email, purpose="verification"):
#     otp = generate_otp(email)
#     subject = f"{purpose.capitalize()} OTP from Pet Rescue Team"
#     message = (
#         f"Hello,\n\n"
#         f"Your One-Time Password (OTP) for {purpose} is:\n\n"
#         f"        {otp}\n\n"
#         f"This OTP is valid for 10 minutes. Please do not share it with anyone.\n\n"
#         f"Thank you,\n"
#         f"The Pet Rescue Team"
#     )
#     send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [email])
#     return otp

# def verify_otp(email, submitted_otp):
#     stored_otp = cache.get(f"otp_{email}")
#     if stored_otp and stored_otp == submitted_otp:
#         cache.delete(f"otp_{email}")  # remove once used
#         return True
#     return False

import random
from django.core.cache import cache
from django.core.mail import EmailMultiAlternatives
from django.conf import settings


def generate_otp(email: str) -> str:
    """Generate a 6-digit OTP and store it in cache (valid for 10 minutes)."""
    otp = str(random.randint(100000, 999999))
    cache.set(f"otp_{email}", otp, timeout=600)  # 10 minutes
    return otp


def verify_otp(email: str, submitted_otp: str) -> bool:
    """Check if submitted OTP matches stored OTP in cache."""
    stored_otp = cache.get(f"otp_{email}")
    if stored_otp and stored_otp == submitted_otp:
        cache.delete(f"otp_{email}")  # remove once used
        return True
    return False


def send_otp_email(email: str, purpose: str = "verification", otp: str = None) -> str:
    """
    Send OTP email with professional HTML body and plain text fallback.
    If otp is provided, use it; otherwise generate a new OTP.
    """
    if otp is None:
        otp = generate_otp(email)
    else:
        # Store the provided OTP in cache for verification if needed
        cache.set(f"otp_{email}", otp, timeout=600)

    subject = f"{purpose.capitalize()} OTP – Pet Rescue Team"

    # Plain text fallback
    text_content = (
        f"Dear User,\n\n"
        f"We received a request for {purpose} on your Pet Rescue account.\n\n"
        f"Your One-Time Password (OTP) is: {otp}\n\n"
        f"This OTP will remain valid for 10 minutes. "
        f"If you did not request this, please ignore this email.\n\n"
        f"For your security, please do not share this OTP with anyone.\n\n"
        f"Warm regards,\n"
        f"Pet Rescue Support Team\n"
        f"----------------------------------------\n"
        f"Pet Rescue – Helping Pets Find Their Way Home\n"
        f"Contact: support@petrescue.com\n"
        f"Website: https://petrescue.com\n"
    )

    # HTML email body
    html_content = f"""
    <html>
    <body style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; padding: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #476C7C; text-align: center;">Pet Rescue Team</h2>
            <p>Dear User,</p>
            <p>We received a request for <b>{purpose}</b> on your Pet Rescue account.</p>
            <p style="font-size: 16px;">Your One-Time Password (OTP) is:</p>
            <p style="font-size: 24px; font-weight: bold; text-align: center; color: #E77B32; letter-spacing: 2px;">
                {otp}
            </p>
            <p>This OTP is valid for <b>10 minutes</b>. If you did not request this, you can safely ignore this email.</p>
            <p style="color: #555; font-size: 14px;">⚠ For your security, please <b>do not share</b> this OTP with anyone.</p>
            <br/>
            <p>Warm regards,<br/>Pet Rescue Support Team</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
            <p style="font-size: 12px; text-align: center; color: #888;">
                Pet Rescue – Helping Pets Find Their Way Home<br/>
                Contact: <a href="mailto:support@petrescue.com">support@petrescue.com</a><br/>
                Website: <a href="https://petrescue.com">https://petrescue.com</a>
            </p>
        </div>
    </body>
    </html>
    """

    # Send email using EmailMultiAlternatives
    msg = EmailMultiAlternatives(subject, text_content, settings.DEFAULT_FROM_EMAIL, [email])
    msg.attach_alternative(html_content, "text/html")
    msg.send()

    return otp

