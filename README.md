# 🤖 AI Chatbot SaaS Platform

A comprehensive, enterprise-grade AI chatbot SaaS platform built with modern technologies. Create, customize, and deploy intelligent chatbots with advanced RAG (Retrieval-Augmented Generation) capabilities.

## ✨ Features

### 🚀 Core Features
- **Multi-tenant Architecture** - Secure, scalable multi-user platform
- **Advanced RAG System** - Document processing with intelligent retrieval
- **Real-time Chat** - WebSocket-powered instant messaging
- **Custom Branding** - White-label chatbot widgets
- **Analytics Dashboard** - Comprehensive usage and performance metrics
- **Subscription Management** - Flexible pricing tiers with Stripe integration

### 🛠 Technical Features
- **Microservices Architecture** - Scalable backend services
- **Vector Database** - Pinecone/Weaviate integration for embeddings
- **Document Processing** - PDF, DOCX, TXT support with chunking
- **Web Scraping** - Automated website content ingestion
- **Multi-provider AI** - OpenAI, Anthropic, Cohere support
- **Enterprise Security** - JWT auth, rate limiting, audit logging

## 🏗 Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   AI Service    │
│   (React)       │◄──►│   (Express)     │◄──►│   (LangChain)   │
│   Port: 3000    │    │   Port: 3001    │    │   Port: 3002    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Widget        │    │   PostgreSQL    │    │   Vector DB     │
│   (Vanilla JS)  │    │   (Prisma)      │    │   (Pinecone)    │
│   Embeddable    │    │   Database      │    │   Embeddings    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- Redis 6+
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/ai-chatbot-saas.git
cd ai-chatbot-saas
```

2. **Install dependencies**
```bash
npm run install:all
```

3. **Environment Setup**
```bash
# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
cp ai-service/.env.example ai-service/.env

# Edit with your API keys and database URLs
```

4. **Database Setup**
```bash
cd backend
npx prisma migrate dev
npx prisma db seed
```

5. **Start Development**
```bash
# Start all services
npm run dev

# Or start individually:
npm run dev:backend    # Backend API (port 3001)
npm run dev:frontend   # Frontend (port 3000)
npm run dev:ai         # AI Service (port 3002)
```

## 📁 Project Structure

```
ai-chatbot-saas/
├── backend/           # Express.js API server
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Auth, validation, security
│   │   ├── models/        # Prisma models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── utils/         # Utilities
│   └── prisma/        # Database schema & migrations
├── frontend/          # React.js dashboard
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API services
│   │   └── utils/         # Utilities
│   └── public/        # Static assets
├── ai-service/        # AI processing service
│   ├── src/
│   │   ├── embeddings/    # Vector embeddings
│   │   ├── processors/    # Document processing
│   │   ├── services/      # AI services
│   │   └── utils/         # Utilities
├── widget/            # Embeddable chat widget
│   ├── src/           # Widget source code
│   └── dist/          # Built widget files
├── shared/            # Shared utilities & types
└── docs/              # Documentation
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/chatbot_db"
JWT_SECRET="your-super-secret-jwt-key"
REDIS_URL="redis://localhost:6379"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

#### AI Service (.env)
```env
OPENAI_API_KEY="sk-..."
ANTHROPIC_API_KEY="sk-ant-..."
COHERE_API_KEY="..."
PINECONE_API_KEY="..."
PINECONE_ENVIRONMENT="us-west1-gcp"
```

#### Frontend (.env)
```env
REACT_APP_API_URL="http://localhost:3001"
REACT_APP_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

## 🚀 Deployment

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build individual services
docker build -t chatbot-backend ./backend
docker build -t chatbot-frontend ./frontend
docker build -t chatbot-ai ./ai-service
```

### Production Deployment
- **Frontend**: Deploy to Vercel/Netlify
- **Backend**: Deploy to Railway/Render/AWS
- **Database**: PostgreSQL on AWS RDS/Supabase
- **Redis**: Redis Cloud/AWS ElastiCache
- **Vector DB**: Pinecone/Weaviate Cloud

## 📊 Features Overview

### Dashboard Features
- ✅ Bot Management & Configuration
- ✅ Document Upload & Processing
- ✅ Website Scraping Integration
- ✅ Real-time Analytics
- ✅ Subscription Management
- ✅ User Management
- ✅ Custom Branding

### AI Capabilities
- ✅ RAG (Retrieval-Augmented Generation)
- ✅ Multi-provider AI (OpenAI, Anthropic, Cohere)
- ✅ Document Chunking & Embeddings
- ✅ Semantic Search
- ✅ Context-aware Responses
- ✅ Conversation Memory

### Enterprise Features
- ✅ Multi-tenant Architecture
- ✅ Role-based Access Control
- ✅ API Rate Limiting
- ✅ Audit Logging
- ✅ Webhook Integration
- ✅ White-label Solutions

## 🔒 Security

- **Authentication**: JWT-based with refresh tokens
- **Authorization**: Role-based access control (RBAC)
- **Data Protection**: Encryption at rest and in transit
- **Rate Limiting**: API and user-level rate limiting
- **Input Validation**: Comprehensive request validation
- **Security Headers**: CORS, CSP, and security headers
- **Audit Logging**: Complete audit trail

## 📈 Scaling

### Horizontal Scaling
- Load balancer for multiple backend instances
- Redis cluster for session management
- Database read replicas
- CDN for static assets

### Performance Optimization
- Database indexing and query optimization
- Caching strategies (Redis, in-memory)
- Background job processing (Bull Queue)
- Vector database optimization

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run specific service tests
npm run test:backend
npm run test:frontend
npm run test:ai

# Run with coverage
npm run test:coverage
```

## 📚 API Documentation

API documentation is available at:
- Development: `http://localhost:3001/api/docs`
- Production: `https://your-domain.com/api/docs`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@your-domain.com
- 💬 Discord: [Join our community](https://discord.gg/your-invite)
- 📖 Documentation: [docs.your-domain.com](https://docs.your-domain.com)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/ai-chatbot-saas/issues)

## 🙏 Acknowledgments

- OpenAI for GPT models
- Anthropic for Claude models
- Pinecone for vector database
- Vercel for hosting platform
- All contributors and supporters

---

**Built with ❤️ by [Your Name](https://github.com/yourusername)**