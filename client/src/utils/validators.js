// Validation Utility for the Class Models (Course, Employee, Instructor, Student) and Components Form.js.

class Validators {
  static isNotEmpty(value) {
    return value && typeof value === "string" && value.trim().length > 0;
  }

  static isValidName(name) {
    return this.isNotEmpty(name) && !/^\d+$/.test(name.trim());
  }

  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return this.isNotEmpty(email) && emailRegex.test(email);
  }

  static isValidPhone(phone) {
    const phoneRegex = /^[0-9]{10,11}$/;
    return this.isNotEmpty(phone) && phoneRegex.test(phone);
  }

  static isValidAge(age) {
    return age && age > 0 && age < 150;
  }

  static isValidArray(arr) {
    return Array.isArray(arr) && arr.length > 0;
  }

  static isValidDate(dateString) {
    if (!this.isNotEmpty(dateString)) return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }

  // Student fields: ALL REQUIRED - name, email, phone, age, department, courses
  static validateStudent(data) {
    const errors = {};
    if (!this.isValidName(data.name))
      errors.name = "Student name is required and cannot be only numbers";
    if (!this.isValidEmail(data.email))
      errors.email = "Valid student email is required";
    if (!this.isValidPhone(data.phone))
      errors.phone = "Valid student phone number is required";
    if (!this.isValidAge(data.age))
      errors.age = "Valid student age is required";
    if (!this.isNotEmpty(data.department))
      errors.department = "Department is required";
    if (!this.isValidArray(data.courses))
      errors.courses = "Courses array is required";
    return { isValid: Object.keys(errors).length === 0, errors };
  }

  // Course fields: ALL REQUIRED - name, code
  static validateCourse(data) {
    const errors = {};
    if (!this.isValidName(data.name))
      errors.name = "Course name is required and cannot be only numbers";
    if (!this.isNotEmpty(data.code)) errors.code = "Course code is required";
    return { isValid: Object.keys(errors).length === 0, errors };
  }

  // Instructor fields: ALL REQUIRED - name, email, age, department, assignedCourses
  static validateInstructor(data) {
    const errors = {};
    if (!this.isValidName(data.name))
      errors.name = "Instructor name is required and cannot be only numbers";
    if (!this.isValidEmail(data.email))
      errors.email = "Valid instructor email is required";
    if (!this.isValidAge(data.age))
      errors.age = "Valid instructor age is required";
    if (!this.isNotEmpty(data.department))
      errors.department = "Department is required";

    if (!data.assignedCourses || !this.isValidArray(data.assignedCourses)) {
      errors.assignedCourses = "Assigned courses array is required";
    } else {
      const course = data.assignedCourses[0];
      const assignedCoursesErrors = {};

      if (!course.courseId) {
        assignedCoursesErrors.courseId =
          "Course ID is required for assigned course";
      }

      if (!this.isValidDate(course.startDate)) {
        assignedCoursesErrors.startDate = "Valid start date is required";
      } else {
        // Check if start date is before today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(course.startDate);
        if (startDate < today) {
          assignedCoursesErrors.startDate = "Start date cannot be in the past";
        }
      }

      if (!this.isValidDate(course.endDate)) {
        assignedCoursesErrors.endDate = "Valid end date is required";
      } else if (
        this.isValidDate(course.startDate) &&
        new Date(course.endDate) < new Date(course.startDate)
      ) {
        assignedCoursesErrors.endDate = "End date cannot be before start date";
      }

      if (Object.keys(assignedCoursesErrors).length > 0) {
        errors.assignedCourses = assignedCoursesErrors;
      }
    }
    return { isValid: Object.keys(errors).length === 0, errors };
  }

  // Employee fields: ALL REQUIRED - name, email, age, position, role
  static validateEmployee(data) {
    const errors = {};
    if (!this.isValidName(data.name))
      errors.name = "Employee name is required and cannot be only numbers";
    if (!this.isValidEmail(data.email))
      errors.email = "Valid employee email is required";
    if (!this.isValidAge(data.age))
      errors.age = "Valid employee age is required";
    if (!this.isNotEmpty(data.position))
      errors.position = "Position is required";
    if (!this.isNotEmpty(data.role)) errors.role = "Role is required";
    return { isValid: Object.keys(errors).length === 0, errors };
  }
}

export default Validators;
