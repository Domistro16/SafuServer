# 🚀 SafuServer

SafuServer is a lightweight, secure HTTP server designed for rapid development and deployment. Built with safety and simplicity in mind, it offers fast performance, flexible configuration, and easy integration into various projects.

---

## 🧾 Table of Contents

- [Key Features](#key-features)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [API / Endpoints](#api--endpoints)

---

## ⭐ Key Features

- Retrieves and calculates a wallet address' memecoin score/details.
- Simple to configure via environment variables.

---

## 🚧 Getting Started

### Prerequisites

- Node.js (if it’s JS-based; adjust accordingly)
- Git

### Quick Start

1. Clone the repo:
   ```bash
   git clone https://github.com/Domistro16/SafuServer.git
   cd SafuServer
   ```
2. Install Dependencies:
   ```bash
   npm install
   ```
3. Run the development Server:
   ```bash
   npm run dev
   ```
4. Build the Server:
   ```bash
   npm run build
   ```
5. Run the server:
   ```bash
   npm run start
   ```

## 🔧 Configuration

Configure .env variables by renaming .env.example to .env and inputing your
```bash
    ALCHEMY_KEY=
    GATEWAY_URL=
    JWT=
    ```

## 📡 API / Endpoints

| Path                      | Method | Description                        |
| ------------------------- | ------ | ---------------------------------- |
| `/api/address/${address}` | GET    | Returns the wallet's erc20 details |
