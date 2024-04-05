# File Sharing Platform in FastAPI + React

This repository contains a full-stack project for a file sharing platform that can be easily set up and run using Docker Compose.

Main functionalities with files: Upload, Share, Download, Delete, Search.

Authentication using JWT.

Technologies used: FastAPI, React, ChakraUI, PostrgreSQL, Docker.

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

    API documentation (Swagger): http://localhost:3000/docs

    Interactive ReDoc documentation: http://localhost:8000/redoc
    

Make sure to pass the token in the header when using secured routes in Swagger
You can now interact with and test your FastAPI application using the provided documentation.

To stop the application and remove the Docker containers, press Ctrl+C in the terminal where docker-compose up is running, and then run:
   
   ```bash
   docker-compose down
   ```
Selecting files to share with other users:
![select](https://github.com/Rati1324/file-sharing/assets/61045363/29aaef8b-6b9d-41b2-9b6d-e97f579ee324)

Selecting users to share with:
![share](https://github.com/Rati1324/file-sharing/assets/61045363/15278432-bc0e-47c4-b311-3609a16654a1)

The shared files visible in other user's file manager:

![result](https://github.com/Rati1324/file-sharing/assets/61045363/a9e6b960-dff1-4630-9dc0-cb647ffb7085)
