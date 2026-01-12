# 🚀 Primus IDP Deployment Guide

## Quick Start Options

### Option 1: Railway (Easiest - 5 minutes)

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy with One Click**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login
   railway login
   
   # Initialize project
   railway init
   
   # Link to existing project or create new
   railway link
   
   # Deploy
   railway up
   ```

3. **Add Required Services**
   - In Railway dashboard, click "New" → "Database" → "PostgreSQL"
   - Click "New" → "Database" → "Redis"

4. **Set Environment Variables**
   In Railway dashboard → Variables:
   ```
   DATABASE_URL=<auto-populated by Railway PostgreSQL>
   CELERY_BROKER_URL=<auto-populated by Railway Redis>
   SECRET_KEY=<generate with: openssl rand -hex 32>
   OPENAI_API_KEY=<your-openai-key>
   ```

5. **Generate Domain**
   - Railway → Settings → Domains → Generate Domain

---

### Option 2: VPS with Docker (Most Control)

#### Prerequisites
- VPS with 4GB+ RAM (Hetzner, DigitalOcean, Vultr)
- Domain pointed to VPS IP
- SSH access

#### Deploy

**From Windows (PowerShell):**
```powershell
cd "c:\Users\Akki\Primus IDP"
.\scripts\Deploy-ToVPS.ps1 -Domain "yourdomain.com" -VpsHost "your-vps-ip"
```

**From Linux/Mac:**
```bash
# SSH to your VPS
ssh root@your-vps-ip

# Clone repository
git clone https://github.com/khanakkijpr-dot/Primus-IDP-v1.1-.git
cd Primus-IDP-v1.1-

# Run deployment script
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

---

### Option 3: Vercel + Railway (Hybrid)

Best for: Maximum performance with Vercel's edge network

1. **Deploy Backend to Railway**
   ```bash
   cd primus_idp_backend
   railway init
   railway up
   ```

2. **Deploy Frontend to Vercel**
   ```bash
   cd primus_idp_web
   npx vercel --prod
   ```

3. **Connect Services**
   - Set `NEXT_PUBLIC_FASTAPI_BACKEND_URL` in Vercel to Railway backend URL

---

## Environment Variables Reference

### Required
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `SECRET_KEY` | JWT signing key (generate with `openssl rand -hex 32`) |
| `OPENAI_API_KEY` | For GPT models (or use other LLM providers) |

### Optional
| Variable | Description | Default |
|----------|-------------|---------|
| `CELERY_BROKER_URL` | Redis URL for background tasks | - |
| `EMBEDDING_MODEL` | Embedding model name | `text-embedding-3-small` |
| `CORS_ORIGINS` | Allowed frontend origins | `*` |

### LLM Providers (Choose one or more)
| Variable | Provider |
|----------|----------|
| `OPENAI_API_KEY` | OpenAI |
| `ANTHROPIC_API_KEY` | Anthropic Claude |
| `GOOGLE_API_KEY` | Google AI |
| `AZURE_OPENAI_API_KEY` | Azure OpenAI |
| `OLLAMA_BASE_URL` | Self-hosted Ollama |

---

## Post-Deployment

### 1. Run Database Migrations
```bash
# Railway
railway run alembic upgrade head

# Docker
docker compose exec backend alembic upgrade head
```

### 2. Create Admin User
```bash
# Railway
railway run python create_user.py

# Docker  
docker compose exec backend python create_user.py
```

### 3. Configure DNS
Point your domain to:
- `yourdomain.com` → Frontend
- `api.yourdomain.com` → Backend

---

## Monitoring

### Health Checks
- Frontend: `https://yourdomain.com`
- Backend: `https://api.yourdomain.com/docs`
- API Health: `https://api.yourdomain.com/api/v1/health`

### Logs
```bash
# Railway
railway logs

# Docker
docker compose logs -f
```

---

## Scaling

### Railway
- Increase replicas in Railway dashboard
- Upgrade to Pro for more resources

### Docker
```bash
docker compose up -d --scale celery=4
```

---

## Troubleshooting

### Common Issues

**"Database connection refused"**
- Check `DATABASE_URL` format
- Ensure PostgreSQL is running

**"Redis connection failed"**
- Verify `CELERY_BROKER_URL`
- Check Redis password

**"CORS errors"**
- Set `CORS_ORIGINS` to your frontend URL

**"Migrations failed"**
```bash
# Reset migrations
alembic downgrade base
alembic upgrade head
```

---

## Support

- 📚 [Documentation](https://primusidp.net/docs)
- 💬 [Discord](https://discord.gg/ejRNvftDp9)
- 🐛 [Issues](https://github.com/khanakkijpr-dot/Primus-IDP-v1.1-/issues)
