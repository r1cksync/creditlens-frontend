# CreditLens

**Production-grade, Kubernetes-native, Multi-Agent Banking Credit Analysis Platform**

CreditLens is a comprehensive credit analysis platform that leverages 18 AI agents orchestrated via LangGraph to perform end-to-end credit assessment. Built with FastAPI, Next.js 14, and deployed on Kubernetes (k3s on Oracle Cloud).

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Next.js 14 Frontend                       │
│  Landing │ Dashboard │ Analysis │ Documents │ Chat │ Admin       │
└─────────────────────────┬───────────────────────────────────────┘
                          │ REST + SSE
┌─────────────────────────┴───────────────────────────────────────┐
│                     FastAPI Backend (Python)                      │
│  Auth │ Analysis │ Documents │ Admin │ Employee │ Analytics │ Chat│
└──┬──────────┬──────────┬──────────┬──────────┬──────────────────┘
   │          │          │          │          │
   ▼          ▼          ▼          ▼          ▼
┌──────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│Groq  │ │MongoDB │ │AWS S3  │ │Open-   │ │Redis   │
│LLM   │ │Atlas   │ │+Textract│ │Search  │ │Cache   │
└──────┘ └────────┘ └────────┘ └────────┘ └────────┘
```

<img width="1325" height="729" alt="image" src="https://github.com/user-attachments/assets/c67a6413-9bb7-4ba0-82d5-f346c0257720" />


## 18 AI Agents

| # | Agent | Purpose |
|---|-------|---------|
| 1 | **Supervisor** | Orchestrates workflow, manages state, handles errors |
| 2 | **Knowledge Monitor** | Detects stale/new documents via hashing |
| 3 | **Knowledge Curator** | C-RAG (Corrective RAG) with relevance grading |
| 4 | **Q-RAG Optimizer** | Quantitative RAG for financial data extraction |
| 5 | **C-RAG Retriever** | Hybrid vector + BM25 search with re-ranking |
| 6 | **Financial Metrics** | 30+ ratios, Altman Z-Score, Ohlson O-Score |
| 7 | **Risk Assessor** | PD/LGD/EAD/EL, composite scoring (55/35/10 weights) |
| 8 | **Compliance Checker** | 8 quantitative checks, RBI IRAC norms |
| 9 | **Forecasting & Simulation** | 10K Monte Carlo, DCF, VaR/CVaR, stress testing |
| 10 | **Benchmarking & Statistics** | HHI, percentile ranking, peer comparison |
| 11 | **Ask User Question** | Human-in-the-loop with interrupt/resume |
| 12 | **Critic & Verifier** | 5-criteria verification with retry logic |
| 13 | **Report Synthesizer** | PDF generation, JSON export, explainability |
| 14 | **Document Intelligence** | Multi-format OCR via AWS Textract, SHA256 caching |
| 15 | **Sentiment & Macro** | News sentiment via DuckDuckGo, macro indicators |
| 16 | **Fraud Signal** | Benford's Law chi-square, leverage analysis |
| 17 | **Portfolio Risk** | PD distribution, HHI concentration, Basel III RWA |
| 18 | **Dashboard Analytics** | KPI aggregation, trend analysis |

## 3 LangGraph Workflows

1. **Credit Analysis Graph** — Full 14-agent parallel analysis with conditional edges, human-in-the-loop question handling, and verification retry (max 3 attempts)
2. **Knowledge Update Graph** — Document monitoring → Textract OCR → C-RAG curation → OpenSearch indexing → verification → analytics update
3. **Interactive Session Graph** — RAG-powered chat with conversation history and context-aware responses

## Key Features

- **RBAC Authentication** — JWT + bcrypt with 3 roles: Customer, Employee, Admin
- **Real-time SSE Streaming** — Live agent progress updates during analysis
- **Multi-Compare Analysis** — Side-by-side comparison of multiple credit analyses
- **Credit Score Trends** — Historical tracking with trend visualization
- **Knowledge Base Search** — Semantic search across all indexed documents
- **RAG-Powered Chat** — AI assistant with full knowledge base context
- **Employee Review Queue** — Approve/Reject/Escalate workflow
- **Portfolio Analytics** — Sector concentration, rating distribution, Basel III RWA
- **Regulatory Alerts** — Automated compliance notifications
- **Audit Logging** — Full request/action trail for compliance

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python 3.11, FastAPI, LangGraph, Pydantic |
| LLM | Groq API (llama-3.3-70b-versatile, mixtral-8x7b-32768) |
| Frontend | Next.js 14, React 18, Tailwind CSS, Recharts, Framer Motion |
| Database | MongoDB Atlas (motor async driver) |
| Cache | Redis 7 |
| Vector DB | AWS OpenSearch Serverless (384-dim, HNSW cosine) |
| Storage | AWS S3 |
| OCR | AWS Textract |
| Email | AWS SES |
| ML | sentence-transformers (all-MiniLM-L6-v2) |
| Container | Docker (multi-stage) |
| Orchestration | Kubernetes (k3s) |
| IaC | Terraform (Oracle Cloud) |
| CI/CD | GitHub Actions |
| Charts | Helm 3 |

## Project Structure

```
.
├── backend/
│   ├── agents/           # 18 AI agents
│   ├── graphs/           # 3 LangGraph workflows
│   ├── models/           # Pydantic models
│   ├── routers/          # FastAPI route handlers
│   ├── services/         # External service integrations
│   ├── middleware/        # Auth & logging middleware
│   ├── tests/            # Unit tests (pytest)
│   ├── config.py         # Environment configuration
│   ├── main.py           # Application entry point
│   ├── requirements.txt  # Python dependencies
│   └── Dockerfile        # Multi-stage Docker build
├── frontend/
│   ├── src/
│   │   ├── app/          # Next.js 14 App Router pages
│   │   ├── components/   # React components
│   │   └── lib/          # API client, types, utils
│   ├── package.json
│   ├── tailwind.config.ts
│   └── Dockerfile
├── k8s/                  # Kubernetes manifests
├── helm/creditlens/      # Helm chart
├── terraform/            # OCI infrastructure
├── .github/workflows/    # CI/CD pipelines
├── scripts/              # Utility scripts
├── .env.example          # Environment template
└── README.md
```

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 20+
- MongoDB Atlas account
- Groq API key
- AWS account (S3, Textract, OpenSearch Serverless, SES)

### 1. Clone & Configure

```bash
git clone https://github.com/your-org/creditlens.git
cd creditlens
cp .env.example .env
# Edit .env with your credentials
```

### 2. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

### 4. Seed Database

```bash
python scripts/seed_db.py
```

### 5. Setup OpenSearch

```bash
python scripts/setup_opensearch.py
```

Access the app at `http://localhost:3000`. Default credentials are printed by the seed script.

