// Base API Class to Handle API Requests.
// GET, POST, PUT, DELETE Methods for API Calls.
class BaseApi {
  constructor(baseURL = "http://localhost:3000") {
    this.baseURL = baseURL;
  }
  //Get method:
  async get(endpoint) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("GET error:", error);
      throw error;
    }
  }
}
