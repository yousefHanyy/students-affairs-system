// Employee Class Model and Validations.
// Employee Class Structure (id, name, email, position) and Validations (name and position are required, and email format).
// Note: Validation implementation is inside utils/validators.js, and the Employee class is defined in this file.

import validate from "../utils/validators.js";

class Employee {
  constructor(name, email, position) {
    this.name = name;
    this.email = email;
    this.position = position;
  }

  validate() {
    return validate.validateEmployee(this);
  }
}

export default Employee;
