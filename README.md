# 📝 Paste and Share

A simple  application to create, share, and retrieve pastes with a rich-text editor and file upload support(in process).

## 🚀 Features
- **Rich Text Editing** (Quill.js)
- **File Upload Support** (.txt, .pdf, .docx, .png, .jpg)
- **Paste Sharing with Unique Links**
- **MemeCache Caching for Fast Retrieval**
- **Docker Support** (MongoDB, Memecache, Paste and Share Service)
- **Deployable on Railway.app**

---

## 📌 **Tech Stack**
- **Backend:** Node.js, Express.js, MongoDB, Redis
- **Frontend:** HTML, CSS, JavaScript, Quill.js
- **Database:** MongoDB (with memcache caching)
- **Deployment:** Docker, Railway.app

---

## 🛠 **Setup Instructions**

### 1️⃣ **Clone the Repository**
```sh
git clone https://github.com/ab11op/paste-and-share-node.git
cd pastebin-clone

2️⃣ Install Dependencies
npm install

3️⃣ Set Up Environment Variables
take the reference of .env.example file in the project


🔹 Running Locally (Without Docker)
npm run dev(make sure memecahe and mongodb are running on your system)
Now visit 👉 http://localhost:4001


🐳 Run with Docker

1️⃣ Using Docker Compose
docker-compose up --build

2️⃣ Stop Docker Services
docker-compose down


🎯 Contributions
Feel free to fork & contribute!
PRs are welcome. 🚀


---