# SpeX

A web app for a peer-to-peer online hardware store platform that connects customers with hardware supplies providers.

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/srour77/spex.git
cd spex
```

2. Update .env, secrets files with your prefered data (optional)

3. Start the application:

```bash
docker-compose up
```

4. The API will be available at `http://localhost:2000`.

## Features

- Customers

  - Signup/Login
  - Search through all available products(cpu, ram, motherboards, gpu, ...etc)
  - Filter products in fully dynamic way (category, price, isNew, specs(memory size, cpu clock, cores count, ...etc), ...etc)
  - Make orders including one or more proudcts
  - List all previous orders

- Providers
  - Signup/Login
  - List and manage their products
  - Product categorization and tagging

## Technology Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database ORM**: Prisma
- **Database**: SqlServer
- **Containerization**: Docker

### Main Endpoints

- `POST /customer/new` - customer registration
- `POST /customer/login` - User login
- `GET /product/get/all` - List all products
- `GET /product/search/{name}` - search products by name
- `GET /product/search` - search products by specs (ram size, cpu clock, ...etc)
- `POST /product/buy` - place an order
