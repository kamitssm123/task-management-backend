
# Project Title

This project is a microservices-based application designed for managing tasks. The application demonstrates scalability, resiliency, and best practices in microservices architecture, database design, optimized database querying, automated unit testing, authentication & authorization, RESTful APIs, code structure, containerization. The project uses open source technologies, including Node.js, Express, PostgreSQL, and Docker.


## Project Structure

Microservice Architecture

Database Architecture
## Technologies Used

* Node.js: JavaScript runtime environment

* Express: Web application framework for Node.js

* PostgreSQL: Relational database

* Docker: Containerization platform

## Services

User Service : Handles user registration and authentication

* Endpoints:

    - `POST /register` : Register a new user
    - `POST /login` : Authenticate a user

Task Service : Manages task creation, retrieval, updating, and deletion.

* Endpoints:

    - `POST /tasks` : Create a new task
    - `GET /tasks` : Get all tasks
    - `GET /tasks/:id` : Get a task by ID
    - `PUT /tasks/:id` : Update a task
    - `DELETE /tasks/:id` : Delete a task

## Setup and Installation

Prerequisites
- Docker
- Node.js
- PostgreSQL

Step 1 : Clone the repository:

```bash
  git clone <repository-url>
  cd <repository-directory>

```

Step 2 : Start the services using Docker Compose:

```
  docker-compose up -d

```
    

### Microservice Architecture
![Microservice Architecture](assets/pic.png)

### Database Architecture
![Database Architecture](assets/Untitled.png)
