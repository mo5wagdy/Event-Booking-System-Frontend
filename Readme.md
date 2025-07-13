# 🎉 Eventat – Event Booking System (Frontend)

Eventat is a modern, responsive frontend for an event booking platform. It enables users to browse and book events, manage their bookings, and handle authentication—all with a clean, user-friendly interface.

---

## ✨ Features

- 🔍 **Event Discovery:** Browse upcoming events with detailed information and images.
- 🔐 **User Authentication:** Secure registration and login using JWT.
- 🎟️ **Event Booking:** Book events seamlessly with instant feedback.
- 📋 **Booking Dashboard:** View and manage your bookings in a personalized dashboard.
- 📱 **Responsive UI:** Optimized for both desktop and mobile devices.
- 🎨 **Modern Design:** Utilizes Poppins font, Font Awesome icons, and custom CSS for a sleek look.

---

## 🖼️ Screenshots

<img src="Repo%20Screens/Screenshot%202025-07-13%20214750.png" alt="Landing" width="48%" style="display:inline-block;margin-right:1%;" />
<img src="Repo%20Screens/Screenshot%202025-07-13%20214819.png" alt="Event Details" width="48%" style="display:inline-block;" />
<br>
<img src="Repo%20Screens/Screenshot%202025-07-13%20214851.png" alt="Dashboard" width="48%" style="display:inline-block;margin-right:1%;" />
<img src="Repo%20Screens/Screenshot%202025-07-13%20214926.png" alt="Login" width="48%" style="display:inline-block;" />

---

## 📁 Project Structure

```
frontend/
│
├── index.html                # Main landing page
├── css/
│   └── styles.css            # Main stylesheet
├── js/
│   ├── auth.js               # Authentication logic
│   ├── events.js             # Event listing & booking logic
│   ├── mybookings.js         # Bookings dashboard logic
│   ├── main.js               # UI helpers, notifications, menu
│   └── config.js             # API base URL configuration
├── pages/
│   ├── login.html            # Login page
│   ├── signup.html           # Registration page
│   └── mybookings.html       # User bookings page
└── package.json              # For static server (optional)
```

---

## 🚀 Getting Started

### 🛠️ Prerequisites

- [Node.js](https://nodejs.org/) (for running a static server) or Python 3
- Backend API running and accessible

### ⚡ Installation & Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/eventat-frontend.git
   ```

2. **Navigate to the frontend directory:**
   ```bash
   cd EventBookingSystem/frontend
   ```

3. **Start a static server:**
   - Using Node.js:
     ```bash
     npx serve .
     ```
   - Using Python:
     ```bash
     python -m http.server 8080
     ```
   - Or use the VS Code **Live Server** extension.

4. **Open your browser and visit:**
   ```
   http://localhost:8080/
   ```

---

## 🔗 Backend API Integration

- Configure the backend API URL in [`js/config.js`](js/config.js):
  ```js
  const API_BASE_URL = 'http://localhost:5264';
  ```
- The frontend communicates with the following endpoints:
  - `/api/Accounts/login`
  - `/api/Accounts/Register`
  - `/api/Events`
  - `/api/Bookings/CreateBooking`
  - `/api/Bookings/GetBooking/{id}`
- JWT tokens are automatically attached to protected requests.

---

## 🎨 Customization

- 🎨 **Styling:**  
  Modify [`css/styles.css`](css/styles.css) to adjust colors, fonts, or layout.
- 🔗 **API URL:**  
  Update the API base URL in [`js/config.js`](js/config.js) as needed.

---

## 🛠️ Troubleshooting

- ❌ **404 Errors:**  
  Ensure you are serving files from the `frontend` directory and all assets are present.
- 🚫 **CORS Issues:**  
  The backend must allow requests from the frontend’s origin.
- 🔑 **Authentication Issues:**  
  Verify the backend is running and the API URL is correct.

---

## 📄 License

This project is provided for educational and demonstration purposes.  
You are free to use, modify, and distribute as needed.

---

## 🙏 Credits

- [Google Fonts – Poppins](https://fonts.google.com/specimen/Poppins)
- [Font Awesome](https://fontawesome.com/)
- All open-source contributors and libraries.

---

**Enjoy using Eventat! 🚀**  
For questions or suggestions, please open an issue or contact the maintainer.