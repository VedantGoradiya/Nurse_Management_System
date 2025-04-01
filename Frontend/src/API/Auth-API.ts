/**
 * Authentication API service.
 * Provides methods to handle user authentication.
 */

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const Auth = {
  /**
   * Login a user by sending credentials to the backend.
   *
   * API Endpoint: POST /auth/login
   *
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   * @returns {Promise<Object>} A promise gives the response from the backend with the user data and token.
   * @throws {Error} If the request fails.
   */
  login: async (email: string, password: string) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  },

  /**
   * Sign up a user by sending credentials to the backend.
   *
   * API Endpoint: POST /auth/signup
   *
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   * @param {string} role - The user's role.
   * @returns {Promise<Object>} A promise gives the response from the backend with the user data.
   * @throws {Error} If the request fails.
   */
  signup: async (email: string, password: string, role: string) => {
    try {
      //Getting the base url from the environment variables
      const response = await fetch(`${BASE_URL}/auth/signup`, {
        method: "POST",
        body: JSON.stringify({ email, password, role }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      //Parsing the response as json
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  },
};
