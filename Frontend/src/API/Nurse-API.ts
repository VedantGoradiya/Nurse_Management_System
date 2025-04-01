
/**
 * Authentication API service.
 * Provides methods to handle nurse operations.
 */

import { NurseCreateUpdatePayload } from "../types/nurse.types";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem("token");

export const Nurse = {
   /**
   * Creates a nurse by sending the nurse data to the backend.
   * 
   * API Endpoint: POST /api/nurses
   * 
   * @param {NurseCreateUpdatePayload} nurse - The nurse data from the form.
   * @returns {Promise<Object>} A promise gives the response from the backend with the nurse data of the created nurse.
   * @throws {Error} If the request fails.
   */
  createNurse: async (nurse: NurseCreateUpdatePayload) => {
    try {
      //Getting the base url and token from the environment variables and local storage
      const response = await fetch(`${BASE_URL}/api/nurses`, {
        method: "POST",
        body: JSON.stringify(nurse),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      //Parsing the response as json
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating nurse:", error);
      return error;
    }
  },

  /**
   * Gets all nurses from the backend.
   * 
   * API Endpoint: GET /api/nurses
   * 
   * @returns {Promise<Object>} A promise gives the response from the backend with the nurses data.
   * @throws {Error} If the request fails.
   */
  getAllNurses: async () => {
    try {
      //Getting the base url and token from the environment variables and local storage
      const response = await fetch(`${BASE_URL}/api/nurses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      //Parsing the response as json
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching nurses:", error);
      return error;
    }
  },

  /**
   * Deletes a nurse by sending the nurse id to the backend.
   * 
   * API Endpoint: DELETE /api/nurses/:id
   * 
   * @param {number} id - The id of the nurse to be deleted.
   * @returns {Promise<Object>} A promise gives the response from the backend with the nurse data of the deleted nurse.
   * @throws {Error} If the request fails.
   */
  deleteNurse: async (id: number) => {
    try {
      //Getting the base url and token from the environment variables and local storage
      const response = await fetch(`${BASE_URL}/api/nurses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      //Parsing the response as json
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error deleting nurse:", error);
      return error;
    }
  },

  /**
   * Updates a nurse by sending the nurse id and the nurse data to the backend.
   * 
   * API Endpoint: PUT /api/nurses/:id
   * 
   * @param {number} id - The id of the nurse to be updated.  
   * @param {NurseCreateUpdatePayload} nurse - The nurse data from the form.
   * @returns {Promise<Object>} A promise gives the response from the backend with the nurse data of the updated nurse.
   * @throws {Error} If the request fails.
   */
  updateNurse: async (id: number, nurse: NurseCreateUpdatePayload) => {
    try {
      //Getting the base url and token from the environment variables and local storage
      const response = await fetch(`${BASE_URL}/api/nurses/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nurse),
      });

      //Parsing the response as json
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating nurse:", error);
      return error;
    }
  },

  /**
   * Filters nurses by full name and ward.
   * 
   * API Endpoint: GET /api/filter
   * 
   * @param {string} fullName - The full name of the nurse to be filtered.
   * @param {string} ward - The ward of the nurse to be filtered.
   * @param {number} page - The current page number.
   * @param {number} limit - The number of nurses to be displayed per page.
   * @returns {Promise<Object>} A promise gives the response from the backend with the nurses data of the filtered nurses.
   * @throws {Error} If the request fails.
   */
  filterNurses: async (
    fullName: string,
    ward: string,
    page: number,
    limit: number
  ) => {
    try {
      //Getting the base url and token from the environment variables and local storage
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(fullName?.trim() && { fullName: fullName.trim() }),
        ...(ward?.trim() && { wardName: ward.trim() }),
      });
      const response = await fetch(
        `${BASE_URL}/api/filter?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: "GET",
        }
      );

      //Parsing the response as json
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error filtering nurses:", error);
      return error;
    }
  },
};
