# Task Management Microservices

This project is a **microservices-based application** designed for managing tasks efficiently. It follows best practices in **scalability, resiliency, microservices architecture, authentication & authorization, RESTful APIs, database optimization, and structured code design**.  

The application consists of **three microservices**:
1. **API Gateway** (Entry point)
2. **User Service** (Handles authentication)
3. **Task Service** (Manages tasks)

The project is built using **Node.js, Express, and PostgreSQL**.

---

## **Project Structure**

- **Microservice Architecture**
- **Database Architecture**
- **Authentication & Authorization**
- **Optimized Database Queries**
- **Scalable API Design**

---

## **Technologies Used**
* **Node.js** - JavaScript runtime environment  
* **Express.js** - Web framework for Node.js  
* **PostgreSQL** - Relational database  
* **JWT (JSON Web Tokens)** - Secure user authentication  

---

## **Microservices & APIs**

### **1. API Gateway**  
The API Gateway acts as a **single entry point** for all requests and forwards them to the appropriate microservice.  

---

### **2. User Service**  
Handles **user authentication** (register, login, logout).  

#### **Endpoints:**
| Method | Endpoint      | Description |
|--------|-------------|-------------|
| **POST**  | `/register`  | Register a new user |
| **POST**  | `/login`  | Authenticate a user and return a JWT token |
| **POST**  | `/logout`  | Logs out a user (protected) |

---

### **3. Task Service**  
Manages **tasks** (CRUD operations, task metrics).  

#### **Endpoints:**
| Method | Endpoint      | Description |
|--------|-------------|-------------|
| **GET**  | `/dashboard`  | Get task metrics (protected) |
| **POST**  | `/`  | Create a new task (protected) |
| **GET**  | `/`  | Get all tasks (protected) |
| **GET**  | `/:id`  | Get task by ID (protected) |
| **PUT**  | `/:id`  | Update a task (protected) |
| **DELETE**  | `/`  | Delete multiple tasks (protected) |

---

## **Setup & Installation**

### **Prerequisites**
- **Node.js**
- **PostgreSQL** (Database)

---

### **Running the Microservices**
Each service runs independently. You need to start each microservice separately.

#### **1. Clone the repository**
```bash
git clone <repository-url>
cd <repository-directory>

# Running the Microservices

Each microservice needs to be started separately. Follow these steps to run them:

### **1. Start API Gateway**
```bash
cd api-gateway
npm install
node src/index.js

### **1. Start User Service**
```bash
cd user-service
npm install
node src/index.js

### **1. Start Task Service**
```bash
cd task-service
npm install
node src/index.js
