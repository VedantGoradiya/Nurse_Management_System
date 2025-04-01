/**
 * Ward API service.
 * Provides methods to handle ward operations.
 */

import { WardInputFormData } from "../types/ward.types";

export const WardAPI = {
  /**
   * Gets all wards from the backend.
   *
   * API Endpoint: GET /api/wards
   *
   * @returns {Promise<Object>} A promise gives the response from the backend with the wards data.
   * @throws {Error} If the request fails.
   */
  getAllWards: async () => {
    try {
      //Getting the base url and token from the environment variables and local storage
      const BASE_URL = import.meta.env.VITE_BASE_URL;
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/api/wards`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      //Parsing the response as json
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching wards:", error);
      return error;
    }
  },

  /**
   * Deletes a ward by sending the ward id to the backend.
   *
   * API Endpoint: DELETE /api/wards/:id
   *
   * @param {number} id - The id of the ward to be deleted.
   * @returns {Promise<Object>} A promise gives the response from the backend with the ward data of the deleted ward.
   * @throws {Error} If the request fails.
   */
  deleteWard: async (id: number) => {
    try {
      //Getting the base url and token from the environment variables and local storage
      const BASE_URL = import.meta.env.VITE_BASE_URL;
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/api/wards/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      //Parsing the response as json
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error deleting ward:", error);
      return error;
    }
  },

  /**
   * Creates a ward by sending the ward data to the backend.
   *
   * API Endpoint: POST /api/wards
   *
   * @param {WardInputFormData} ward - The ward data from the form.
   * @returns {Promise<Object>} A promise gives the response from the backend with the ward data of the created ward.
   * @throws {Error} If the request fails.
   */
  createWard: async (ward: WardInputFormData) => {
    try {
      //Getting the base url and token from the environment variables and local storage
      const BASE_URL = import.meta.env.VITE_BASE_URL;
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/api/wards`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ward),
      });

      //Parsing the response as json
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating ward:", error);
      return error;
    }
  },
};
