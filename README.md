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

| Action         | Endpoint               |
|----------------|------------------------|
| Admin Signup   | `POST /admin/signup`    |
| Admin Login    | `POST /admin/login`     |

## Users

| Action         | Endpoint               |
|----------------|------------------------|
| User Signup    | `POST /users/signup`    |
| User Login     | `POST /users/login`     |

## Product

| Action                | Endpoint                    |
|-----------------------|-----------------------------|
| Create Product        | `POST /admin/product`        |
| Get All Products      | `GET /admin/product`         |
| Update Product        | `PUT /admin/product/:id`     |
| Delete Product        | `DELETE /admin/product/:id`  |

## Status Change

| Action                | Endpoint                        |
|-----------------------|---------------------------------|
| Update Status         | `PUT /admin/update-status/:id`   |

## Carts

| Action                | Endpoint                          |
|-----------------------|-----------------------------------|
| Add to Cart           | `POST /users/carts/add`           |
| Get User's Cart       | `GET /users/carts/`               |
| Update Cart           | `PUT /users/carts/update/:id`     |
| Remove from Cart      | `DELETE /users/carts/remove/:id`  |

## Orders

| Action                | Endpoint                           |
|-----------------------|------------------------------------|
| Create Order          | `POST /users/orders/create`        |
| Get User's Orders     | `GET /users/orders/`               |
| Cancel Order          | `DELETE /users/orders/cancel/:id`  |
