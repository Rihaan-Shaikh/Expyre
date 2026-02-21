import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_test_email():
    # Configuration
    smtp_server = "127.0.0.1"
    smtp_port = 2025  # Your Expyre SMTP port
    sender_email = "tester@example.com"
    receiver_email = "testuser@expyre.com" # Make sure this matches a generated email later
    
    # Create the email
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = receiver_email
    msg['Subject'] = "Testing Expyre SMTP Server"
    
    body = "Hello! This is a test email sent to verify the Expyre SMTP Listener is working correctly."
    msg.attach(MIMEText(body, 'plain'))
    
    try:
        print(f"Connecting to SMTP server at {smtp_server}:{smtp_port}...")
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.sendmail(sender_email, receiver_email, msg.as_string())
        print("✅ Success! Email sent to the SMTP listener.")
        print("Check your SMTP server terminal for logs.")
    except Exception as e:
        print(f"❌ Failed to send email: {e}")

if __name__ == "__main__":
    send_test_email()
