import os
from tensorflow.keras.models import load_model

MODEL_DIR = "models"

disease_model = load_model(
    os.path.join(MODEL_DIR, "chili_disease_mobilenet.h5"),
    compile=False
)

growth_model = load_model(
    os.path.join(MODEL_DIR, "chili_growth_mobilenet.h5"),
    compile=False
)

disease_model.save(os.path.join(MODEL_DIR, "chili_disease_mobilenet.keras"))
growth_model.save(os.path.join(MODEL_DIR, "chili_growth_mobilenet.keras"))

print("✅ Conversion completed.")