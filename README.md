# Technical Deployment & Architecture Specification

## Car Dealership Review System — Full-Stack Capstone

---

## 1. SYSTEM ARCHITECTURE & ENVIRONMENT SPECIFICATION

### Host OS & Interface Tier

Windows 11 acting as a thin-client graphical interface running VS Code Remote WSL extension. The host provides desktop GUI services, file explorer integration, and port-forwarding proxies for WSL 2 network interfaces.

### Execution & Shell Layer

WSL 2 (Ubuntu Distribution) hosting a persistent backend Linux kernel with full systemd support. All server-side processes, container runtimes, and orchestration layers execute within this layer. The WSL 2 lightweight Hyper-V virtual machine provides native Linux syscall compatibility and ext4 filesystem performance.

### Storage Subsystem

Native Linux ext4 virtual disk volume mapped to `/home/bassal/final-project/xrwvm-fullstack_developer_capstone/`. Docker persistent volumes are managed via Docker Engine's `volume` subsystem (`mongo_data` named volume). Kubernetes ephemeral storage is managed by the Minikube node's container filesystem.

### Hardware Profile

Dell Latitude E6420 Laptop. This is a legacy enterprise-grade notebook. All orchestration and microservices run within the constraints of this hardware profile, demonstrating the viability of lightweight local Kubernetes development clusters on modest hardware.

### Cluster Infrastructure

Minikube v1.38.1 running a local single-node Kubernetes v1.35.1 cluster driven by the Docker driver. The Minikube node operates as a single Docker container on the host Docker daemon, providing a virtualized Kubernetes control plane and worker node within a single container boundary.

### Containerization Runtime

Docker Engine (user-space daemon managed via `systemctl`) running on WSL 2. Docker Compose v2 orchestrates multi-container stacks on the host network. Minikube's Docker driver shares the host Docker daemon's socket, enabling local image builds to be consumed directly by the Kubernetes cluster without a registry.

### Runtime Services Matrix

| Service | Port | Runtime | Host/Cluster | Description |
|:---|:---|:---|:---|:---|
| Django / Gunicorn | 8000 | Python 3.12 | Kubernetes Pod | Primary web application and API proxy |
| Node.js / Express | 3030 | Node.js 18 | Docker Compose (host) | MongoDB REST API for dealerships and reviews |
| MongoDB | 27017 | mongod | Docker Compose (host) | NoSQL document store |
| Sentiment Analyzer | 5050 | Python / Flask | Docker Compose (host) | NLP sentiment scoring microservice |

---

## 2. TOOLCHAIN & RUNTIME COMPONENT MATRIX

| Component | Runtime / Ecosystem | Isolation Method | Function within Architecture |
|:---|:---|:---|:---|
| **Frontend/Proxy** | Python 3.12 (Django 3.2 + Gunicorn) | `python3-venv` & Kubernetes Pod | Serves React UI static assets from `frontend/build/`, proxies REST requests to backend API via `restapis.py` |
| **Database Tier** | MongoDB (Latest Image) | Docker Compose Named Volume (`mongo_data`) | Persistent NoSQL store for dealership records (50 entries) and review entries (100 entries) |
| **Backend API** | Node.js 18 / Express 4.18 | Docker Compose Service Network | Provides REST endpoints (`/fetchDealers`, `/fetchReviews`, `/insert_review`) for database CRUD transactions |
| **AI Microservice** | Python 3.9 / Flask / NLTK VADER | Docker Compose Service Network | Executes NLP compound-score sentiment processing on user review text, returns positive/negative/neutral classification |
| **React Frontend** | React 18.2 / React Router 6.19 | Static build output in `frontend/build/` | Client-side SPA with routes for `/login`, `/register`, `/dealers`, `/dealer/:id`, `/postreview/:id` |
| **Orchestration** | Minikube v1.38.1 / Kubernetes v1.35.1 | Docker driver single-node cluster | Manages Django Pod lifecycle, rolling updates, and ConfigMap/Secret injection |
| **Local Compose** | Docker Compose v3.9 | Host Docker network | Orchestrates MongoDB, Node.js API, and Sentiment Analyzer as co-located services |
| **CI Pipeline** | GitHub Actions | Cloud-hosted runner | Runs flake8 (Python) and JSHint (JavaScript) linting on push |

