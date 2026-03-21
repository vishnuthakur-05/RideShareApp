# Ride Share Backend

Spring Boot backend for the Ride Share Application.

## Prerequisites
- Java 17 or higher
- Maven 3.6+

## Setup & Run

1.  **Navigate to the backend directory**:
    ```bash
    cd ride-share-backend
    ```

2.  **Build the project**:
    ```bash
    mvn clean install
    ```

3.  **Run the application**:
    ```bash
    mvn spring-boot:run
    ```
    The application will start on `http://localhost:8080`.

## API Endpoints

### Authentication
- **POST** `/api/auth/register`: Register a new user.
- **POST** `/api/auth/login`: Login and receive JWT token.

## Database
- Uses **H2 In-Memory Database**.
- Console: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:ridesharedb`
- User: `sa`
- Password: `password`
