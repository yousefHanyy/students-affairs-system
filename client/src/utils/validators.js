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

  static isValidAge(age) {
    return age && age > 0 && age < 150;
  }

  static isValidArray(arr) {
    return Array.isArray(arr);
  }

  static isValidDate(dateString) {
    if (!dateString) return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  }

  // Student fields: name, email, phone, age, department, courses
  static validateStudent(data) {
    const errors = [];
    if (!this.isNotEmpty(data.name)) errors.push("Student name is required");
    if (data.email && !this.isValidEmail(data.email))
      errors.push("Invalid email");
    if (data.phone && !this.isValidPhone(data.phone))
      errors.push("Invalid phone number");
    if (data.age && !this.isValidAge(data.age)) errors.push("Invalid age");
    if (!this.isNotEmpty(data.department))
      errors.push("Department is required");
    if (data.courses && !this.isValidArray(data.courses))
      errors.push("Courses must be an array");
    return { isValid: errors.length === 0, errors };
  }

  // Course fields: name, code
  static validateCourse(data) {
    const errors = [];
    if (!this.isNotEmpty(data.name)) errors.push("Course name is required");
    if (!this.isNotEmpty(data.code)) errors.push("Course code is required");
    return { isValid: errors.length === 0, errors };
  }

  // Instructor fields: name, email, age, department, assignedCourses
  // Note: Instructor extends Employee, so it inherits base validation
  static validateInstructor(data) {
    const errors = [];
    if (!this.isNotEmpty(data.name)) errors.push("Instructor name is required");
    if (data.email && !this.isValidEmail(data.email))
      errors.push("Invalid email");
    if (data.age && !this.isValidAge(data.age)) errors.push("Invalid age");
    if (!this.isNotEmpty(data.department))
      errors.push("Department is required");
    if (data.assignedCourses) {
      if (!this.isValidArray(data.assignedCourses)) {
        errors.push("Assigned courses must be an array");
      } else {
        // Validate each assigned course object
        data.assignedCourses.forEach((course, index) => {
          if (!course.courseId) {
            errors.push(
              `Course ID is required for assigned course ${index + 1}`,
            );
          }
          if (course.startDate && !this.isValidDate(course.startDate)) {
            errors.push(`Invalid start date for assigned course ${index + 1}`);
          }
          if (course.endDate && !this.isValidDate(course.endDate)) {
            errors.push(`Invalid end date for assigned course ${index + 1}`);
          }
          if (course.startDate && course.endDate) {
            const start = new Date(course.startDate);
            const end = new Date(course.endDate);
            if (start >= end) {
              errors.push(
                `End date must be after start date for assigned course ${index + 1}`,
              );
            }
          }
        });
      }
    }
    return { isValid: errors.length === 0, errors };
  }

  // Employee fields: name, email, age, position, role
  static validateEmployee(data) {
    const errors = [];
    if (!this.isNotEmpty(data.name)) errors.push("Employee name is required");
    if (data.email && !this.isValidEmail(data.email))
      errors.push("Invalid email");
    if (data.age && !this.isValidAge(data.age)) errors.push("Invalid age");
    if (!this.isNotEmpty(data.position)) errors.push("Position is required");
    return { isValid: errors.length === 0, errors };
  }
}

export default Validators;