---

## 3. CHRONOLOGICAL EVOLUTIONARY DEVELOPMENTS (GIT LEDGER)

The repository contains 241 commits spanning from November 14, 2023 to June 24, 2026. Development occurred in two distinct author eras separated by approximately 17 months of dormancy.

### Phase 1: Initial Project Scaffold (Nov 14–19, 2023)

**Commits:** `c0d4ab4` → `8f34334` | **Author:** `lavskillup` (IBM Skills Network)

The repository originated from the IBM Skills Network `coding-project-template`. Within five days, the following structural transformations occurred:

- `c0d4ab4` — Initial commit: `.gitignore` (129 lines, Python/Django defaults), `LICENSE` (Apache 2.0, IBM Developer Skills Network copyright), `README.md`.
- `0550bdb` — **160 files added**: Complete Django project under `server/djangobackend/`, with `djangoapp/` containing `views.py`, `models.py`, `restapis.py`, templates (`about.html`, `contact.html`, `index.html`, `add_review.html`, `dealer_details.html`, `registration.html`), static assets, `Procfile`, `manifest.yml`.
- `78475a0` — **Major restructure**: Renamed `djangobackend/` → `djangoproj/`. Removed 152 files of boilerplate (static/admin files, Procfile, manifest.yml, templates). Established the clean `djangoproj/` + `djangoapp/` package split.
- `8f34334` — **React frontend scaffolded** via Create React App at `server/frontend/`. Added `package.json` with React 18.2, React Router DOM.

**Mechanical adjustments:** The Django project namespace was renamed from `djangobackend` to `djangoproj` to align with standard Django project naming conventions. All `settings.py` references to `ROOT_URLCONF`, `WSGI_APPLICATION`, and `INSTALLED_APPS` were updated to reflect the new package name.

### Phase 2: Database / MongoDB Layer (Nov 20–21, 2023)

**Commits:** `e967413` → `c07e79d` | **Author:** `lavskillup`

- `e967413` — Created `server/database/loaddb.py` (44 lines): Python script using `pymongo` to bulk-load JSON seed data into MongoDB.
- `a50363c` → `6b531d3` — Created seed data files: `dealerships.json` (604 lines, 50 records), `reviews.json` (1104 lines, 100 records), `reviews-full.json` (expanded dataset).
- `3978274` — **Created `server/database/app.js`** (56 lines): Express.js server on port 3030, Mongoose connection to `mongodb://mongo_db:27017/`, endpoints for `/fetchDealers`, `/fetchReviews`, `/fetchDealers/:state`, `/fetchDealer/:id`, `/fetchReviews/dealer/:id`, `/insert_review`.
- `ed07f92` — Created `server/database/review.js`: Mongoose schema for reviews (id, name, dealership, review, purchase, purchase_date, car_make, car_model, car_year).
- `acf35ca` — Created `server/database/dealership.js`: Mongoose schema for dealerships (id, city, state, address, zip, lat, long, short_name, full_name).
- `c07e79d` — Created `server/database/package.json`: Declared dependencies on `express`, `mongoose`, `cors`, `body-parser`, `mongodb`.

**Mechanical adjustments:** The MongoDB connection string was hardcoded as `mongodb://mongo_db:27017/` where `mongo_db` is the Docker Compose service name. The `/insert_review` endpoint implements auto-incrementing IDs by querying `Reviews.find().sort({ id: -1 })` and incrementing the highest existing ID.

### Phase 3: Docker Containerization (Nov 21 – Dec 2, 2023)

**Commits:** `b67bb48` → `719426b` | **Author:** `lavskillup`

- `b67bb48` — **Created `server/database/Dockerfile`**: `node:18.12.1-bullseye-slim` base, `npm install`, exposes port 3030, `CMD ["node", "app.js"]`.
- `78c080b` — **Created `server/database/docker-compose.yml`**: Single `mongo_db` service using `mongo:latest`, port 27017, named volume `mongo_data`.
- `5835933` — Updated database Dockerfile with explicit `ADD` instructions for individual files.
- `719426b` — **Created `server/entrypoint.sh`**: Shell script executing `makemigrations`, `migrate`, `collectstatic`, then `exec "$@"` for container CMD passthrough.

