// Validation Utility for the Class Models (Course, Employee, Instructor, Student) and Components Form.js.

class Validators {
  static isNotEmpty(value) {
    return value && value.trim().length > 0;
  }

  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidPhone(phone) {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone);
  }

  // Student fields is name, email, phone, department
  static validateStudent(data) {
    const errors = [];
    if (!this.isNotEmpty(data.name)) errors.push("Student name is required");
    if (data.email && !this.isValidEmail(data.email))
      errors.push("Invalid email");
    if (data.phone && !this.isValidPhone(data.phone))
      errors.push("Invalid phone number");
    if (!this.isNotEmpty(data.department))
      errors.push("Department is required");
    return { isValid: errors.length === 0, errors };
  }

  // Course fields is name, code
  static validateCourse(data) {
    const errors = [];
    if (!this.isNotEmpty(data.name)) errors.push("Course name is required");
    if (!this.isNotEmpty(data.code)) errors.push("Course code is required");
    return { isValid: errors.length === 0, errors };
  }

  // Intructor fields is name, email, department
  static validateInstructor(data) {
    const errors = [];
    if (!this.isNotEmpty(data.name)) errors.push("Instructor name is required");
    if (data.email && !this.isValidEmail(data.email))
      errors.push("Invalid email");
    if (!this.isNotEmpty(data.department))
      errors.push("Department is required");
    return { isValid: errors.length === 0, errors };
  }

  // Employee fields is name, email, position
  static validateEmployee(data) {
    const errors = [];
    if (!this.isNotEmpty(data.name)) errors.push("Employee name is required");
    if (data.email && !this.isValidEmail(data.email))
      errors.push("Invalid email");
    if (!this.isNotEmpty(data.position)) errors.push("Position is required");
    return { isValid: errors.length === 0, errors };
  }
}

export default Validators;
