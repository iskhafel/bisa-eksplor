# BisaEksplor

BisaEksplor is a web application developed as a final project requirement for **Dibimbing Front-end Web Development Batch 19**. This project provided valuable learning experiences in handling complete APIs and transforming them into a functional website.

---

## Background

This project focuses on developing a booking platform that simplifies the process of finding and booking travel activities. The app also supports admin functionalities for managing content and transactions effectively.

The development emphasized the following:

- Integrating APIs with front-end frameworks.
- Building user and admin interfaces to support CRUD operations.
- Handling logic for diverse user roles (user and admin).

---

## Features

### User Features

- **User Registration and Login**

  - Secure authentication with JWT tokens.
  - Profile updates and role management.

- **Activity Browsing and Booking**

  - Search and filter activities by categories, ratings, and price.
  - Add activities to a cart and make transactions.

- **Promotions and Discounts**
  - Explore promo banners and apply promo codes during checkout.

### Admin Features

- **Content Management**

  - Create, update, and delete activities, categories, banners, and promotions.
  - Manage transactions and update their statuses.

- **Transaction Control**
  - View all user transactions.
  - Cancel or approve transactions for specific bookings.

---

## Challenges Faced

1. Implementing pagination for API responses that lack built-in parameters.
2. Designing the user-admin relationship for transaction handling.
3. Building reusable components such as modals for admin CRUD operations.
4. Aligning business logic for user and admin features seamlessly.

---

## Technology Stack

- React
- Tailwind CSS
- React Router
- Axios
- Flowbite

---

## Wireframes and Task Flows

### User Flow

- Register/Login to explore activities.
- Browse activities and add them to the cart.
- Proceed to checkout and complete the transaction.

### Admin Flow

- Log in as an admin.
- Manage content (activities, banners, promos).
- Monitor and handle transactions.

## Demo

Check out the live demo: [Demo Link](https://bisaeksplor.vercel.app/)

---

## Installation

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/iskhafel/bisaeksplor.git
   cd bisaeksplor
   ```