**Mechanical adjustments:** The Docker Compose file used `version: '3.9'` schema. The MongoDB container was named `db_container` with `restart: always` policy. The Node.js API was added as a second service (`api`) with `depends_on: mongo_db` to ensure startup ordering.

### Phase 4: Sentiment Analyzer Microservice (Nov 27, 2023)

**Commits:** `af5715d` → `bd5ebe2` | **Author:** `lavskillup`

- `af5715d` — **Created `server/djangoapp/microservices/app.py`** (28 lines): Minimal Flask app with `/analyze` endpoint using NLTK `SentimentIntensityAnalyzer`.
- `3c068a0` — **Created `server/djangoapp/microservices/Dockerfile`**: `python:3.9.18-slim-bookworm`, pip install from `requirements.txt`, exposes port 5000.
- `bd5ebe2` — **Created `server/djangoapp/microservices/requirements.txt`**: `Flask` and `nltk`.

**Mechanical adjustments:** The microservice was scaffolded but not wired into the Docker Compose network or Django views at this stage. It remained dormant for approximately 30 months.

### Phase 5: Static Pages, UI, and Frontend Development (Dec 6, 2023 – Jan 18, 2024)

**Commits:** `eddb6e9` → `f0df7aa` | **Authors:** `lavskillup`, external contributors

- Created `About.html`, `Contact.html`, `Home.html` as Django template static pages.
- Created React components: `Login.jsx`, `Login.css`, `Register.jsx`, `Register.css`, `Header.jsx`, `Dealers.jsx`, `Dealer.jsx`, `PostReview.jsx`, `Dealers.css`.
- Applied dark modern theme CSS styling with Bootstrap integration.
- Added profile images and static assets to `frontend/static/`.
- Configured Django `TEMPLATES` and `STATICFILES_DIRS` in `settings.py` to serve both `frontend/static/` and `frontend/build/`.

**Mechanical adjustments:** Django's `TEMPLATES['DIRS']` was extended to include `frontend/static` and `frontend/build` paths, enabling Django to serve the React SPA's `index.html` as a template for all client-side routes. `STATICFILES_DIRS` was configured to expose the React build output as Django static assets.

### Phase 6: Long Dormancy (Jan 2024 – Jun 2026)

Approximately 17 months with only two external pull requests merged (`#216` and `#201`), both updating `Dealer.jsx` with minor UI fixes. The project remained in a partially integrated state: Django served the React UI, the Node.js API and MongoDB were containerized, but the sentiment analyzer was unwired, environment variables were hardcoded, and Kubernetes manifests did not exist.

### Phase 7: Capstone Revival and Full Integration (Jun 18–24, 2026)

**Commits:** `4153969` → `f109168` | **Author:** `Amr Bassal`

This phase compressed 21 commits across 6 days, using conventional commit message format (`feat:`, `fix:`, `chore:`, `style:`, `test:`, `refactor:`, `build:`).

**Jun 18 — Project Rename and Structural Foundation:**
- `4153969` — Renamed project from `coding-project-template` to `fullstack_developer_capstone`.
- `feef17a` → `287058d` — Added About Us and Contact Us pages with React routing.
- `e01ae64` — Compiled React frontend assets and mounted build paths in `settings.py`.

**Jun 19 — Authentication and Routing:**
- `ff0fb52` — Added backend logout functionality, resolved global dark theme inconsistencies.
- `9abeb8c` — Fixed logout button, implemented React signup, configured app routing.
- `8ec8ae4` — Added `AGENTS.md`, auth test runner (`run_auth_test.py`), and auth flow tests (`tests/test_auth_flow.py`).

