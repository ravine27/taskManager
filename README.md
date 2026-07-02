# 📋 Task Management System

A robust, full-stack **Task Management System** featuring a modern, responsive **React 19 frontend** and a secure **Spring Boot REST API**. This system facilitates task delegation and progress tracking through an interactive User-Admin workflow, securing all communications using JWT Bearer Tokens.

---

## 🌟 Key Features

*   **👥 Role-Based Access Control (RBAC)**
    *   **Admin**: Create, assign, edit, and delete tasks for any user. Has full overview of tasks and reviews work proof submissions.
    *   **User**: View personal assigned tasks and submit completed work proof descriptions.
*   **🔄 Task Workflow Lifecycle**
    *   `ASSIGNED` ➡️ Created by Admin and assigned to a specific user.
    *   `PENDING_APPROVAL` ➡️ User submits work proof description.
    *   `COMPLETED` ➡️ Reviewed and approved by the Admin.
*   **🔒 Secure authentication**
    *   JWT Authentication with customizable token expiration.
    *   Automatic request authorization via HTTP Axios Interceptors in the frontend.
    *   Role-based backend method security (`PreAuthorize`).

---

## 📸 Application Screenshots

### 🛠️ Admin Dashboard
*Manage, assign, and approve tasks for the team.*
![Admin Dashboard](screenshots/screen_shot_of_the_task.png)

### 👤 User Dashboard
*Track personal task assignments and submit proof descriptions.*
![User Dashboard](screenshots/screen_shot_of_the_user_ttasks.png)

### 🔑 Registration & Role Select
*Register new accounts and select roles (USER or ADMIN).*
![Role Selection](screenshots/role_screen_task.png)

### 📝 Task Details & Editing
*View and reassign tasks dynamically.*
![Task Screen Shot](screenshots/task_screen_shot.png)

### 📖 Swagger API Documentation
*Test all REST endpoints interactively.*
![Swagger Documentation](screenshots/swagger_documentation.png)

---

## 💻 Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 19 (Vite) | Core UI library & project packager |
| | React Router DOM | Declarative client-side routing |
| | Axios | HTTP client with security interceptors |
| | React Context API | Global authentication state manager |
| | Vanilla CSS | Premium styled components & layout |
| **Backend** | Spring Boot 3.5.16 | Robust Java backend container |
| | Spring Security | RBAC and JWT validation |
| | Spring Data JPA | Entity ORM mapping (Hibernate) |
| | MySQL / H2 | SQL Database options |
| | Springdoc OpenAPI | Swagger UI documentation generation |

---

## 📂 Project Structure

```
├── frontend/                       # React Frontend Application
│   ├── src/
│   │   ├── components/             # Reusable UI (TaskCard, TaskList, Navbar, Loader)
│   │   ├── context/                # Context provider for Global Auth State
│   │   ├── pages/                  # Main views (Login, Register, Dashboard, TaskForms)
│   │   └── services/               # Base Axios client config
└── src/                            # Spring Boot Java REST API
    └── main/
        ├── java/com/task/manager/
        │   ├── config/             # CORS configuration & Security filter chains
        │   ├── controller/         # API Controllers (Auth, Tasks, Users)
        │   ├── dto/                # Request & Response DTOs
        │   ├── entity/             # JPA Entities (User, Task, Enums)
        │   ├── repository/         # Data Repositories
        │   └── service/            # Core business logic implementations
        └── resources/
            └── application.properties # Server database profiles (MySQL / H2)
```

---

## ⚙️ Quick Start Guide

### 1. Prerequisites
Ensure you have the following installed:
*   **Java JDK 17** or higher
*   **Node.js** (LTS version)
*   **MySQL Server** (Optional: H2 in-memory mode available)

---

### 2. Database Configuration
Open the backend [application.properties](file:///c:/Users/HP/Downloads/manager/manager/src/main/resources/application.properties) file to pick your profile:

#### Option A: In-Memory H2 Database (Default)
Starts instantly without installing MySQL. Rebuilds schema dynamically:
```properties
spring.datasource.url=jdbc:h2:mem:task_manager;DB_CLOSE_DELAY=-1;MODE=MySQL
spring.datasource.username=sa
spring.datasource.password=
spring.datasource.driver-class-name=org.h2.Driver
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.h2.console.enabled=true
```

#### Option B: MySQL Database
Create your local database:
```sql
CREATE DATABASE task_manager;
```
Enable MySQL properties:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/task_manager
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

---

### 3. Launching the Backend
Navigate to the root folder in your terminal and compile/start the Spring Boot app:
```bash
./mvnw clean spring-boot:run
```
The API server starts on **`http://localhost:8080`**.

---

### 4. Launching the Frontend
Open a new terminal session, navigate to the `frontend/` directory, install dependencies, and start the development server:
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser to view the application.

---

## 🔑 REST API Reference

### Authentication
*   `POST /api/v1/auth/register` - Create user/admin accounts.
*   `POST /api/v1/auth/login` - Returns JWT token upon login.

### Users
*   `GET /api/v1/users` - Fetch list of registered accounts *(requires authentication)*.

### Tasks
*   `GET /api/v1/tasks` - Lists assigned tasks dynamically by role.
*   `GET /api/v1/tasks/{id}` - Fetch details of a specific task.
*   `POST /api/v1/tasks` - Create and assign a task to a user ID (`ADMIN` only).
*   `PUT /api/v1/tasks/{id}` - Update task details (`ADMIN`) or submit completion proof (`USER`).
*   `PUT /api/v1/tasks/{id}/approve` - Approve task work proof (`ADMIN` only).
*   `DELETE /api/v1/tasks/{id}` - Delete a task (`ADMIN` only).

---

## 🛜 Developer Consoles

*   **API Swagger Documentation**: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
*   **H2 Live Database Console**: [http://localhost:8080/h2-console](http://localhost:8080/h2-console)
    *   *JDBC URL*: `jdbc:h2:mem:task_manager`
    *   *Username*: `sa`
    *   *Password*: (leave empty)
