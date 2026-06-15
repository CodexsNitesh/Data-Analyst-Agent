![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green)
![React](https://img.shields.io/badge/React-Frontend-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![Docker](https://img.shields.io/badge/Docker-Containerized-blue)
![LangGraph](https://img.shields.io/badge/LangGraph-Agent-purple)
![Groq](https://img.shields.io/badge/Groq-LLM-orange)
# AI Sales Analytics Copilot

An AI-powered SaaS platform that enables businesses to analyze sales data using natural language.

Users can upload datasets, connect databases, ask business questions in plain English, generate SQL automatically, visualize insights through dashboards, and receive AI-powered recommendations.

---

## Features

### AI-Powered Analytics

* Natural Language → SQL Generation
* Schema-Aware Query Understanding
* SQL Validation & Secure Execution
* AI Business Insights
* Conversational Analytics

### Dataset Management

* CSV Upload
* PostgreSQL Integration
* Dataset Registry
* Schema Exploration
* Multi-Dataset Support

### Sales Intelligence

* Revenue Analytics
* Customer Analytics
* Product Analytics
* Regional Performance Analysis
* KPI Dashboards

### Visualization

* Interactive Charts
* Business Dashboards
* Trend Analysis
* Data Exploration

### SaaS Features

* JWT Authentication
* User Management
* Dataset Ownership
* Team Workspaces
* Subscription Architecture

---

## Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* Axios
* TanStack Table
* Recharts

### Backend

* FastAPI
* LangChain
* LangGraph
* PostgreSQL
* SQLAlchemy
* Alembic
* Pydantic

### AI

* Groq LLM
* SQL Agent
* Insight Agent
* LangGraph Workflows

### DevOps

* Docker
* Docker Compose
* PostgreSQL
* Environment-Based Configuration

---

## Architecture

```text
React Frontend
       │
       ▼
FastAPI Backend
       │
       ▼
Authentication Layer
       │
       ▼
Dataset Service
       │
       ▼
LangGraph SQL Agent
       │
 ┌─────┼───────────────┐
 ▼     ▼               ▼

Schema SQL Tool   Insight Agent
Tool

       │
       ▼

PostgreSQL

       │
       ▼

Analytics
Charts
Insights
Forecasts
```

---

## Project Structure

```text
backend/
├── alembic/
├── app/
│   ├── api/
│   ├── core/
│   ├── db/
│   ├── models/
│   ├── repositories/
│   ├── services/
│   ├── schemas/
│   ├── agents/
│   ├── tools/
│   ├── middleware/
│   └── main.py
├── Dockerfile
├── docker-compose.yml
└── requirements.txt
```

---

## Local Development

### Backend

```bash
cd backend

python -m venv .venv

source .venv/bin/activate
# Windows:
# .venv\Scripts\activate

pip install -r requirements.txt

alembic upgrade head

uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## Docker

Run the complete stack:

```bash
docker-compose up --build
```

This starts:

* FastAPI
* PostgreSQL
* Supporting Services

---

## Roadmap

### Phase 1

* Dataset Management
* Persistent Chat History
* Query Logging
* Error Handling

### Phase 2

* Authentication
* User Accounts
* Dataset Ownership

### Phase 3

* KPI Dashboards
* AI Insights
* Chart Generation

### Phase 4

* Forecasting
* Business Recommendations

### Phase 5

* Team Workspaces
* Subscription Billing
* Production Deployment

---

## Future Vision

AI Sales Analytics Copilot aims to help businesses:

* Understand sales performance
* Identify growth opportunities
* Forecast future revenue
* Analyze customers and products
* Make data-driven decisions without writing SQL

---

## License

MIT License
