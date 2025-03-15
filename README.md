# Chat Messaging API

This is a **real-time chat messaging API** built using **NestJS, Sequelize, WebSockets, and PostgreSQL**. The API allows users to send and receive messages in private chats with real-time updates using WebSockets.

## 🚀 Features
- **User Authentication (Optional)**
- **Real-time Messaging via WebSockets**
- **Message Storage in PostgreSQL**
- **Chat List & Message History Retrieval**
- **Online User Tracking**
- **Seen/Unread Message Handling**
- **Scalable & Extendable Architecture**

---

## 🛠️ Technologies Used
- **NestJS** - Backend Framework
- **Sequelize (Sequelize-Typescript)** - ORM for PostgreSQL
- **PostgreSQL** - Database
- **WebSockets (socket.io)** - Real-time Communication
- **dotenv** - Environment Variables Handling

---

## 📦 Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-repo/chat-messaging-api.git
cd chat-messaging-api
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Configure Environment Variables
Create a **.env** file in the root directory and add the required environment variables:
```env
DATABASE_URL=postgres://username:password@localhost:5432/chat_db
SOCKET_PORT=5005
PORT=3000
```

### 4️⃣ Run Database Migrations
```bash
npx sequelize-cli db:migrate
```

### 5️⃣ Start the Server
```bash
npm run start:dev
```

---

## 📡 WebSocket Events

### 🔹 User Online
**Client emits:**
```json
{ "event": "userOnline", "data": 1 } // userId
```

### 🔹 Get User Chats
**Client emits:**
```json
{ "event": "getChats", "data": 1 } // userId
```
**Server responds:**
```json
{ "event": "chatsList", "data": [{ "id": 1, "user1Id": 1, "user2Id": 2 }] }
```

### 🔹 Create New Chat
**Client emits:**
```json
{ "event": "createChat", "data": { "user1Id": 1, "user2Id": 2 } }
```
**Server responds:**
```json
{ "event": "newChat", "data": { "id": 1, "user1Id": 1, "user2Id": 2 } }
```

### 🔹 Send Message
**Client emits:**
```json
{ "event": "sendMessage", "data": { "senderId": 1, "receiverId": 2, "content": "Hello!" } }
```
**Server responds:**
```json
{ "event": "newMessage", "data": { "id": 1, "senderId": 1, "receiverId": 2, "content": "Hello!", "seen": false } }
```

### 🔹 Mark Message as Seen
**Client emits:**
```json
{ "event": "markAsSeen", "data": { "messageId": 1 } }
```
**Server responds:**
```json
{ "event": "messageSeen", "data": { "messageId": 1, "seen": true } }
```

### 🔹 User Offline
**Client emits:**
```json
{ "event": "userOffline", "data": 1 }
```

---

## 📖 API Endpoints
| Method | Endpoint          | Description            |
|--------|------------------|------------------------|
| `GET`  | `/chats/:id`     | Get chat by ID        |
| `GET`  | `/chats/user/:id` | Get user chats        |
| `POST` | `/chats`         | Create a new chat     |
| `DELETE` | `/chats/:id`  | Delete a chat         |

---

## 🎯 Future Improvements
- Add **Group Chat Support**
- Implement **User Authentication** (JWT)
- Improve **Message Notifications**
- Add **Typing Indicators**

---

## 👨‍💻 Contributing
Feel free to fork this repository and contribute by creating pull requests.

---

## 📜 License
This project is **MIT Licensed**.

🚀 **Happy Coding!**

