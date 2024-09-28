# E-Commerce Backend

This is an API-based backend for an e-commerce platform. It allows users to manage their cart, place orders, and allows admins to manage order statuses. The application is built using Node.js, Express.js, MongoDB, and follows RESTful API principles.

## Features

- **User Cart Management**: Users can add, update, and delete items from their cart.
- **Order Management**: Users can place orders and view their order history.
- **Admin Order Management**: Admins can update the status of orders (e.g., Pending, Shipped, Delivered).

---

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
  - [Cart](#cart)
  - [Orders](#orders)
  - [Order Status (Admin)](#order-status-admin)

  
---

## Technologies

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework for Node.js
- **MongoDB** - NoSQL database
- **Zod** - Schema validation
- **Mongoose** - MongoDB object modeling

---

## Installation

1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd <repository_name>

2. Install dependencies:
    ```bash
     npm install

3. Ensure MongoDB is running locally or provide a connection string to a remote MongoDB instance.

4. Set up the environment variables in a .env file in the root of your project:  
   ```bash
    MONGODB_URI=<Your MongoDB connection string>
    JWT_SECRET=<Your JWT secret key>
    ADMIN_SECRET=<Admin JWT secret key>

5.  Start the server:
    ```bash
      npm start



# API Endpoints

## Admin

### 1. Admin Signup/Login
**Endpoint**: `POST /admin/signup`
**Endpoint**: `POST /admin/login`


### 2. user Signup/Login
**Endpoint**: `POST /users/signup`
**Endpoint**: `POST /users/login`

### 3. product
**Endpoint**: `POST /admin/product`
**Endpoint**: `GET /admin/product`
**Endpoint**: `put /admin/product/:id`
**Endpoint**: `DELETE /admin/product/:id`


### 4. statusChange
**Endpoint**: `PUT /admin/update-status/:id`

### 5. Carts
**Endpoint**: `POST users/carts/add`
**Endpoint**: `GET users/carts/`
**Endpoint**: `put users/carts/update/:id`
**Endpoint**: `DELETE users/carts/remove/:id`


### 6. order
**Endpoint**: `POST users/orders/create`
**Endpoint**: `GET users/orders/`
**Endpoint**: `DELETE /users/orders/cancel/:id`
