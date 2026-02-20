import logging
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from services.placement import PlacementCalculator

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Nihiltheism AI Service", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize models
try:
    from sentence_transformers import SentenceTransformer, util
    logger.info("Loading SentenceTransformer model...")
    model = SentenceTransformer('all-MiniLM-L6-v2')
    logger.info("Model loaded successfully.")
except ImportError:
    model = None
    logger.warning("sentence-transformers not installed. Embeddings disabled.")
except Exception as e:
    model = None
    logger.error(f"Failed to load SentenceTransformer: {e}")

placement_calculator = PlacementCalculator()

# Pydantic Models
class Position3D(BaseModel):
    x: float
    y: float
    z: float

class NodeData(BaseModel):
    id: str
    category: str
    title: str
    description: Optional[str] = None
    position: Optional[Position3D] = None

class PlacementRequest(BaseModel):
    newNode: NodeData
    existingNodes: List[NodeData]
    learningRate: float = 0.05
    maxIterations: int = 100

class EmbeddingRequest(BaseModel):
    nodeId: str
    text: str
    category: str

class SimilarityRequest(BaseModel):
    sourceNodeId: str
    targetNodeIds: List[str]
    threshold: float = 0.65

# Endpoints

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "nihiltheism-ai"}

@app.post("/embeddings")
async def generate_embedding(request: EmbeddingRequest):
    if not model:
        # Fallback for dev/sandbox if model missing
        logger.warning("Model missing, returning dummy embedding")
        return {
            "nodeId": request.nodeId,
            "embedding": [0.0] * 384 # Dummy 384-dim vector
        }

    try:
        combined_text = f"{request.category}: {request.text}"
        embedding = model.encode(combined_text)
        return {
            "nodeId": request.nodeId,
            "embedding": embedding.tolist()
        }
    except Exception as e:
        logger.error(f"Embedding generation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/similarity")
async def calculate_similarity(request: SimilarityRequest):
    return {"status": "not_implemented_fully_yet", "message": "Requires DB access or full text in payload"}

@app.post("/placement")
async def calculate_placement(request: PlacementRequest):
    try:
        existing_positions = []
        existing_categories = []

        for node in request.existingNodes:
            if node.position:
                existing_positions.append((node.position.x, node.position.y, node.position.z))
                existing_categories.append(node.category)

        if not existing_positions:
            return {
                "x": float(np.random.uniform(-5, 5)),
                "y": float(np.random.uniform(-5, 5)),
                "z": float(np.random.uniform(-5, 5))
            }

        pos = placement_calculator.calculate_position(
            new_category=request.newNode.category,
            existing_positions=existing_positions,
            existing_categories=existing_categories,
            learning_rate=request.learningRate,
            max_iterations=request.maxIterations
        )

        return {"x": pos[0], "y": pos[1], "z": pos[2]}

    except Exception as e:
        logger.error(f"Placement calculation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
