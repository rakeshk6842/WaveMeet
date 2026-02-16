# Deployment Guide

## Local Development with Dev Container

### Prerequisites
- Docker Desktop installed
- VS Code with "Dev Containers" extension
- Git

### Setup Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd docker-ai-workspace
```

2. **Open in VS Code Dev Container**
   - Open the folder in VS Code
   - Click the Remote Containers icon (bottom-left corner)
   - Select "Reopen in Container"
   - Wait for container to build

3. **Start Services**
```bash
# Using Docker Compose
docker-compose up -d

# Or using Make
make setup
```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - pgAdmin: http://localhost:5050

## Docker Compose Deployment

### Quick Start

```bash
# Copy environment file
cp .env.example .env

# Build and start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### Production Configuration

For production deployment, modify `.env`:

```env
NODE_ENV=production
BACKEND_ENV=production
FRONTEND_ENV=production
JWT_SECRET=<generate-strong-random-key>
DB_PASSWORD=<strong-password>
```

### Health Checks

All services include health checks. Monitor them with:

```bash
docker-compose ps
docker-compose logs postgres
docker-compose logs redis
docker-compose logs dev
```

## Kubernetes Deployment

### Prerequisites
- Kubernetes cluster (1.20+)
- kubectl installed
- Docker images pushed to registry

### Create namespace

```bash
kubectl create namespace whatsapp
```

### Deploy PostgreSQL

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
  namespace: whatsapp
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15-alpine
        ports:
        - containerPort: 5432
        env:
        - name: POSTGRES_DB
          value: whatsapp_db
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-secrets
              key: password
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
      volumes:
      - name: postgres-storage
        persistentVolumeClaim:
          claimName: postgres-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: postgres
  namespace: whatsapp
spec:
  selector:
    app: postgres
  ports:
  - port: 5432
    targetPort: 5432
  clusterIP: None
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
  namespace: whatsapp
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 20Gi
```

### Deploy Redis

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis
  namespace: whatsapp
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
      - name: redis
        image: redis:7-alpine
        ports:
        - containerPort: 6379
        volumeMounts:
        - name: redis-storage
          mountPath: /data
      volumes:
      - name: redis-storage
        persistentVolumeClaim:
          claimName: redis-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: redis
  namespace: whatsapp
spec:
  selector:
    app: redis
  ports:
  - port: 6379
    targetPort: 6379
  clusterIP: None
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: redis-pvc
  namespace: whatsapp
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

### Deploy Backend

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: whatsapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: your-registry/whatsapp-backend:latest
        ports:
        - containerPort: 5000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DB_HOST
          value: postgres
        - name: REDIS_HOST
          value: redis
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: jwt-secret
        livenessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 10
          periodSeconds: 5
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: backend
  namespace: whatsapp
spec:
  selector:
    app: backend
  ports:
  - port: 5000
    targetPort: 5000
  type: LoadBalancer
```

### Deploy Frontend

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: whatsapp
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: your-registry/whatsapp-frontend:latest
        ports:
        - containerPort: 3000
        env:
        - name: REACT_APP_API_URL
          value: "http://api.yourdomain.com"
        livenessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
---
apiVersion: v1
kind: Service
metadata:
  name: frontend
  namespace: whatsapp
spec:
  selector:
    app: frontend
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer
```

### Create Secrets

```bash
kubectl create secret generic db-secrets \
  --from-literal=password=your-secure-password \
  -n whatsapp

kubectl create secret generic app-secrets \
  --from-literal=jwt-secret=your-jwt-secret \
  -n whatsapp
```

### Deploy to Kubernetes

```bash
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/redis.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml

# Check deployment status
kubectl get all -n whatsapp

# View logs
kubectl logs -f deployment/backend -n whatsapp
```

## Docker Hub Registry

### Build and Push Images

```bash
# Build backend image
docker build -f backend/Dockerfile -t your-registry/whatsapp-backend:latest backend/

# Build frontend image
docker build -f frontend/Dockerfile -t your-registry/whatsapp-frontend:latest frontend/

# Login to registry
docker login

# Push images
docker push your-registry/whatsapp-backend:latest
docker push your-registry/whatsapp-frontend:latest
```

## AWS ECS Deployment

### Create ECS Task Definition

```json
{
  "family": "whatsapp-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "your-ecr-repo/whatsapp-backend:latest",
      "portMappings": [
        {
          "containerPort": 5000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "DB_HOST",
          "value": "postgres.c5abc1a.us-east-1.rds.amazonaws.com"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/whatsapp",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### Deploy with ECS CLI

```bash
ecs-cli compose service up \
  --cluster-name whatsapp-cluster \
  --region us-east-1
```

## Monitoring & Logging

### Set up Prometheus

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'backend'
    static_configs:
      - targets: ['localhost:5000']
```

### Set up ELK Stack

```bash
docker-compose -f docker-compose.elk.yml up -d
```

## Backup & Restore

### PostgreSQL Backup

```bash
docker-compose exec postgres pg_dump -U postgres whatsapp_db > backup.sql
```

### PostgreSQL Restore

```bash
docker-compose exec postgres psql -U postgres whatsapp_db < backup.sql
```

### Redis Backup

```bash
docker-compose exec redis redis-cli BGSAVE
```

## Performance Optimization

1. **Enable Redis Caching**
2. **Use CDN for static assets**
3. **Enable compression (gzip)**
4. **Optimize database queries with indexes**
5. **Implement rate limiting**
6. **Use connection pooling**
7. **Enable CORS caching**

## Security Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT secret
- [ ] Enable HTTPS/TLS
- [ ] Configure CORS properly
- [ ] Implement rate limiting
- [ ] Add input validation
- [ ] Use environment variables for secrets
- [ ] Regular security updates
- [ ] Enable database encryption
- [ ] Set up firewall rules
- [ ] Configure SSL certificates
- [ ] Enable audit logging

## Troubleshooting

### Connection Refused
```bash
# Check if services are running
docker-compose ps

# Check logs
docker-compose logs postgres
docker-compose logs redis
```

### Database Issues
```bash
# Check database
docker-compose exec postgres psql -U postgres -c "\l"

# Rebuild database
make db-reset
```

### Port Conflicts
Change ports in `docker-compose.yml` or kill processes on those ports.

### Out of Memory
Increase Docker resource limits in Docker Desktop settings.

---

For more help, refer to the main README.md or contact support.
