
/**
 * Validates a numeric value
 * @param value Value to validate
 * @param options Validation options
 * @returns Whether the value is valid
 */
export const validateNumericInput = (
  value: string | number,
  options: {
    allowZero?: boolean;
    allowNegative?: boolean;
    min?: number;
    max?: number;
  } = {}
): boolean => {
  const { allowZero = false, allowNegative = false, min, max } = options;
  const numValue = parseFloat(String(value));
  
  // Check if is a valid number
  if (isNaN(numValue)) {
    return false;
  }
  
  // Check zero constraint
  if (!allowZero && numValue === 0) {
    return false;
  }
  
  // Check negative constraint
  if (!allowNegative && numValue < 0) {
    return false;
  }
  
  // Check min value
  if (min !== undefined && numValue < min) {
    return false;
  }
  
  // Check max value
  if (max !== undefined && numValue > max) {
    return false;
  }
  
  return true;
};

/**
 * Parse a numeric input with validation
 * @param value Value to parse
 * @param fallback Fallback value if invalid
 * @param options Validation options
 * @returns Parsed value or fallback
 */
export const parseNumericInput = (
  value: string | number,
  fallback: number,
  options: {
    allowZero?: boolean;
    allowNegative?: boolean;
    min?: number;
    max?: number;
  } = {}
): number => {
  const numValue = parseFloat(String(value));
  
  if (validateNumericInput(value, options)) {
    return numValue;
  }
  
  return fallback;
};

/**
 * Validates an object by checking required fields
 * @param object Object to validate
 * @param requiredFields Fields that must have truthy values
 * @returns Whether all required fields are present and valid
 */
export const validateObject = <T extends Record<string, any>>(
  object: T,
  requiredFields: (keyof T)[]
): boolean => {
  return requiredFields.every(field => {
    const value = object[field];
    if (value === undefined || value === null || value === '') {
      return false;
    }
    return true;
  });
};
