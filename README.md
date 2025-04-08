# College Appointment Booking System (Backend)

This is the backend for a College Appointment Booking System built using Node.js, Express, and MongoDB. It allows students to book appointments with professors based on their available time slots. Features include user authentication (JWT), role-based access (student/professor), appointment scheduling, availability management, and secure API endpoints.


---

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB (local or Atlas)

### Installation

```bash
git clone https://github.com/Aazim-Sadan/online_oppointment_system.git
cd Online_appointment_system
npm install
```
### ⚙️ Environment Variables
Create a .env file in the root directory and add the following:

```bash
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

###  Run the Server

```bash
npm run dev
```

Server will start on http://localhost:8000
