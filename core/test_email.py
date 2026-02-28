"""Quick test to debug SMTP email sending."""
import smtplib
from config import config

print(f"SMTP_SERVER: {config.SMTP_SERVER}")
print(f"SMTP_PORT:   {config.SMTP_PORT}")
print(f"EMAIL_SENDER: {config.EMAIL_SENDER}")
print(f"EMAIL_PASSWORD: {'*' * len(config.EMAIL_PASSWORD) if config.EMAIL_PASSWORD else 'NOT SET'}")
print(f"PASSWORD LENGTH: {len(config.EMAIL_PASSWORD) if config.EMAIL_PASSWORD else 0}")

try:
    print("\nConnecting to SMTP server...")
    server = smtplib.SMTP(config.SMTP_SERVER, config.SMTP_PORT)
    server.ehlo()
    print("Starting TLS...")
    server.starttls()
    server.ehlo()
    print("Logging in...")
    server.login(config.EMAIL_SENDER, config.EMAIL_PASSWORD)
    print("✅ Login SUCCESS!")
    server.quit()
except Exception as e:
    print(f"❌ Error: {e}")
