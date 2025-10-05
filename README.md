# Bolandsho Application

## Prerequisites

-    Docker installed on your system
-    Docker Compose installed on your system

## Running the Application

The application is containerized and includes the server, frontend, and database components.

1. Clone the repository and navigate to the project directory.

2. Build and run the containers using Docker Compose:

     ```
     docker-compose up --build
     ```

     This command will build the images if necessary and start the services.

3. The application will be available at `http://localhost:3333`.

## Accessing the App

Once the containers are running, open your web browser and navigate to `http://localhost:3333` to access the Bolandsho application.

## Stopping the Application

To stop the running containers, use:

```
docker-compose down
```
