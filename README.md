# Decor Haven – HCI Coursework Project

**Group Number:** 70
**Module Code:** PUSL3122
**Module Name:** HCI, Computer Graphics, and Visualisation
**Coursework Title:** HCI Coursework

## Description

Decor Haven is a 3D furniture visualization platform built for our HCI coursework. Designers can place virtual furniture in a 3D room, arrange furntiues, and view the placement before purchase.

## Features

* Browse by category and view featured furniture pieces.
* **3D room modeling:** Designers place desired furniture in a virtual room and preview.
* **Designer portal** for adding/editing/deleting products.
* Firebase-backed email/password **auth** and **role-based access** (admin vs. designer).
* **Firestore database** for products and designers.
* **Firebase Storage** for hosting 3D model files.

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Manuka-Rathnayake/decor-heaven](https://github.com/Manuka-Rathnayake/decor-heaven)
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd decor-heaven
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The app opens at `http://localhost:8080` by default.

## Usage

* **Admin login:**
    * Email: `admin@gmail.com`
    * Password: `admin@123`
    * Admins can create designer accounts and manage all products.

## Scripts

* `npm run dev` — start development server

---
