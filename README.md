# Expense Tracker

## Overview
Full-stack expense tracking app with:
- React + Nginx frontend
- Node.js/Express backend
- MongoDB persistence (with initial seed data)
- Redis caching
- RabbitMQ messaging
- Dockerized services, orchestrated via Docker Compose

## Prerequisites
- Docker & Docker Compose installed
- Node.js & npm (for local dev/testing)
- A GitHub account

## Getting Started

### 1. Frontend
```bash
cd frontend
docker build -t expense-frontend .
docker run -d --name ft-test -p 8080:80 expense-frontend
# Visit http://localhost:8080
docker rm -f ft-test



