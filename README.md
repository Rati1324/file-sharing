# File Sharing Platform in FastAPI

This repository contains a full-stack project for a file-sharing platform that can be easily set up and run using Docker Compose.
Technologies user: FastAPI, React, ChakraUI, PostrgreSQL, Docker

## Prerequisites

Make sure you have the following software installed on your system:

- Docker: [Installation Guide](https://docs.docker.com/get-docker/)
- Docker Compose: [Installation Guide](https://docs.docker.com/compose/install/)

## Getting Started

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/Rati1324/file-sharing.git
   ```
2. Build and start the Docker containers:

   ```bash
   docker-compose up --build
   ```
   This command will build the Docker images and start the containers defined in docker-compose.yml.
3. Access the FastAPI application in your browser: http://localhost:8000/

5. Access the API documentation:

    API documentation (Swagger): http://localhost:8000/docs

    Interactive ReDoc documentation: http://localhost:8000/redoc
    

Make sure to pass the token in the header when using secured routes in Swagger
You can now interact with and test your FastAPI application using the provided documentation.

To stop the application and remove the Docker containers, press Ctrl+C in the terminal where docker-compose up is running, and then run:
   
   ```bash
   docker-compose down
   ```
User friendly UI to select and share your uploaded files with other users
![select](https://github.com/Rati1324/file-sharing/assets/61045363/29aaef8b-6b9d-41b2-9b6d-e97f579ee324)

