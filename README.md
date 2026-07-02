# Task Management System

A robust and secure Task Management REST API built using Spring Boot, Spring Security, and MySQL. This application supports user registration, authentication via JWT tokens, and role-based access control (USER and ADMIN) to manage tasks securely.

## Tech Stack

- **Backend Framework**: Spring Boot 3.5.16
- **Security**: Spring Security (JWT-based token authentication)
- **Database**: MySQL
- **ORM / Data Access**: Spring Data JPA / Hibernate
- **API Documentation**: Springdoc OpenAPI / Swagger UI
- **Build Tool**: Maven
- **Utilities**: Lombok, Jakarta Validation

---

## Folder Structure

```
├── src
│   ├── main
│   │   ├── java
│   │   │   └── com.task.manager
│   │   │       ├── config                  # Configuration files (Security, OpenAPI)
│   │   │       ├── controller              # REST API Controllers (Auth, Task)
│   │   │       ├── dto                     # Data Transfer Objects
│   │   │       │   ├── request             # Incoming request DTOs
│   │   │       │   └── response            # Outgoing response DTOs
│   │   │       ├── entity                  # JPA Database Entities (User, Task, Role)
│   │   │       ├── exception               # Exception classes & Global Exception Handler
│   │   │       ├── repository              # Spring Data JPA repositories
│   │   │       ├── security                # JWT Service, Custom User Details, filters
│   │   │       └── service                 # Service Interfaces & Implementations
│   │   └── resources
│   │       └── application.properties   # Application configurations
```

---

## Setup & Setup Instructions

### 1. Prerequisites
- **Java JDK 17** or higher installed.
- **Maven** installed (or use the included Maven wrapper `mvnw`).
- **MySQL Server** installed and running.

### 2. MySQL Configuration
1. Open your MySQL client and create a database named `task_manager`:
   ```sql
   CREATE DATABASE task_manager;
   ```
2. Configure your database credentials and settings in [application.properties](file:///c:/Users/HP/Downloads/manager/manager/src/main/resources/application.properties):
   ```properties
   spring.datasource.url=jdbc:mysql://127.0.0.1:3306/task_manager
   spring.datasource.username=YOUR_MYSQL_USERNAME
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   ```

### 3. Running the Backend
Navigate to the root directory in your command line and execute the following command:
```bash
./mvnw spring-boot:run
```
The application will start on port `8080` (by default).

### 4. Running the Frontend
Navigate to the `frontend` directory:
```bash
cd frontend
npm install
npm run dev
```
The frontend will start on port `5173` (by default) at `http://localhost:5173`.

---

## API List

### Authentication Endpoints
- **POST** `/api/v1/auth/register`
  - Registers a new user. Assigns the `USER` role automatically.
- **POST** `/api/v1/auth/login`
  - Authenticates user credentials and returns a JWT Bearer Token.

### Task Endpoints (Requires Authentication)
- **GET** `/api/v1/tasks`
  - Retrieves tasks belonging to the currently logged-in user.
- **GET** `/api/v1/tasks/{id}`
  - Retrieves a specific task by its ID. Users can only fetch their own tasks, while Admins can view any task.
- **POST** `/api/v1/tasks`
  - Creates a new task assigned to the logged-in user.
- **PUT** `/api/v1/tasks/{id}`
  - Updates an existing task's details. Users can only update their own tasks, while Admins can update any task.
- **DELETE** `/api/v1/tasks/{id}`
  - Deletes a task. Users can only delete their own tasks, while Admins can delete any task.

---

## Swagger URL

Once the application is running, you can access the Swagger UI documentation to test the APIs in your browser:
- **Swagger UI URL**: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)

---

## Postman Instructions

To test endpoints requiring authentication (Task Endpoints) in Postman:
1. **Register**: Send a `POST` request to `http://localhost:8080/api/v1/auth/register` with the registration details.
2. **Login**: Send a `POST` request to `http://localhost:8080/api/v1/auth/login` with your email and password.
3. **Save Token**: Copy the value of the `token` string returned in the response payload.
4. **Authorize Tasks**:
   - For all Task endpoints (`/api/v1/tasks/**`), navigate to the **Authorization** tab in Postman.
   - Select **Type** as **Bearer Token**.
   - Paste the copied JWT token into the **Token** field.
5. **Send Request**: Execute the HTTP request to interact with the tasks.
