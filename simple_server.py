from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from enum import Enum
from typing import Optional, List, Dict, Any
import random

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

@app.get("/")
async def root():
    return {"message": "Salary Predictor API is running"}

@app.post("/predict", response_model=Prediction)
async def predict(form_data: FormData):
    try:
        # Simple mock logic for prediction
        # Higher education and certain occupations tend to have higher salaries
        higher_education = form_data.educationNum >= 13  # Bachelor's or higher
        higher_paying_occupations = [
            Occupation.ExecManagerial, 
            Occupation.ProfSpecialty,
            Occupation.TechSupport
        ]
        
        # Simple rule-based system for demo purposes
        high_salary_points = 0
        
        # Education factor
        if higher_education:
            high_salary_points += 3
            
        # Age factor (prime earning years)
        if 30 <= form_data.age <= 55:
            high_salary_points += 2
        
        # Occupation factor
        if form_data.occupation in higher_paying_occupations:
            high_salary_points += 3
            
        # Marital status factor (married people often have higher household incomes)
        if form_data.maritalStatus == MaritalStatus.MarriedCivSpouse:
            high_salary_points += 1
            
        # Final prediction with randomness for demo
        confidence = random.randint(75, 95)
        
        if high_salary_points >= 5:
            prediction = ">50K"
        else:
            prediction = "<=50K"
            
        # Add some randomness for demo purposes
        if random.random() < 0.2:  # 20% chance to flip the prediction
            prediction = ">50K" if prediction == "<=50K" else "<=50K"
            
        # Create explanation
        explanation = f"Prediction made with {confidence}% confidence based on: "
        factors = []
        
        if higher_education:
            factors.append("education level")
        if form_data.occupation in higher_paying_occupations:
            factors.append("occupation")
        if 30 <= form_data.age <= 55:
            factors.append("age")
        if form_data.maritalStatus == MaritalStatus.MarriedCivSpouse:
            factors.append("marital status")
            
        explanation += ", ".join(factors) if factors else "available features"
        
        return Prediction(
            salaryCategory=prediction,
            explanation=explanation
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)