'use client';

import React from 'react';

export interface AudioTimeRangeProps {
  value: { start: string; end: string };
  onChange: (value: { start: string; end: string }) => void;
}

export interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export interface FormFieldProps {
  label: string;
  value: any;
  onChange: (value: any) => void;
  placeholder?: string;
  type?: 'text' | 'number' | 'select';
  options?: { value: string; label: string }[];
  required?: boolean;
  disabled?: boolean;
}

export interface FormFieldArrayProps {
  label: string;
  fields: any[];
  onChange: (fields: any[]) => void;
  getFieldLabel?: (field: any, index: number) => string;
  addButtonText?: string;
  removeButtonText?: string;
}

export function FormSection({ title, children }: SectionProps) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
        <span className="w-1 h-6 bg-black rounded"></span>
        {title}
      </h3>
      <div className="pl-4 border-l-2 border-gray-300">
        {children}
      </div>
    </div>
  );
}

export function FormField({ label, value, onChange, placeholder, type = 'text', options, required = false, disabled = false }: FormFieldProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-black mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {type === 'select' && options ? (
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          required={required}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-black focus:ring-2 focus:ring-black transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">Select...</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-black focus:ring-2 focus:ring-black transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      )}
    </div>
  );
}

export function FormFieldArray({ label, fields, onChange, getFieldLabel, addButtonText = "Add Field", removeButtonText = "Remove" }: FormFieldArrayProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-black mb-2">{label}</label>
      <div className="space-y-3 pl-4 border-l-2 border-gray-300">
        {fields.map((field, index) => (
          <div key={index} className="flex gap-3 items-start">
            <div className="flex-1 space-y-3">
              <FormField
                label={getFieldLabel ? getFieldLabel(field, index) : `Field ${index + 1}`}
                value={field.label}
                onChange={(val) => {
                  const newFields = [...fields];
                  newFields[index] = { ...newFields[index], label: val };
                  onChange(newFields);
                }}
                placeholder="Field label"
              />
              <div className="grid grid-cols-3 gap-3">
                <FormField
                  label="Input Type"
                  value={field.inputType}
                  onChange={(val) => {
                    const newFields = [...fields];
                    newFields[index] = { ...newFields[index], inputType: val };
                    onChange(newFields);
                  }}
                  type="select"
                  options={[
                    { value: 'text', label: 'Text' },
                    { value: 'email', label: 'Email' },
                    { value: 'tel', label: 'Telephone' },
                    { value: 'number', label: 'Number' },
                    { value: 'date', label: 'Date' },
                    { value: 'select', label: 'Select Dropdown' },
                  ]}
                />
                <FormField
                  label="Placeholder"
                  value={field.placeholder}
                  onChange={(val) => {
                    const newFields = [...fields];
                    newFields[index] = { ...newFields[index], placeholder: val };
                    onChange(newFields);
                  }}
                  placeholder="_____________________"
                />
                <FormField
                  label="Answer"
                  value={field.answer}
                  onChange={(val) => {
                    const newFields = [...fields];
                    newFields[index] = { ...newFields[index], answer: val };
                    onChange(newFields);
                  }}
                  placeholder="Sarah Johnson"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  const newFields = fields.filter((_, i) => i !== index);
                  onChange(newFields);
                }}
                className="mt-2 px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
              >
                {removeButtonText}
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            const newFields = [...fields, {
              id: Date.now(),
              label: '',
              inputType: 'text',
              placeholder: '',
              required: true,
              answer: ''
            }];
            onChange(newFields);
          }}
          className="w-full px-4 py-3 bg-black hover:bg-gray-800 text-white rounded-lg font-semibold transition-colors"
        >
          + {addButtonText}
        </button>
      </div>
    </div>
  );
}

export function AudioTimeRange({ value, onChange }: AudioTimeRangeProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-black mb-2">Audio Time Range</label>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Start</label>
          <input
            type="time"
            value={value.start}
            onChange={(e) => onChange({ ...value, start: e.target.value })}
            step="1"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">End</label>
          <input
            type="time"
            value={value.end}
            onChange={(e) => onChange({ ...value, end: e.target.value })}
            step="1"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
