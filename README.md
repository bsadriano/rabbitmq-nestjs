# Microservices NestJS, and NextJS Repository

This repository is based on the Microservices 'Carsties' app created for the Udemy course updated in August 2024, available [here](https://github.com/TryCatchLearn/carsties).

## Brief Architecture Overview

This API showcase consists of the following components:

- **gateway-service**: Responsible for the API Gateway. Used only locally; nginx reverse proxy is used in Docker.
- **auction-service**: Handles CRUD operations on auctions and users. Uses **Postgres** and is the source of truth for all other services.
- **auth-service**: Responsible for authenticating users and API endpoints. Sends requests to auction-service through **RabbitMQ** for creating and validating users.
- **search-service**: Serves data shown in the auction list. Uses **MongoDB** and listens for any CRUD auction events published by auction-service through **RabbitMQ**.
- **bid-service**: Manages bid data on auctions. Uses **MongoDB**.
- **notification-service**: Pushes notifications for any finished, created, or placed bid auctions. Listens for the aforementioned events through **RabbitMQ** and emits WebSocket events, which the frontend listens to in order to display notifications.
- **frontend/web-app**: Responsible for the main UI of the app.
- The services interact via **RabbitMQ**, **gRPC**, and **WebSocket**.

## Running the Example with Docker Compose

You can run this app locally on your computer by following these instructions:

1. Using your terminal or command prompt, clone the repo onto your machine in a user folder:
2. Omit the .sample on all the .env files. Make sure to replace all the \*\_SECRET with a random 32 length string

3. Ensure you have Docker Desktop installed on your machine. If not, download and install it from Docker and review their installation instructions for your operating system [here](https://docs.docker.com/desktop/).

4. Build the services locally on your computer by running (NOTE: this may take several minutes to complete):

```
docker compose build
```

5. Once this completes, you can use the following command to run the services:

```
docker compose up -d --build
```

6. Alternatively, for production use, you can run:

```
docker compose -f ./docker-compose.prod.yml up -d --build
```

7. You should now be able to browse to the app at https://localhost:3000.

8. The following links provide access to the admin interfaces for various services:

- **pgAdmin**: http://localhost:5050/browser/
- **GraphQL Playground**: http://localhost:7002/
- **Mongo Express**: http://localhost:8081/
- **RabbitMQ**: http://localhost:15672/