**Jun 20 — Database API and Testing:**
- `0adcc2c` — Set up database API endpoints with CORS middleware and body parsing.
- `72888e8` — Added automated MongoDB API test suite with 28 tests (`database/test/api.test.js`) using Mocha/Chai/Supertest.
- `8e8d57d` — **Production-ready env config**: Added `dotenv` with `MONGO_URI` priority over individual `MONGO_HOST`/`MONGO_PORT`, `SEED_DATABASE` environment guard, created `database/.env.example`.
- `36cce12` — Implemented `CarMake`/`CarModel` Django models with admin registration and `get_cars` API endpoint.

**Jun 21 — Microservices Integration:**
- `a3844c0` — **Major integration commit**: Implemented dealer APIs (`get_dealerships`, `get_dealer_details`, `get_dealer_reviews`), review submission (`add_review`), and sentiment analyzer microservice consumption. Rewrote `restapis.py` (55 insertions), `views.py` (51 insertions).
- `4306dff` — Improved sentiment analyzer accuracy, fixed Docker setup. Added NLTK `vader_lexicon` download to Dockerfile build step.
- `cf7bc35` — **Replaced mock reviews with realistic data** (100 entries, 50 dealerships), added sentiment service to `docker-compose.yml` as third service.
- `f27e89e` — Improved sentiment analyzer with compound scoring and better error handling.
- `b8edb14` — Redesigned frontend UI with dark theme and Bootstrap styling.

**Jun 24 — Production Hardening:**
- `8d7709f` — Added CI workflow for linting Python and JavaScript files.
- `24c718b` — Fixed all flake8 linting issues across codebase.
- `273ce70` — Fixed JSHint warnings in Node.js database files.
- `9160939` — Wrapped long lines in Django migration to fix E501.
- **`f109168`** — **Comprehensive environment variable extraction** (15 files, 125 insertions): Replaced all hardcoded secrets, URLs, and configuration across Django, Node.js API, Flask microservice, and tests. Created `deployment.yaml`, `configmap.yaml`, `secret.yaml` for Kubernetes.

---

## 4. HYBRID NETWORK TOPOLOGY & DECOUPLING DESIGN

### The Network Boundary Problem

When the Django application runs inside a Minikube Kubernetes Pod, it resides in a virtualized cluster network (typically `10.244.x.x`). The MongoDB, Node.js API, and Sentiment Analyzer services run on the host machine via Docker Compose on the host network. These two network domains are isolated by default — a Pod cannot reach `localhost:3030` on the host.

### Resolution via `host.minikube.internal`

Minikube provides a special DNS name `host.minikube.internal` that resolves to the host machine's IP address from within the cluster. This DNS bridge is automatically configured by the Minikube Docker driver and eliminates the need for hardcoded IP addresses or complex network policies.

### Integration Design

The network decoupling is implemented through three layers:

**Layer 1 — Kubernetes ConfigMap (`server/configmap.yaml`):**
```yaml
data:
  node-api-url: "http://host.minikube.internal:3030"
  sentiment-analyzer-url: "http://host.minikube.internal:5050"
  mongo-uri: "mongodb://host.minikube.internal:27017/"
  mongo-db-name: "dealershipsDB"
```

Non-sensitive endpoint URLs are stored in a ConfigMap, allowing environment-specific overrides without rebuilding container images.

**Layer 2 — Kubernetes Secret (`server/secret.yaml`):**
```yaml
stringData:
  django-secret-key: "django-insecure-ccow$tz_=9%dxu4(0%^(z%nx32#s@(zt9$ih@)5l54yny)wm-0"
```

Sensitive credentials are isolated in a Secret resource, referenced via `secretKeyRef` in the Deployment manifest.

**Layer 3 — Deployment Environment Injection (`server/deployment.yaml`):**
```yaml
env:
- name: NODE_API_URL
  valueFrom:
    configMapKeyRef:
      name: dealership-config
      key: node-api-url
- name: SENTIMENT_ANALYZER_URL
  valueFrom:
    configMapKeyRef:
      name: dealership-config
      key: sentiment-analyzer-url
- name: DJANGO_SECRET_KEY
  valueFrom:
    secretKeyRef:
      name: dealership-secrets
      key: django-secret-key
```

**Layer 4 — Django Application Consumption (`server/djangoapp/restapis.py`):**
```python
backend_url = os.environ.get('NODE_API_URL', default="http://localhost:3030")
sentiment_analyzer_url = os.environ.get('SENTIMENT_ANALYZER_URL', default="http://localhost:5050/")
```

