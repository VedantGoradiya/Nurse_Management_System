/**
 * useDebounce hook.
 * This hook is used to debounce the value of the input field.
 * @param value - The value of the input field.
 * @param {number} delayInMS - The delayInMS of the debounce.
 * @returns {string} The debounced value of the input field.
 */

import { useState, useEffect } from "react";

const useDebounce = (value: string, delayInMS: number):string => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  //Called every time the value or delayInMS changes
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayInMS);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delayInMS]);

  return debouncedValue;
};

export default useDebounce; 