import logging
from typing import Optional
from urllib.parse import urljoin


def send_password_reset_email(email: str, reset_token: str, frontend_url: Optional[str] = None) -> bool:
    """
    Send a password reset email to the user.

    For MVP: logs the reset link to console instead of sending actual email.
    In production: would integrate with an SMTP service or email provider.
    """
    if frontend_url is None:
        frontend_url = "http://localhost:3000"

    reset_link = urljoin(frontend_url, f"/reset-password?token={reset_token}")

    # MVP: Log the reset link instead of sending email
    logging.info(f"Password reset requested for {email}")
    logging.info(f"Password reset link: {reset_link}")

    # In production, this would use an SMTP client or email service:
    # smtp_client.send_mail(
    #     to=email,
    #     subject="Password Reset Request",
    #     body=f"Click this link to reset your password: {reset_link}"
    # )

    return True


def send_welcome_email(email: str) -> bool:
    """Send a welcome email to a new user."""
    logging.info(f"Welcome email would be sent to {email} in production")
    return True


def send_notification_email(email: str, subject: str, message: str) -> bool:
    """Send a notification email to a user."""
    logging.info(f"Notification email would be sent to {email}: {subject}")
    return True