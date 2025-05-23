
import type { FormData, FeatureConfig } from './types';
import { Workclass, Education, MaritalStatus, Occupation, Relationship, Race } from './types';

export const INITIAL_FORM_DATA: FormData = {
  age: 35,
  workclass: Workclass.Private,
  fnlwgt: 180000,
  education: Education.Bachelors,
  educationNum: 13,
  maritalStatus: MaritalStatus.NeverMarried,
  occupation: Occupation.ProfSpecialty,
  relationship: Relationship.NotInFamily,
  race: Race.White,
};

const createEnumOptions = (enumObject: Record<string, string>) => {
  return Object.entries(enumObject).map(([key, value]) => ({
    value: value,
    label: key.replace(/([A-Z])/g, ' $1').replace(/^ /, ''), // Add spaces for readability
  }));
};

export const FEATURES_CONFIG: FeatureConfig[] = [
  { id: 'age', label: 'Age', type: 'number', min: 17, max: 90, placeholder: "e.g., 35" },
  { id: 'workclass', label: 'Work Class', type: 'select', options: createEnumOptions(Workclass) },
  { id: 'fnlwgt', label: 'Final Weight (fnlwgt)', type: 'number', min: 10000, max: 1500000, placeholder: "e.g., 180000", step: 1000 },
  { id: 'education', label: 'Education Level', type: 'select', options: createEnumOptions(Education) },
  { id: 'educationNum', label: 'Education (Years)', type: 'number', min: 1, max: 16, placeholder: "e.g., 13" },
  { id: 'maritalStatus', label: 'Marital Status', type: 'select', options: createEnumOptions(MaritalStatus) },
  { id: 'occupation', label: 'Occupation', type: 'select', options: createEnumOptions(Occupation) },
  { id: 'relationship', label: 'Relationship', type: 'select', options: createEnumOptions(Relationship) },
  { id: 'race', label: 'Race', type: 'select', options: createEnumOptions(Race) },
];
    