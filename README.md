<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

docker-compose up -d

# Teslo Shop API

This is a [NestJS](https://nestjs.com/) RESTful API for the Teslo Shop project, using PostgreSQL and TypeORM.

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/tapas2000/nest_teslo-shop.git
cd 04-teslo-shop
```

### 2. Install dependencies
```bash
yarn install
```

### 3. Configure environment variables
- Copy the example environment file and update values as needed:
  ```bash
  cp .env.template .env
  # Edit .env to set your DB credentials
  ```

### 4. Start the PostgreSQL database
Run the following command to start a local PostgreSQL instance using Docker Compose:
```bash
docker-compose up -d
```
The database will use the credentials from your `.env` file.

### 5. Run the development server
```bash
yarn start:dev
```
The API will be available at `http://localhost:3000` by default.

### 5. Populate database
```bash
http://localhost:3000/seed
```

## Useful Scripts

- **Start in development:**
  ```yarn start:dev```
- **Start in production:**
  ```yarn start:prod```
- **Build project:**
  ```yarn build```
- **Run tests:**
  ```yarn test```
- **Run e2e tests:**
  ```yarn test:e2e```
- **Run linter:**
  ```yarn lint```
- **Format code:**
  ```yarn format```

## Project Structure

- `src/` - Main source code
- `test/` - End-to-end tests
- `.env.template` - Example environment variables
- `docker-compose.yaml` - Local PostgreSQL setup

## Notes

- The database is persisted in the `postgres-data/` directory.
- Update `.env` to match your local setup if needed.
- For production, review security and environment settings.

---
Feel free to open issues or contribute!