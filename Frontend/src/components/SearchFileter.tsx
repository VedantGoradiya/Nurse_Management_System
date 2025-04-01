/**
 * SearchFileter component.
 * This component is used to search for nurses by name and ward.
 * Based on the search criteria, the nurses are filtered and displayed in the table.
 * @param {SearchFilterComponentProps} props - The props for the search fileter component.
 * Props:
 * - pageDetails: The page details of the table.
 * - fetchNurses: The function to fetch the nurses.
 *
 * Used/Called debounce hook to avoid the unnecessary re-renders.
 */

import { useEffect, useState } from "react";

import useDebounce from "../Hooks/useDebounce";
import { SearchFilterComponentProps } from "../types/comp.types";

import { TextField } from "@mui/material";

const SearchFileter = ({
  pageDetails,
  fetchNurses,
}: SearchFilterComponentProps) => {
  // state to save the full name and ward
  const [fullName, setFirstName] = useState<string>("");
  const [ward, setWard] = useState<string>("");

  // debounced values to avoid the unnecessary re-renders
  const debouncedFullName = useDebounce(fullName, 1000);
  const debouncedWard = useDebounce(ward, 1000);

  useEffect(() => {
    fetchNurses(debouncedFullName, debouncedWard);
  }, [debouncedFullName, debouncedWard, pageDetails]);

  return (
    <div>
      <div>
        <form>
          <div
            style={{
              margin: "10px",
              display: "flex",
              justifyContent: "space-evenly",
            }}
          >
            <div className="d-flex justify-content-center align-items-center">
              <label className="mr-4">Search by Name</label>
              <TextField
                id="outlined-basic"
                label="Enter Name"
                variant="outlined"
                value={fullName}
                size="small"
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="d-flex justify-content-center align-items-center">
              <label className="mr-4">Search by Ward</label>
              <TextField
                id="outlined-basic"
                label="Enter Ward"
                variant="outlined"
                value={ward}
                size="small"
                onChange={(e) => setWard(e.target.value)}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchFileter;
