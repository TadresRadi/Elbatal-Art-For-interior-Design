// Input validation and sanitization utilities

export class InputValidator {
  // Sanitize input to prevent XSS
  static sanitize(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .replace(/eval\s*\(/gi, '') // Remove eval functions
      .trim();
  }

  // Validate username
  static validateUsername(username: string): { valid: boolean; message?: string } {
    if (!username || username.trim().length === 0) {
      return { valid: false, message: 'Username is required' };
    }

    if (username.length < 3 || username.length > 30) {
      return { valid: false, message: 'Username must be 3-30 characters long' };
    }

    // Allow only alphanumeric, underscore, and hyphen
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(username)) {
      return { valid: false, message: 'Username can only contain letters, numbers, underscores, and hyphens' };
    }

    return { valid: true };
  }

  // Validate password
  static validatePassword(password: string): { valid: boolean; message?: string } {
    if (!password || password.length === 0) {
      return { valid: false, message: 'Password is required' };
    }

    if (password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters long' };
    }

    if (password.length > 128) {
      return { valid: false, message: 'Password must be less than 128 characters' };
    }

    // Check for at least one uppercase, lowercase, number, and special character
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      return { 
        valid: false, 
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character' 
      };
    }

    return { valid: true };
  }

  // Validate email
  static validateEmail(email: string): { valid: boolean; message?: string } {
    if (!email || email.trim().length === 0) {
      return { valid: false, message: 'Email is required' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { valid: false, message: 'Please enter a valid email address' };
    }

    return { valid: true };
  }

  // Validate general text input
  static validateText(input: string, fieldName: string, minLength = 1, maxLength = 1000): { valid: boolean; message?: string } {
    if (!input || input.trim().length === 0) {
      return { valid: false, message: `${fieldName} is required` };
    }

    if (input.length < minLength) {
      return { valid: false, message: `${fieldName} must be at least ${minLength} characters long` };
    }

    if (input.length > maxLength) {
      return { valid: false, message: `${fieldName} must be less than ${maxLength} characters` };
    }

    // Check for potential XSS patterns
    const xssPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /eval\s*\(/i,
      /expression\s*\(/i
    ];

    for (const pattern of xssPatterns) {
      if (pattern.test(input)) {
        return { valid: false, message: `${fieldName} contains invalid characters` };
      }
    }

    return { valid: true };
  }

  // Validate numeric input
  static validateNumber(input: string, fieldName: string, min = 0, max = Number.MAX_SAFE_INTEGER): { valid: boolean; message?: string } {
    const num = parseFloat(input);

    if (isNaN(num)) {
      return { valid: false, message: `${fieldName} must be a valid number` };
    }

    if (num < min) {
      return { valid: false, message: `${fieldName} must be at least ${min}` };
    }

    if (num > max) {
      return { valid: false, message: `${fieldName} must be at most ${max}` };
    }

    return { valid: true };
  }

  // Sanitize and validate API response data
  static sanitizeApiResponse(data: any): any {
    if (typeof data !== 'object' || data === null) {
      return data;
    }

    const sanitized: any = Array.isArray(data) ? [] : {};

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const value = data[key];
        
        if (typeof value === 'string') {
          sanitized[key] = this.sanitize(value);
        } else if (typeof value === 'object' && value !== null) {
          sanitized[key] = this.sanitizeApiResponse(value);
        } else {
          sanitized[key] = value;
        }
      }
    }

    return sanitized;
  }
}
