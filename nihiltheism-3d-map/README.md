# Nihiltheism 3D Knowledge Map

A production-grade 3D knowledge graph visualization application for exploring Nihiltheism philosophy.

## 🚀 Features

- **Immersive 3D Visualization** - Interactive 3D graph using Three.js
- **AI-Powered Intelligence** - Semantic similarity and intelligent node placement
- **Offline-First Architecture** - Works without internet using IndexedDB
- **Advanced Search** - Fuzzy search with filters
- **Real-Time Collaboration** - MongoDB backend for data persistence
- **Professional UI** - Modern, responsive interface

## 📋 Prerequisites

- **Node.js** 18+ (LTS recommended)
- **Python** 3.10+
- **MongoDB** 6.0+

## 🛠️ Installation

### 1. Extract All Batches

Extract all 7 batch ZIP files into the same directory. They will merge into the complete `nihiltheism-3d-map` folder structure.

### 2. Configure Environment

```bash
cd nihiltheism-3d-map
cp .env.example .env
# Edit .env with your configuration
```

### 3. Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Install Python dependencies
cd ai-service
pip install -r requirements.txt
cd ..
```

### 4. Setup Database

```bash
# Make sure MongoDB is running
npm run setup
npm run seed
```

## 🏃 Running the Application

### Development Mode (All Services)

```bash
npm run dev
```

This starts:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- AI Service: http://localhost:8001

### Individual Services

```bash
# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend

# AI service only
npm run dev:ai
```

## 📁 Project Structure

```
nihiltheism-3d-map/
├── src/                    # Frontend React application
│   ├── components/         # UI components
│   ├── store/             # Zustand state management
│   ├── services/          # API clients
│   ├── utils/             # Helper functions
│   ├── types/             # TypeScript types
│   └── styles/            # CSS styles
├── backend/               # Node.js Express backend
│   ├── routes/           # API routes
│   ├── models/           # Database models
│   ├── middleware/       # Express middleware
│   └── config/           # Configuration
├── ai-service/           # Python FastAPI AI service
│   ├── models/          # AI models
│   └── services/        # AI services
├── scripts/             # Setup and seed scripts
└── public/              # Static files
```

## 🎨 Key Technologies

- **Frontend**: React, TypeScript, Three.js, Zustand
- **Backend**: Node.js, Express, MongoDB
- **AI**: Python, FastAPI, Sentence Transformers
- **Database**: MongoDB, IndexedDB

## 📖 Usage

1. **Create Nodes**: Click the "+" button or use the sidebar
2. **Navigate**: Left-click drag to rotate, right-click to pan, scroll to zoom
3. **Search**: Use the search panel to find nodes
4. **Filter**: Apply category and tag filters
5. **Connect**: Select nodes to create relationships

## 🔧 Configuration

Edit `.env` file for:
- MongoDB connection
- AI service settings
- Performance options
- Security settings

## 🐛 Troubleshooting

**MongoDB Connection Error**: Ensure MongoDB is running
**AI Service Error**: Check Python dependencies installed
**Port Already in Use**: Change ports in .env file

## 📝 License

MIT

## 👤 Author

Adam - Philosophy PhD specializing in Nihiltheism

## 🙏 Acknowledgments

Built for exploring the depths of philosophical nihilism and transcendent experience.
