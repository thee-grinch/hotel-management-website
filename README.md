# Hotel Management Website

This project is a full-stack hotel management system that includes features like menu management, reservations, user authentication, and more. Follow the steps below to set up and run the project on a new machine.

---

## **Prerequisites**

Before starting, ensure the following software is installed on your machine:

1. **Node.js** (version 16 or higher): [Download Node.js](https://nodejs.org/)
2. **npm** (comes with Node.js) or **yarn** (optional): [Install Yarn](https://yarnpkg.com/)
3. **Git**: [Download Git](https://git-scm.com/)
4. **MongoDB**: [Install MongoDB](https://www.mongodb.com/try/download/community) (or use a cloud MongoDB service like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)).

---

## **1. Clone the Repository**

1. Open a terminal or command prompt.
2. Run the following command to clone the repository:
   ```bash
   git clone <repository-url>
   ```
   Replace `<repository-url>` with the URL of this GitHub repository.

3. Navigate to the project directory:
   ```bash
   cd hotel-management-website
   ```

---

## **2. Set Up the Backend**

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   - Copy the `.env` file provided in the repository or create a new one.
   - Add the following content to the `.env` file:
     ```properties
     MONGO_URI=mongodb://127.0.0.1:27017/restaurant_db
     JWT_SECRET=your-secret-key
     PORT=5000
     BACKEND_URL=http://localhost:5000
     FRONTEND_URL=http://localhost:5173
     ```

4. Start the MongoDB server:
   - If MongoDB is installed locally, run:
     ```bash
     mongod
     ```
   - If using MongoDB Atlas, ensure the `MONGO_URI` in the `.env` file is updated with your Atlas connection string.

5. Start the backend server:
   ```bash
   npm start
   ```
   The backend server should now be running at `http://localhost:5000`.

---

## **3. Set Up the Frontend**

1. Open a new terminal window and navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend should now be running at `http://localhost:5173`.

---

## **4. Verify the Setup**

1. Open a browser and navigate to `http://localhost:5173`.
2. Test the following:
   - **Homepage**: Ensure the homepage loads correctly.
   - **Register/Login**: Create a new account or log in.
   - **Admin Panel**: If you create the first user, it should automatically be assigned the `admin` role. Log in and access the admin panel.
   - **Menu Management**: Add, edit, or delete menu items.
   - **Reservations**: Test the reservation system.

---

## **5. Common Commands**

### **Backend**
- Start the backend server:
  ```bash
  npm start
  ```
- Run the backend in development mode (with auto-restart on changes):
  ```bash
  npm run dev
  ```

### **Frontend**
- Start the frontend development server:
  ```bash
  npm run dev
  ```
- Build the frontend for production:
  ```bash
  npm run build
  ```

---

## **6. Troubleshooting**

### **Issue: MongoDB Not Running**
- Ensure MongoDB is installed and running. If using a local MongoDB instance, run:
  ```bash
  mongod
  ```

### **Issue: Port Already in Use**
- If `5000` or `5173` is already in use, update the `PORT` in the `.env` file for the backend or the `frontend/vite.config.js` file for the frontend.

### **Issue: Dependencies Not Found**
- Ensure you ran `npm install` in both the `backend` and `frontend` directories.

### **Issue: CORS Errors**
- Ensure the `FRONTEND_URL` and `BACKEND_URL` in the `.env` file are correct.

---

## **7. Deployment (Optional)**

To deploy the application:

1. **Backend**:
   - Deploy the backend to a cloud service like [Heroku](https://www.heroku.com/) or [AWS](https://aws.amazon.com/).
   - Update the `BACKEND_URL` in the `.env` file to match the deployed backend URL.

2. **Frontend**:
   - Deploy the frontend to a static hosting service like [Netlify](https://www.netlify.com/) or [Vercel](https://vercel.com/).
   - Update the `FRONTEND_URL` in the `.env` file to match the deployed frontend URL.

---

## **8. Live Demo**

You can view the live demo of the project here: [Hotel Management Website](https://snackscafe.netlify.app/)

---
