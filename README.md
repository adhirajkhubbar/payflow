# PayFlow

A full-stack digital wallet and money transfer application built with React, TypeScript, Node.js, Express, PostgreSQL, and Prisma.

PayFlow allows users to create accounts, manage a digital wallet, add money, transfer money to other users, and view detailed transaction history.

---

## 🚀 Features

### Authentication

- User registration
- User login
- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Persistent login using local storage

### Digital Wallet

- Individual wallet for every user
- View current wallet balance
- Add money to wallet
- Wallet balance stored securely in PostgreSQL
- Automatic wallet creation for users

### Money Transfer

- Transfer money to another registered PayFlow user
- Transfer using receiver email
- Automatic sender balance deduction
- Automatic receiver balance update
- Transaction creation for transfers
- Transaction references for tracking
- Transaction status tracking

### Transaction History

- View recent transactions
- Incoming and outgoing transaction indicators
- Transaction amount
- Transaction date and time
- Transaction status
- Transaction type
- Counterparty information

### Transaction Details

Click any transaction to view:

- Transaction ID
- Reference number
- Transaction type
- Transaction direction
- Amount
- Status
- Date and time
- Counterparty name
- Counterparty email
- Counterparty ID

### User Interface

- Responsive design
- Login page
- Registration page
- Dashboard
- Wallet balance card
- Send Money modal
- Add Money modal
- Transaction details modal
- Responsive mobile layout
- Clean and minimal UI

---

## 🛠️ Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- React Router
- Axios
- Lucide React
- CSS

### Backend

- Node.js
- TypeScript
- Express.js
- JWT
- bcrypt
- CORS
- dotenv

### Database

- PostgreSQL
- Prisma ORM
- Prisma PostgreSQL Adapter

### Development Tools

- VS Code
- Git
- GitHub
- npm
- Prisma CLI
- tsx
- Vite

---

## 📁 Project Structure

```text
PayFlow/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.tsx
│   │
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
│
├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── src/
│   ├── config/
│   │   └── database.ts
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── transaction.controller.ts
│   │   ├── user.controller.ts
│   │   └── wallet.controller.ts
│   │
│   ├── middleware/
│   │   └── auth.middleware.ts
│   │
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── transaction.routes.ts
│   │   ├── user.routes.ts
│   │   └── wallet.routes.ts
│   │
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── transaction.service.ts
│   │   ├── user.service.ts
│   │   └── wallet.service.ts
│   │
│   ├── scripts/
│   │   ├── create-missing-wallets.ts
│   │   └── delete-invalid-transaction.ts
│   │
│   ├── generated/
│   │   └── prisma/
│   │
│   └── server.ts
│
├── package.json
├── package-lock.json
├── prisma7.config.ts
├── tsconfig.json
├── skills-lock.json
└── README.md
