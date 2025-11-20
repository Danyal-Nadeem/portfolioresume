from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import smtplib
import ssl
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")

app = Flask(__name__, static_folder="public", static_url_path="")
CORS(app)  # Enable CORS

# Serve index.html
@app.route("/")
def home():
    return send_from_directory("public", "index.html")


# Contact API (same as your Node.js version)
@app.route("/api/contact", methods=["POST"])
def contact():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    message = data.get("message")

    if not name or not email or not message:
        return jsonify({"success": False, "error": "All fields are required"})

    try:
        subject = f"New Contact Form Submission from {name}"
        body = f"Name: {name}\nEmail: {email}\nMessage: {message}"

        email_text = f"Subject: {subject}\n\n{body}"

        # Gmail SMTP (App Password Required)
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
            server.login(EMAIL_USER, EMAIL_PASS)
            server.sendmail(EMAIL_USER, EMAIL_USER, email_text)

        return jsonify({"success": True})

    except Exception as e:
        print("Error sending email:", e)
        return jsonify({"success": False, "error": "Failed to send email"})


# Run server
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
