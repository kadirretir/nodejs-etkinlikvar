# 🎉 EtkinlikDolu

**Etkinlikdolu** is a modern event-based social platform where users can create, join, and explore events while communicating in real-time with other participants. Built with the MERN stack (MongoDB, Express.js, React, Node.js), it offers a complete full-stack solution with authentication, real-time chat, filtering, and more.

## 🚀 Features

- ✅ **Google reCAPTCHA** integration for enhanced security against spam and bots
- 🔐 **Authentication & Authorization**:
  - Secure **Sign Up / Login** system
  - Role-based access (only event creators can edit/delete their events)
- 📧 **Email Verification** after registration (via confirmation code)
- 📅 **Event Creation & Management**
- 🙋‍♂️ **Join / Leave Events**
- 👤 **User Profile Management**
- 🔍 **Search & Filter Events**:
  - By date
  - By category
  - By keywords
- 💬 **Real-time Chat** using ws: Node.js WebSocket library for event participants
- 🔔 **Notification System**:
  - In-app notifications if new participant joined your event
- 📱 **Responsive Design** (mobile-friendly UI)

## 🛠️ Tech Stack

| Layer         | Technologies                              |
|---------------|--------------------------------------------|
| Frontend      | React.js, Bootstrap, CSS Modules       |
| Backend       | Node.js, Express.js                        |
| Database      | MongoDB + Mongoose                         |
| Real-time     | ws                 |
| Auth/Security | Passport.js, bcrypt, reCAPTCHA    |
| Email         | Nodemailer (for verification & notifications) |
| File Upload   | Multer (for event images)                  |
| Other         | Axios, dotenv                              |

## 📸 Screenshots

![asfasffsf](https://github.com/user-attachments/assets/867b9e7b-a60c-4561-ad57-eef58d3c9a2f)


## ⚙️ Installation & Setup

```bash
# Clone the repository
git clone https://github.com/kadirretir/nodejs-etkinlikvar.git
cd nodejs-etkinlikvar

# Setup
npm run start

## 🧾 Environment Variables

Make sure to configure the required `.env` file for the development environment. The following variables must be set:

### Backend `.env`:
- `MONGODB_URI` – Your MongoDB connection string
- `LOCATION_KEY` – Location Key for Location API
- `RECAPTCHA_KEY` – Secret key for Google reCAPTCHA verification
- `RECAPTCHA_SITEKEY` – RECAPTCHA SITEKEY for Google reCAPTCHA verification
- `REACT_APP_API_URL` – App's Main URL
- `SESSION_SECRET_KEY` – Secure Key For Express Session Key
- `WEBSOCKET_URL` – Main Websocket URL for real-time chat

---

## 📬 Email & Notifications

- ✉️ **Email Verification**: Upon user registration, a verification email is sent with a secure link to activate the account.
- 🔔 **Notification System**:
  - In-app notifications for event activity (e.g., “New participant joined your event”)
  - Optional **email notifications** for chat mentions, event reminders, etc.

---

## 🧪 Developer Notes

- 🛡️ **Google reCAPTCHA** is integrated into forms to prevent automated/bot submissions.
- 💬 Each event includes a **dedicated real-time chat room**, scoped only to participants.
- 🔍 **Search & filter** features allow users to easily find relevant events based on date, category, and keywords.
- 👥 Event management and chat access are controlled via **authentication and authorization** roles.

---

## 👨‍💻 Developer

**Kadir Üretir (kadirretir)**  
MERN Stack Developer
[GitHub](https://github.com/kadirretir) • [LinkedIn](https://www.linkedin.com/in/kadir-ramazan-%C3%BCretir-b752461b6/)

---

## 📄 License

This project is licensed under the **MIT License**  
© 2025 **EtkinlikDolu**