The `os.environ.get()` pattern provides dual-mode operation: environment variables are injected in Kubernetes, while `.env` files provide defaults for local development.

### Network Topology Diagram

```
┌──────────────────────────────────────────────────────────┐
│  Minikube Kubernetes Cluster (Docker Driver)             │
│                                                          │
│  ┌──────────────────────────────────────────────────┐    │
│  │  Pod: dealership                                  │    │
│  │  Container: local/dealership:latest               │    │
│  │  Port: 8000 (Gunicorn)                           │    │
│  │                                                   │    │
│  │  Env: NODE_API_URL ──────────────┐                │    │
│  │  Env: SENTIMENT_ANALYZER_URL ────┤                │    │
│  │  Env: MONGO_URI ─────────────────┤                │    │
│  │  Env: DJANGO_SECRET_KEY (Secret) │                │    │
│  └──────────────────────────────────│────────────────┘    │
│                                     │                     │
│            host.minikube.internal   │                     │
│            DNS resolution ──────────┘                     │
└──────────────────────────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────────┐
│  Host Machine (WSL 2 Ubuntu)                             │
│                                                          │
│  Docker Compose Network                                  │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │  MongoDB     │  │  Node.js API │  │  Sentiment     │  │
│  │  :27017      │  │  :3030       │  │  Analyzer      │  │
│  │  (mongo:lat) │  │  (nodeapp)   │  │  :5050→:5000   │  │
│  └─────────────┘  └──────────────┘  └────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

---

## 5. LOCAL DEPLOYMENT & VERIFICATION PLAYBOOK

### Prerequisites

- Docker Engine running on WSL 2 (`sudo systemctl start docker`)
- Minikube installed (`minikube version` — v1.38.1)
- `kubectl` available in PATH
- Node.js 18+ and Python 3.12+ installed locally

### Step 1: Start the Backend Compose Stack

```bash
cd server/database
docker-compose up -d
```

This instantiates three services:
- `mongo_db` (MongoDB on port 27017 with `mongo_data` volume)
- `api` (Node.js Express on port 3030, depends on `mongo_db`)
- `sentiment` (Flask Sentiment Analyzer on host port 5050, container port 5000)

**Verification:**
```bash
docker-compose ps                          # All 3 services should be "Up"
curl http://localhost:3030/fetchDealers     # Should return JSON array of 50 dealers
curl http://localhost:5050/analyze?text=good # Should return {"sentiment":"positive",...}
```

### Step 2: Point Shell to Minikube Docker Environment

```bash
eval $(minikube docker-env)
```

This configures the current shell session to use the Minikube node's Docker daemon instead of the host Docker daemon. Images built in this shell session are immediately available to Kubernetes Pods without pushing to a registry.

**Verification:**
```bash
docker info | grep "Server Version"  # Should show Docker daemon inside Minikube
```

### Step 3: Build the Local Kubernetes Image

```bash
cd server
docker build -t local/dealership:latest .
```

This builds the Django + Gunicorn image using `server/Dockerfile`:
- Base: `python:3.12.0-slim-bookworm`
- Installs dependencies from `requirements.txt`
- Copies application code to `/app`
- Runs `entrypoint.sh` (makemigrations, migrate, collectstatic)
- Starts Gunicorn on port 8000 with 3 workers

**Verification:**
```bash
docker images | grep local/dealership  # Should show local/dealership:latest
```

### Step 4: Instantiate Manifests and Force Rolling Update

```bash
kubectl apply -f server/configmap.yaml
kubectl apply -f server/secret.yaml
kubectl apply -f server/deployment.yaml
kubectl rollout restart deployment dealership
```

This sequence:
1. Creates/updates the `dealership-config` ConfigMap with endpoint URLs
2. Creates/updates the `dealership-secrets` Secret with Django secret key
3. Creates/updates the `dealership` Deployment referencing `local/dealership:latest` with `imagePullPolicy: Never`
4. Forces a rolling restart to pick up the latest image

**Verification:**
```bash
kubectl get pods -l run=dealership       # Should show 1/1 Running
kubectl get configmap dealership-config  # Should exist
kubectl get secret dealership-secrets    # Should exist
kubectl logs deployment/dealership       # Should show Gunicorn startup logs
```

### Step 5: Bind the Network Proxy Interface Tunnel

```bash
kubectl port-forward deployment/dealership 8000:8000
```

This establishes a foreground TCP tunnel from `localhost:8000` on the WSL 2 host to port 8000 inside the Kubernetes Pod. The Django application is now accessible at `http://localhost:8000/`.

