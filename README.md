# Welcome to the backend part of the Farm2You project!
### This project is a collaborative effort by the ii-Practicum Team 4, and it is part of backend component.

## Project Overview
**Farm2You is a web application designed to connect local farm directly with consumers, promoting local produce and 
sustainable farming practices. The backend of the application is built using Node.js and Express, providing a robust 
and scalable server-side solution.
The application is designed to be user-friendly and efficient, allowing users to easily navigate through the various features
and functionalities. The backend is responsible for handling user authentication, managing product listings, processing orders,
and providing a seamless experience for the consumers.**

## Table of Contents
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Testing](#testing)

## Technologies Used
- **Node.js**: v16.14.2
- **Express**: v4.18.2
- **Mongoose**: v7.0.1
- **Jest**: v29.7.0
- **MongoDB**: A NoSQL database for storing data in a flexible, JSON-like format.
- **Swagger**: A tool for documenting APIs.

## Features
- **User Authentication**: Secure user registration and login functionality.
- **Product Management**: CRUD operations for managing products.
- **Order Processing**: Handling user orders and payment processing.
- **API Documentation**: Comprehensive API documentation using Swagger for easy reference and testing.
- **Testing**: Unit tests using Jest to ensure code quality and reliability.
- **Environment Variables**: Configuration management using `.env` files for sensitive information.

## Getting Started
To run this application, you need to have Node.js and MongoDB installed on your machine. Follow these steps to set up the project:
1. Clone the repository:
   ```bash
   git clone https://github.com/Code-the-Dream-School/ii-practicum-team-4-back.git
    ```
2. Navigate to the project directory:
```bash
   cd ii-practicum-team-4-back
   ```
3. Install the required packages:
   ```bash
    npm install
    ```
4. Create a `.env` file in the root directory and add your MongoDB connection string.

5. Run the application:
   ```bash
   npm run dev
   ```
   
## API Documentation
- Access the API documentation at `http://localhost:8000/api-docs`.

## Testing
This project uses Jest and MongoMemoryServer, so no local MongoDB instance is required.
- Run Jest tests:
   ```bash
   npm test
   ```
This will automatically spin up an in-memory MongoDB instance for testing.