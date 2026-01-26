import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "./input";
import { Textarea } from "./textarea";

export interface FormFieldProps {
  label: string;
  name: string;
  type?: "text" | "email" | "tel" | "password" | "number" | "date" | "textarea";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  error?: string;
  helperText?: string;
  className?: string;
  inputClassName?: string;
  rows?: number;
  autoComplete?: string;
}

// Validation helpers
export const validators = {
  email: (value: string): string | undefined => {
    if (!value.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Please enter a valid email address";
    if (value.length > 255) return "Email must be less than 255 characters";
    return undefined;
  },
  
  phone: (value: string): string | undefined => {
    if (!value.trim()) return "Phone number is required";
    const digitsOnly = value.replace(/\D/g, '');
    if (digitsOnly.length < 10) return "Phone number must be at least 10 digits";
    return undefined;
  },
  
  name: (value: string, minLength = 2, maxLength = 100): string | undefined => {
    if (!value.trim()) return "Name is required";
    if (value.trim().length < minLength) return `Name must be at least ${minLength} characters`;
    if (value.length > maxLength) return `Name must be less than ${maxLength} characters`;
    return undefined;
  },
  
  required: (value: string, fieldName = "This field"): string | undefined => {
    if (!value.trim()) return `${fieldName} is required`;
    return undefined;
  },
  
  minLength: (value: string, min: number, fieldName = "This field"): string | undefined => {
    if (value.trim().length < min) return `${fieldName} must be at least ${min} characters`;
    return undefined;
  },
  
  maxLength: (value: string, max: number, fieldName = "This field"): string | undefined => {
    if (value.length > max) return `${fieldName} must be less than ${max} characters`;
    return undefined;
  },
};

const FormField = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, FormFieldProps>(
  ({ 
    label, 
    name, 
    type = "text", 
    value, 
    onChange, 
    placeholder,
    required = false,
    disabled = false,
    maxLength,
    error,
    helperText,
    className,
    inputClassName,
    rows = 4,
    autoComplete,
  }, ref) => {
    const hasError = Boolean(error);
    const inputId = `field-${name}`;
    
    const baseInputClasses = cn(
      "h-12 text-base transition-all duration-200",
      hasError 
        ? "border-destructive focus:border-destructive focus:ring-destructive/20" 
        : "border-input focus:border-primary/50 focus:ring-2 focus:ring-primary/10",
      inputClassName
    );

    return (
      <div className={cn("space-y-1.5", className)}>
        <label 
          htmlFor={inputId}
          className="block text-sm font-semibold text-foreground"
        >
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </label>
        
        {type === "textarea" ? (
          <Textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            id={inputId}
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            rows={rows}
            className={cn(baseInputClasses, "h-auto")}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          />
        ) : (
          <Input
            ref={ref as React.Ref<HTMLInputElement>}
            id={inputId}
            name={name}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            autoComplete={autoComplete}
            className={baseInputClasses}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          />
        )}
        
        {/* Error Message */}
        {hasError && (
          <p 
            id={`${inputId}-error`}
            className="text-sm text-destructive font-medium animate-in fade-in slide-in-from-top-1 duration-200"
          >
            {error}
          </p>
        )}
        
        {/* Helper Text */}
        {!hasError && helperText && (
          <p 
            id={`${inputId}-helper`}
            className="text-xs text-muted-foreground"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";

export { FormField };
