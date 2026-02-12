// Instructor Class Model and Validations.
// Instructor Class Structure (id, name, email, department) and Validations (name and department are required, and email format).
// Note: Validation implementation is inside utils/validators.js, and the Instructor class is defined in this file.

import validate from "../utils/validators.js";

class Instructor {
  constructor(id = null, name, email, department) {
    // json-server handles ID generation for new records, but you still need ID support in the models for edit operations
    if (id) this.id = id;
    this.name = name;
    this.email = email;
    this.department = department;
  }

  validate() {
    return validate.validateInstructor(this);
  }
}

export default Instructor;