## Docker

```bash
# Build images
docker build -t creditlens-backend ./backend
docker build -t creditlens-frontend ./frontend

# Run with docker compose (or manually)
docker run -d --env-file .env -p 8000:8000 creditlens-backend
docker run -d -e NEXT_PUBLIC_API_URL=http://localhost:8000 -p 3000:3000 creditlens-frontend
```

## Kubernetes Deployment

```bash
# Using raw manifests
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/redis-deployment.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/cronjob-rbac.yaml

# Using Helm
helm install creditlens ./helm/creditlens \
  --namespace creditlens --create-namespace \
  --set env.mongodbUri="$MONGODB_URI" \
  --set env.groqApiKey="$GROQ_API_KEY" \
  --set env.jwtSecretKey="$JWT_SECRET_KEY"
```

## Terraform (OCI)

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars
terraform init
terraform plan
terraform apply
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/auth/signup` | User registration |
| POST | `/api/v1/auth/login` | JWT login |
| GET | `/api/v1/auth/me` | Current user profile |
| POST | `/api/v1/analysis/start` | Start credit analysis |
| GET | `/api/v1/analysis/{id}/stream` | SSE agent progress stream |
| POST | `/api/v1/analysis/{id}/respond` | Answer agent question |
| GET | `/api/v1/analysis/{id}/report` | Get analysis report |
| GET | `/api/v1/analysis/{id}/report/pdf` | Download PDF report |
| POST | `/api/v1/documents/upload` | Upload document |
| GET | `/api/v1/documents/` | List documents |
| GET | `/api/v1/admin/analytics` | System analytics |
| GET | `/api/v1/admin/portfolio` | Portfolio analytics |
| GET | `/api/v1/employee/queue` | Review queue |
| POST | `/api/v1/employee/{id}/review` | Submit review |
| GET | `/api/v1/analytics/dashboard` | Dashboard data |
| POST | `/api/v1/chat/sessions` | Create chat session |
| POST | `/api/v1/chat/sessions/{id}/message` | Send chat message |

## Testing

```bash
# Backend tests
cd backend
python -m pytest tests/ -v

# Frontend tests
cd frontend
npm test
```

## Environment Variables

See [.env.example](.env.example) for all required environment variables.

## License

MIT
