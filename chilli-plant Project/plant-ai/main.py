import io
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import numpy as np
from PIL import Image
import os
import traceback

# Set environment variable for Keras 3 compatibility
os.environ['TF_USE_LEGACY_KERAS'] = '0'

import tensorflow as tf
from tensorflow import keras

# Initialize FastAPI
app = FastAPI(title="Chili Plant AI Server", version="2.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration - Updated to .keras format
MODEL_DISEASE_PATH = "models/chili_disease_mobilenet.keras"
MODEL_GROWTH_PATH = "models/chili_growth_mobilenet.keras"
IMG_SIZE = (224, 224)

# Disease classes (matching your training)
DISEASE_CLASSES = {
    0: "Bacterial Spot",
    1: "Cercospora Leaf Spot",
    2: "Curl Virus",
    3: "Healthy Leaf",
    4: "Nutrition Deficiency",
    5: "White spot"
}

# Growth stage classes
GROWTH_CLASSES = {
    0: "Dry chilli",
    1: "Flower",
    2: "Green Chilli",
    3: "Red Chili",
    4: "Rotten Chilli"
}

# Disease information database
DISEASE_INFO = {
    "Bacterial Spot": {
        "description": "Dark, water-soaked spots on leaves and fruits caused by Xanthomonas bacteria",
        "cause": "Xanthomonas bacteria spread through rain, irrigation water, and contaminated tools",
        "symptoms": "Small brown spots with yellow halo on leaves, leaf yellowing, fruit spots, premature leaf drop",
        "severity_level": "High",
        "pesticide": "Copper Oxychloride 50 WP (3g/L water) or Streptomycin Sulphate 90% (0.5g/L)",
        "organic_treatment": "Neem oil spray (5ml/L water), Baking soda solution (1 tsp/L water + few drops soap)",
        "prevention": "Use disease-free certified seeds, practice crop rotation (3 years), avoid overhead irrigation, remove infected plant debris",
        "spread_risk": "High - spreads rapidly in warm (25-30°C), wet conditions"
    },
    "Cercospora Leaf Spot": {
        "description": "Circular spots with light gray centers and dark brown margins on leaves caused by Cercospora fungus",
        "cause": "Cercospora capsici fungus favored by warm (25-30°C), humid conditions (>85% humidity)",
        "symptoms": "Small circular gray-white spots (1-5mm), leaf yellowing, severe defoliation in advanced stages",
        "severity_level": "Medium",
        "pesticide": "Carbendazim 50 WP (1g/L water) or Mancozeb 75 WP (2g/L water), spray at 10-day intervals",
        "organic_treatment": "Garlic-chili extract spray, Trichoderma viride soil application (5g/plant), Panchagavya 3% spray",
        "prevention": "Maintain proper plant spacing (45cm), remove and destroy infected leaves, apply mulch to reduce soil splash",
        "spread_risk": "Medium - spreads through wind, rain splash, and contaminated seeds"
    },
    "Curl Virus": {
        "description": "Upward curling, puckering, and distortion of leaves caused by whitefly-transmitted Gemini virus",
        "cause": "Chili Leaf Curl Virus (ChiLCV) transmitted by whitefly (Bemisia tabaci) vectors",
        "symptoms": "Upward leaf curling, yellowing, vein clearing, stunted plant growth, reduced flowering and fruit setting",
        "severity_level": "High",
        "pesticide": "Imidacloprid 17.8 SL (0.3ml/L water) for whitefly control, apply at 15-day intervals",
        "organic_treatment": "Install yellow sticky traps (20/acre), Neem oil 5ml/L weekly spray, remove and destroy infected plants immediately",
        "prevention": "Use virus-resistant varieties (e.g., Phule Jyoti), grow barrier crops (maize/sorghum), weed management, use silver reflective mulch",
        "spread_risk": "Very High - whiteflies can transmit virus within 30 minutes of feeding"
    },
    "Healthy Leaf": {
        "description": "Your plant is healthy with no disease symptoms detected",
        "cause": "N/A - Good plant health maintained",
        "symptoms": "No symptoms - leaves are green, well-formed, and disease-free",
        "severity_level": "None",
        "pesticide": "No treatment needed - continue regular monitoring",
        "organic_treatment": "Continue good practices: regular watering, balanced nutrition, weekly observation",
        "prevention": "Maintain current agricultural practices, regular monitoring for early detection, soil health management",
        "spread_risk": "None - Plant is healthy"
    },
    "Nutrition Deficiency": {
        "description": "Yellowing, discoloration, or abnormal growth due to lack of essential nutrients (NPK or micronutrients)",
        "cause": "Imbalanced soil nutrients, poor soil health, excessive watering leaching nutrients, incorrect pH levels",
        "symptoms": "Yellow leaves (Nitrogen), purple veins (Phosphorus), brown leaf edges (Potassium), interveinal chlorosis (Magnesium), stunted growth",
        "severity_level": "Medium",
        "pesticide": "Apply NPK 19:19:19 water-soluble fertilizer (5g/L water) as foliar spray, Micronutrient mixture (1g/L)",
        "organic_treatment": "Apply vermicompost (2 tons/acre), compost tea foliar spray weekly, seaweed extract (3ml/L), bone meal for phosphorus",
        "prevention": "Regular soil testing (every 6 months), balanced fertilization schedule, maintain soil pH 6.0-7.0, add organic matter regularly",
        "spread_risk": "None - Not contagious, but affects entire crop if soil is uniformly deficient"
    },
    "White spot": {
        "description": "White powdery patches on leaf surface caused by powdery mildew fungus",
        "cause": "Leveillula taurica fungus favored by dry, humid conditions (50-70% humidity) and moderate temperatures (20-25°C)",
        "symptoms": "White powdery growth on leaf surface, leaf curling, yellowing, premature leaf drop, reduced photosynthesis",
        "severity_level": "Medium",
        "pesticide": "Sulphur 80 WP (2g/L water) or Hexaconazole 5 EC (1ml/L water), spray at 10-day intervals",
        "organic_treatment": "Milk spray (10% solution - mix 100ml milk in 900ml water), Baking soda solution (1 tsp/L + few drops liquid soap), neem oil (5ml/L)",
        "prevention": "Ensure proper plant spacing for air circulation, avoid excess nitrogen fertilizer, morning watering to allow leaf drying, grow resistant varieties",
        "spread_risk": "Medium-High - spreads through wind-borne spores in dry conditions"
    }
}

# Load models at startup
print("=" * 50)
print("Loading models with Keras 3...")
print(f"TensorFlow version: {tf.__version__}")
print(f"Keras version: {keras.__version__}")
print("=" * 50)

try:
    # Check if model files exist
    if not os.path.exists(MODEL_DISEASE_PATH):
        raise FileNotFoundError(f"Disease model not found at: {MODEL_DISEASE_PATH}")
    if not os.path.exists(MODEL_GROWTH_PATH):
        raise FileNotFoundError(f"Growth model not found at: {MODEL_GROWTH_PATH}")
    
    print("Model files found. Loading...")
    
    # Load models using Keras 3 format
    model_disease = keras.models.load_model(MODEL_DISEASE_PATH)
    print("✅ Disease model loaded successfully!")
    print(f"   Input shape: {model_disease.input_shape}")
    print(f"   Output classes: {model_disease.output_shape[-1]}")
    
    model_growth = keras.models.load_model(MODEL_GROWTH_PATH)
    print("✅ Growth model loaded successfully!")
    print(f"   Input shape: {model_growth.input_shape}")
    print(f"   Output classes: {model_growth.output_shape[-1]}")
    
    print("=" * 50)
    print("✅ Both models ready for predictions!")
    print("=" * 50)
    
except Exception as e:
    print(f"❌ Error loading models: {e}")
    traceback.print_exc()
    model_disease = None
    model_growth = None


def preprocess_image(image_bytes):
    """
    Preprocess image for model prediction
    Matches training preprocessing: MobileNetV2 with rescale=1./255
    """
    try:
        # Open image from bytes
        img = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB (handles RGBA, grayscale, CMYK, etc.)
        original_mode = img.mode
        if img.mode != 'RGB':
            img = img.convert('RGB')
            print(f"Converted image from {original_mode} to RGB")
        
        # Resize to match training size
        img = img.resize(IMG_SIZE, Image.Resampling.LANCZOS)
        
        # Convert to numpy array and normalize exactly as training
        img_array = np.array(img, dtype=np.float32) / 255.0
        
        # Add batch dimension (1, 224, 224, 3)
        img_array = np.expand_dims(img_array, axis=0)
        
        return img_array
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Image preprocessing failed: {str(e)}")


def get_disease_info(disease_name):
    """Get detailed information about a disease"""
    return DISEASE_INFO.get(disease_name, {
        "description": "Information not available for this disease",
        "cause": "Unknown - further diagnosis needed",
        "symptoms": "Please consult an agricultural expert for accurate diagnosis",
        "severity_level": "Unknown",
        "pesticide": "Consult your local agricultural extension center",
        "organic_treatment": "Consult an organic farming expert",
        "prevention": "Follow standard agricultural practices",
        "spread_risk": "Unknown"
    })


@app.get("/")
async def root():
    """Root endpoint with service information"""
    return {
        "service": "Chili Plant AI Server",
        "version": "2.0.0",
        "status": "running",
        "models_loaded": model_disease is not None and model_growth is not None,
        "tensorflow_version": tf.__version__,
        "keras_version": keras.__version__,
        "model_format": "Keras 3 (.keras)"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint for Spring Boot integration"""
    return {
        "status": "healthy" if model_disease and model_growth else "unhealthy",
        "disease_model": "loaded" if model_disease else "not loaded",
        "growth_model": "loaded" if model_growth else "not loaded",
        "tensorflow_version": tf.__version__,
        "keras_version": keras.__version__
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Predict disease and growth stage from chili plant image
    Returns comprehensive results with treatment recommendations
    """
    # Check if models are loaded
    if model_disease is None or model_growth is None:
        raise HTTPException(status_code=503, detail="AI models not loaded. Check server logs.")
    
    # Validate file type
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400, 
            detail=f"File must be an image. Received: {file.content_type}"
        )
    
    # Validate file size (max 10MB)
    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)
    
    if file_size > 10 * 1024 * 1024:  # 10MB
        raise HTTPException(status_code=400, detail="File size exceeds 10MB limit")
    
    try:
        print(f"Processing file: {file.filename} ({file_size} bytes)")
        
        # Read image bytes
        image_bytes = await file.read()
        
        # Preprocess image
        img_array = preprocess_image(image_bytes)
        
        # Make predictions
        print("Making disease prediction...")
        disease_preds = model_disease.predict(img_array, verbose=0)
        disease_idx = np.argmax(disease_preds[0])
        disease_conf = float(np.max(disease_preds[0]) * 100)
        disease_class = DISEASE_CLASSES.get(disease_idx, f"Unknown Class {disease_idx}")
        
        print(f"Disease: {disease_class} ({disease_conf:.2f}%)")
        
        print("Making growth stage prediction...")
        growth_preds = model_growth.predict(img_array, verbose=0)
        growth_idx = np.argmax(growth_preds[0])
        growth_conf = float(np.max(growth_preds[0]) * 100)
        growth_class = GROWTH_CLASSES.get(growth_idx, f"Unknown Class {growth_idx}")
        
        print(f"Growth: {growth_class} ({growth_conf:.2f}%)")
        
        # Get disease information
        disease_info = get_disease_info(disease_class)
        
        # Build all class probabilities
        disease_probabilities = {}
        for i, prob in enumerate(disease_preds[0]):
            class_name = DISEASE_CLASSES.get(i, f"Class_{i}")
            disease_probabilities[class_name] = round(float(prob * 100), 2)
        
        growth_probabilities = {}
        for i, prob in enumerate(growth_preds[0]):
            class_name = GROWTH_CLASSES.get(i, f"Class_{i}")
            growth_probabilities[class_name] = round(float(prob * 100), 2)
        
        # Determine severity
        if disease_class == "Healthy Leaf":
            severity = "None"
        elif disease_conf > 85:
            severity = "High"
        elif disease_conf > 60:
            severity = "Medium"
        else:
            severity = "Low"
        
        print(f"Severity: {severity}")
        print("Prediction completed successfully!")
        
        return {
            "success": True,
            "disease_prediction": {
                "class": disease_class,
                "confidence": round(disease_conf, 2),
                "severity": severity,
                "all_probabilities": disease_probabilities,
                "information": disease_info
            },
            "growth_prediction": {
                "class": growth_class,
                "confidence": round(growth_conf, 2),
                "all_probabilities": growth_probabilities
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Prediction error: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@app.get("/disease-info/{disease_name}")
async def get_disease_details(disease_name: str):
    """Get detailed information about a specific disease"""
    disease_info = get_disease_info(disease_name)
    return {
        "disease": disease_name,
        "information": disease_info
    }


if __name__ == "__main__":
    import uvicorn
    import io  # Required for preprocess_image
    
    print("\n" + "=" * 50)
    print("Starting Chili Plant AI Server...")
    print("=" * 50)
    
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=8000, 
        log_level="info"
    )