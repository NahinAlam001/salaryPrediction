from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from enum import Enum
from typing import Optional, List, Dict, Any
import pickle
import pandas as pd
import os

# Create FastAPI app
app = FastAPI(title="Salary Predictor API")

# Configure CORS to allow requests from the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React app's default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define enums that match the TypeScript enums
class Workclass(str, Enum):
    Private = "Private"
    SelfEmpNotInc = "Self-emp-not-inc"
    SelfEmpInc = "Self-emp-inc"
    FederalGov = "Federal-gov"
    LocalGov = "Local-gov"
    StateGov = "State-gov"
    WithoutPay = "Without-pay"
    NeverWorked = "Never-worked"
    Unknown = "?"

class Education(str, Enum):
    Bachelors = "Bachelors"
    SomeCollege = "Some-college"
    Eleventh = "11th"
    HSGrad = "HS-grad"
    ProfSchool = "Prof-school"
    AssocAcdm = "Assoc-acdm"
    AssocVoc = "Assoc-voc"
    Ninth = "9th"
    SeventhEighth = "7th-8th"
    Twelfth = "12th"
    Masters = "Masters"
    FirstFourth = "1st-4th"
    Tenth = "10th"
    Doctorate = "Doctorate"
    FifthSixth = "5th-6th"
    Preschool = "Preschool"

class MaritalStatus(str, Enum):
    MarriedCivSpouse = "Married-civ-spouse"
    Divorced = "Divorced"
    NeverMarried = "Never-married"
    Separated = "Separated"
    Widowed = "Widowed"
    MarriedSpouseAbsent = "Married-spouse-absent"
    MarriedAFSpouse = "Married-AF-spouse"

class Occupation(str, Enum):
    TechSupport = "Tech-support"
    CraftRepair = "Craft-repair"
    OtherService = "Other-service"
    Sales = "Sales"
    ExecManagerial = "Exec-managerial"
    ProfSpecialty = "Prof-specialty"
    HandlersCleaners = "Handlers-cleaners"
    MachineOpInspct = "Machine-op-inspct"
    AdmClerical = "Adm-clerical"
    FarmingFishing = "Farming-fishing"
    TransportMoving = "Transport-moving"
    PrivHouseServ = "Priv-house-serv"
    ProtectiveServ = "Protective-serv"
    ArmedForces = "Armed-Forces"
    Unknown = "?"

class Relationship(str, Enum):
    Wife = "Wife"
    OwnChild = "Own-child"
    Husband = "Husband"
    NotInFamily = "Not-in-family"
    OtherRelative = "Other-relative"
    Unmarried = "Unmarried"

class Race(str, Enum):
    White = "White"
    AsianPacIslander = "Asian-Pac-Islander"
    AmerIndianEskimo = "Amer-Indian-Eskimo"
    Other = "Other"
    Black = "Black"

# Define request model
class FormData(BaseModel):
    age: int = Field(..., ge=0)
    workclass: Workclass
    fnlwgt: int = Field(..., ge=0)
    education: Education
    educationNum: int = Field(..., ge=0, le=16)
    maritalStatus: MaritalStatus
    occupation: Occupation
    relationship: Relationship
    race: Race

# Define response model
class Prediction(BaseModel):
    salaryCategory: str
    explanation: str

# Load the FastAI model
try:
    with open("export.pkl", "rb") as f:
        model = pickle.load(f)
    print("Model loaded successfully")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

@app.get("/")
async def root():
    return {"message": "Salary Predictor API is running"}

@app.post("/predict", response_model=Prediction)
async def predict(form_data: FormData):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        # Convert form data to pandas DataFrame for prediction
        input_data = {
            'age': form_data.age,
            'workclass': form_data.workclass.value,
            'fnlwgt': form_data.fnlwgt,
            'education': form_data.education.value,
            'education-num': form_data.educationNum,  # Note the hyphen for model compatibility
            'marital-status': form_data.maritalStatus.value,
            'occupation': form_data.occupation.value,
            'relationship': form_data.relationship.value,
            'race': form_data.race.value,
            # Adding default values for any fields the model might expect but aren't in our form
            'sex': 'Male',  # Default value
            'capital-gain': 0,
            'capital-loss': 0,
            'hours-per-week': 40,
            'native-country': 'United-States'
        }
        
        # Create a DataFrame from the input data
        input_df = pd.DataFrame([input_data])
        
        # Get prediction from model
        prediction = model.predict(input_df)[0]
        
        # Get prediction probabilities for explanation
        probs = model.predict_proba(input_df)[0]
        confidence = max(probs) * 100
        
        # Create explanation based on top features
        if hasattr(model, 'feature_importances_'):
            features = model.feature_importances_
            feature_dict = {k: v for k, v in zip(input_data.keys(), features)}
            sorted_features = sorted(feature_dict.items(), key=lambda x: x[1], reverse=True)
            top_features = [f"{k} ({v:.4f})" for k, v in sorted_features[:3]]
            feature_text = f"Top features: {', '.join(top_features)}"
        else:
            feature_text = "Feature importance not available for this model."
        
        explanation = f"Prediction made with {confidence:.2f}% confidence. {feature_text}"
        
        return Prediction(
            salaryCategory=prediction,
            explanation=explanation
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)