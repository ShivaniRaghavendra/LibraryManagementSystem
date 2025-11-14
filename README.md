# 📚 Library Management System

A modern and user-friendly web application for managing library books, users, and transactions. Built with **React** ⚛️, **Node.js/Express** 🖥️, and **Firebase Firestore** 🔥.

***

## 🚀 Features
- 📖 Add, edit, delete, and search books
- 👥 Manage users (members), including borrowing status
- 🔄 Borrow & return transactions with real-time availability
- 📊 Live dashboard with analytics (total/available/borrowed books, users, and categories)
- 🎨 Sleek, responsive UI with Tailwind CSS 💅

***

## 🛠️ Tech Stack
- **Frontend:** React ⚛️ + TailwindCSS 🎨
- **Backend:** Node.js 🖥️, Express 🚂
- **Database:** Firebase Firestore 🔥

***

## ⚡ Getting Started

### 1️⃣ Clone this repository
```bash
git clone https://github.com/ShivaniRaghavendra/LibraryManagementSystem.git
cd LibraryManagementSystem
```

### 2️⃣ Install dependencies
- **Backend:**
    ```bash
    cd library-backend
    npm install
    ```
- **Frontend:**
    ```bash
    cd ../library-frontend
    npm install
    ```

### 3️⃣ Configure Firebase Backend
**This app does NOT include any Firebase secret or key 🔐. For security, you must supply your own!**

1. Go to [Firebase Console](https://console.firebase.google.com/) 🔗 → your project → Gear ⚙️ → "Project settings"
2. Click the **"Service accounts"** tab and then **Generate new private key** 🔑 (this will download a `.json` file)
3. **Rename the file if you like** (optional), but make sure to place it exactly at:
   ```
   library-backend/serviceAccountKey.json
   ```
   *(This path is already in `.gitignore` and never pushed to GitHub!)*

### 4️⃣ Start the servers
- **Backend:**
    ```bash
    cd library-backend
    node server.js
    # or: npm start
    # You should see: ✅ Server running at http://localhost:8080
    ```
- **Frontend:** (in a separate terminal window/tab)
    ```bash
    cd library-frontend
    npm start
    # Opens app at: http://localhost:3000
    ```

***

## 🌟 Usage
- Go to `http://localhost:3000` in your web browser 🌐
- Manage books 📚, users 🧑‍🤝‍🧑, and loans 🔄 with an intuitive dashboard

***

## 🔐 Security Notes
- **Never push your `serviceAccountKey.json` to GitHub!** 🚫🔑 This private key should remain on your local machine.
- All sensitive config is excluded from this repository.

***

## 🤝 Contributing
Pull requests and suggestions are welcome! For major changes, please open an issue to discuss what you'd like to improve. 💬

***

## 📄 License
MIT 📝

***

## ⭐️ Credits & Author
Made with ❤️ by [Shivani Raghavendra](https://github.com/ShivaniRaghavendra) 👩‍💻