**Verification:**
```bash
curl http://localhost:8000/               # Should return Home.html content
curl http://localhost:8000/djangoapp/get_dealers  # Should return dealer JSON from Node.js API
```

### Full Verification Checklist

| Check | Command | Expected Result |
|:---|:---|:---|
| MongoDB seeding | `curl http://localhost:3030/fetchDealers` | JSON array, 50 dealers |
| Node.js API | `curl http://localhost:3030/fetchReviews` | JSON array, 100+ reviews |
| Sentiment Analyzer | `curl http://localhost:5050/analyze?text=excellent` | `{"sentiment":"positive",...}` |
| Django static serving | `curl -I http://localhost:8000/` | `200 OK`, HTML content |
| Django to Node.js proxy | `curl http://localhost:8000/djangoapp/get_dealers` | Dealer data via Django |
| Django to Sentiment proxy | `curl http://localhost:8000/djangoapp/reviews/dealer/15` | Reviews with sentiment scores |
| Auth flow | `python server/run_auth_test.py` | All steps succeeded |
| MongoDB API tests | `cd server/database && npm test` | 28 tests passing |

### Service Endpoint Reference

| Endpoint | Method | Source Service | Description |
|:---|:---|:---|:---|
| `/` | GET | Django | Home page (React SPA) |
| `/about/` | GET | Django | About Us page |
| `/contact/` | GET | Django | Contact Us page |
| `/login/` | GET | Django | Login page (React SPA) |
| `/register/` | GET | Django | Registration page (React SPA) |
| `/dealers/` | GET | Django | Dealers page (React SPA) |
| `/djangoapp/login` | POST | Django | User authentication |
| `/djangoapp/register` | POST | Django | User registration |
| `/djangoapp/logout` | GET | Django | Session termination |
| `/djangoapp/get_dealers` | GET | Django -> Node.js | Fetch all dealerships |
| `/djangoapp/get_dealers/<state>` | GET | Django -> Node.js | Fetch dealerships by state |
| `/djangoapp/dealer_details/<id>` | GET | Django -> Node.js | Fetch single dealership |
| `/djangoapp/reviews/dealer/<id>` | GET | Django -> Node.js + Sentiment | Fetch reviews with sentiment |
| `/djangoapp/add_review` | POST | Django -> Node.js | Submit new review (auth required) |
| `/fetchDealers` | GET | Node.js API | Raw dealer data |
| `/fetchReviews` | GET | Node.js API | Raw review data |
| `/insert_review` | POST | Node.js API | Insert review document |
| `/analyze?text=<str>` | GET | Sentiment Analyzer | NLP sentiment scoring |

---

## Appendix A: File Structure Reference

