export enum Workclass {
  Private = "Private",
  SelfEmpNotInc = "Self-emp-not-inc",
  SelfEmpInc = "Self-emp-inc",
  FederalGov = "Federal-gov",
  LocalGov = "Local-gov",
  StateGov = "State-gov",
  WithoutPay = "Without-pay",
  NeverWorked = "Never-worked",
  Unknown = "?"
}

export enum Education {
  Bachelors = "Bachelors",
  SomeCollege = "Some-college",
  Eleventh = "11th",
  HSGrad = "HS-grad",
  ProfSchool = "Prof-school",
  AssocAcdm = "Assoc-acdm",
  AssocVoc = "Assoc-voc",
  Ninth = "9th",
  SeventhEighth = "7th-8th",
  Twelfth = "12th",
  Masters = "Masters",
  FirstFourth = "1st-4th",
  Tenth = "10th",
  Doctorate = "Doctorate",
  FifthSixth = "5th-6th",
  Preschool = "Preschool"
}

export enum MaritalStatus {
  MarriedCivSpouse = "Married-civ-spouse",
  Divorced = "Divorced",
  NeverMarried = "Never-married",
  Separated = "Separated",
  Widowed = "Widowed",
  MarriedSpouseAbsent = "Married-spouse-absent",
  MarriedAFSpouse = "Married-AF-spouse"
}

export enum Occupation {
  TechSupport = "Tech-support",
  CraftRepair = "Craft-repair",
  OtherService = "Other-service",
  Sales = "Sales",
  ExecManagerial = "Exec-managerial",
  ProfSpecialty = "Prof-specialty",
  HandlersCleaners = "Handlers-cleaners",
  MachineOpInspct = "Machine-op-inspct",
  AdmClerical = "Adm-clerical",
  FarmingFishing = "Farming-fishing",
  TransportMoving = "Transport-moving",
  PrivHouseServ = "Priv-house-serv",
  ProtectiveServ = "Protective-serv",
  ArmedForces = "Armed-Forces",
  Unknown = "?"
}

export enum Relationship {
  Wife = "Wife",
  OwnChild = "Own-child",
  Husband = "Husband",
  NotInFamily = "Not-in-family",
  OtherRelative = "Other-relative",
  Unmarried = "Unmarried"
}

export enum Race {
  White = "White",
  AsianPacIslander = "Asian-Pac-Islander",
  AmerIndianEskimo = "Amer-Indian-Eskimo",
  Other = "Other",
  Black = "Black"
}

export interface FormData {
  age: number;
  workclass: Workclass;
  fnlwgt: number;
  education: Education;
  educationNum: number;
  maritalStatus: MaritalStatus;
  occupation: Occupation;
  relationship: Relationship;
  race: Race;
}

export interface Prediction {
  salaryCategory: ">50K" | "<=50K";
  explanation: string;
}

export interface FeatureConfig {
  id: keyof FormData;
  label: string;
  type: 'number' | 'select';
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}