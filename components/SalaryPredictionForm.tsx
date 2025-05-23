
import React, { useState, useCallback, ChangeEvent, FormEvent } from 'react';
import type { FormData, FeatureConfig } from '../types';
import { FEATURES_CONFIG } from '../constants';
import { InputField } from './ui/InputField';
import { SelectField } from './ui/SelectField';
import { Button } from './ui/Button';

interface SalaryPredictionFormProps {
  initialData: FormData;
  onSubmit: (data: FormData) => void;
  onFormChange: (data: FormData) => void;
  isLoading: boolean;
}

export const SalaryPredictionForm: React.FC<SalaryPredictionFormProps> = ({
  initialData,
  onSubmit,
  onFormChange,
  isLoading,
}) => {
  const [formData, setFormData] = useState<FormData>(initialData);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target; // Removed extraneous underscore here
    const newFormData = {
      ...formData,
      [name]: e.target.type === 'number' ? parseFloat(value) || 0 : value,
    };
    setFormData(newFormData);
    onFormChange(newFormData);
  }, [formData, onFormChange]);

  const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  }, [formData, onSubmit]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
        {FEATURES_CONFIG.map((feature: FeatureConfig) => {
          const commonProps = {
            key: feature.id,
            id: feature.id,
            name: feature.id,
            label: feature.label,
            value: String(formData[feature.id]), // Ensure value is string for controlled components
            onChange: handleChange,
            disabled: isLoading,
            required: true,
            "aria-label": feature.label,
            "aria-required": "true" as "true" | "false",
          };

          if (feature.type === 'number') {
            return (
              <InputField
                {...commonProps}
                type="number"
                min={feature.min}
                max={feature.max}
                step={feature.step}
                placeholder={feature.placeholder}
                aria-describedby={isLoading ? `${feature.id}-loading-description` : undefined}
              />
            );
          }
          if (feature.type === 'select' && feature.options) {
            return (
              <SelectField
                {...commonProps}
                options={feature.options}
                aria-describedby={isLoading ? `${feature.id}-loading-description` : undefined}
              />
            );
          }
          return null;
        })}
      </div>
      <Button type="submit" disabled={isLoading} className="w-full" aria-live="polite">
        {isLoading ? 'Predicting...' : 'Predict Salary'}
      </Button>
    </form>
  );
};