```
xrwvm-fullstack_developer_capstone/
├── AGENTS.md
├── server/
│   ├── Dockerfile                          # Django container image
│   ├── deployment.yaml                     # Kubernetes Deployment manifest
│   ├── configmap.yaml                      # Kubernetes ConfigMap (endpoints)
│   ├── secret.yaml                         # Kubernetes Secret (Django key)
│   ├── entrypoint.sh                       # Container entrypoint (migrations)
│   ├── manage.py                           # Django management CLI
│   ├── requirements.txt                    # Python dependencies
│   ├── db.sqlite3                          # SQLite database (Django auth)
│   ├── run_auth_test.py                    # Auth flow test runner
│   ├── djangoproj/                         # Django project package
│   │   ├── settings.py                     # Application configuration
│   │   ├── urls.py                         # Root URL routing
│   │   ├── wsgi.py                         # WSGI entry point
│   │   └── asgi.py                         # ASGI entry point
│   ├── djangoapp/                          # Django application package
│   │   ├── .env                            # Environment variables
│   │   ├── models.py                       # CarMake, CarModel models
│   │   ├── views.py                        # View functions
│   │   ├── urls.py                         # App URL routing
│   │   ├── restapis.py                     # HTTP client for backend APIs
│   │   ├── populate.py                     # Database seeder
│   │   ├── admin.py                        # Admin registration
│   │   ├── migrations/                     # Django migrations
│   │   ├── tests/                          # Python tests
│   │   │   └── test_auth_flow.py           # Authentication flow tests
│   │   └── microservices/                  # Sentiment Analyzer
│   │       ├── app.py                      # Flask application
│   │       ├── Dockerfile                  # Microservice container image
│   │       ├── .env                        # Flask environment
│   │       ├── requirements.txt            # Python dependencies
│   │       └── sentiment/vader_lexicon.zip # NLTK lexicon data
│   ├── database/                           # MongoDB Node.js API
│   │   ├── app.js                          # Express server
│   │   ├── dealership.js                   # Mongoose dealership schema
│   │   ├── review.js                       # Mongoose review schema
│   │   ├── inventory.js                    # Mongoose inventory schema
│   │   ├── package.json                    # Node.js dependencies
│   │   ├── Dockerfile                      # API container image
│   │   ├── docker-compose.yml              # Compose orchestration
│   │   ├── .env                            # Environment variables
│   │   ├── .env.example                    # Documented env template
│   │   ├── data/                           # Seed data
│   │   │   ├── dealerships.json            # 50 dealership records
│   │   │   ├── reviews.json                # 100 review records
│   │   │   └── car_records.json            # 200+ car inventory records
│   │   └── test/
│   │       └── api.test.js                 # Mocha/Chai API tests
│   └── frontend/                           # React SPA
│       ├── package.json                    # React dependencies
│       ├── build/                          # Production build output
│       ├── public/                         # Static public assets
│       ├── static/                         # Django-served static pages
│       │   ├── Home.html                   # Home page template
│       │   ├── About.html                  # About page template
│       │   └── Contact.html                # Contact page template
│       └── src/
│           ├── App.js                      # React Router configuration
│           ├── index.js                    # React DOM entry point
│           └── components/
│               ├── Login/                  # Login component
│               ├── Register/               # Registration component
│               ├── Header/                 # Navigation header
│               └── Dealers/                # Dealer listing and review components
```

## Appendix B: Environment Variable Matrix

| Variable | File / Source | Default | Injection Method (K8s) |
|:---|:---|:---|:---|
| `NODE_API_URL` | `djangoapp/.env` | `http://localhost:3030` | ConfigMap `dealership-config` |
| `SENTIMENT_ANALYZER_URL` | `djangoapp/.env` | `http://localhost:5050/` | ConfigMap `dealership-config` |
| `DJANGO_SECRET_KEY` | `djangoapp/.env` | `django-insecure-...` | Secret `dealership-secrets` |
| `DJANGO_DEBUG` | `djangoapp/.env` | `True` | Hardcoded `"False"` in deployment.yaml |
| `MONGO_URI` | `djangoapp/.env` | `mongodb://localhost:27017/` | ConfigMap `dealership-config` |
| `MONGO_DB_NAME` | `djangoapp/.env` | `dealershipsDB` | ConfigMap `dealership-config` |
| `SEED_DATABASE` | `database/.env` | `true` | N/A (Compose only) |
| `MONGO_HOST` | `database/.env` | `mongo_db` | N/A (Compose only) |
| `MONGO_PORT` | `database/.env` | `27017` | N/A (Compose only) |
| `PORT` | `database/.env` | `3030` | N/A (Compose only) |
| `FLASK_HOST` | `microservices/.env` | `0.0.0.0` | N/A (Compose only) |
| `FLASK_PORT` | `microservices/.env` | `5000` | N/A (Compose only) |

---

*Generated from Git repository analysis of 241 commits. All file paths, directory structures, and terminal commands reflect the absolute state of the current repository HEAD (`f109168`).*
