/**
 * Home page component.
 * This component is used to display the home page.
 * It is used to display the nurses in the table.
 * It is also used to display the search filter and the model.
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { IconButton, SelectChangeEvent } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { GridColDef } from "@mui/x-data-grid";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { AlertColor } from "@mui/material/Alert";

import SearchFileter from "../components/SearchFileter";
import Model from "../components/Model";
import DataTable from "../components/DataTabel";
import { Nurse } from "../API/Nurse-API";
import { WardAPI } from "../API/Ward-API";
import {
  NurseType,
  NurseCreateUpdatePayload,
  NurseInputFormData,
  NurseColumnHeader,
  PaginationDetails,
} from "../types/nurse.types";
import { WardType } from "../types/ward.types";
import { validateString } from "../utils/InputValidation";

const Home = () => {
  const navigate = useNavigate();

  //state to save the rows value that has to be displayed in the table
  const [rows, setRows] = useState<NurseColumnHeader[]>([]);

  //state to save the wards value that has to be displayed in the modal select options for the ward
  const [wards, setWards] = useState<WardType[]>([]);

  //state to indicate the current page and the limit of the rows to be displayed in the table
  const [pageDetails, setPageDetails] = useState<PaginationDetails>({
    pageSize: 5,
    page: 1,
  });
  const [totalPages, setTotalPages] = useState<number>(0);

  //columns to be displayed in the table
  const columns: GridColDef[] = [
    { field: "id", headerName: "Employee ID", flex: 1, headerAlign: "center" },
    {
      field: "firstName",
      headerName: "First Name",
      editable: false,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "lastName",
      headerName: "Last Name",
      editable: false,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "email",
      headerName: "Email",
      editable: false,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "wardName",
      headerName: "Ward",
      editable: false,
      flex: 1,
      headerAlign: "center",
    }, // Fixed
    {
      field: "wardColor",
      headerName: "Ward Color",
      editable: false,
      flex: 1,
      headerAlign: "center",
    }, // Fixed
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => {
              handleEdit(params.row.id);
              setEditMode(true);
            }}
            color="primary"
          >
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)} color="error">
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  //state to save the selected row to be edited
  const [selectedRow, setSelectedRow] = useState<NurseColumnHeader | null>(
    null
  );

  //state to indicate the edit mode (true or false)
  const [editMode, setEditMode] = useState<boolean>(false);

  //state to indicate the open model (true or false)
  const [openModel, setOpenModel] = useState<boolean>(false);

  //state to indicate the open backdrop (true or false)
  const [openBackdrop, setOpenBackdrop] = useState<boolean>(false);

  //state to indicate the open snackbar (true or false)
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

  //state to save the snackbar message
  const [snackbarMessage, setSnackbarMessage] =
    useState<string>("Login successful!!");

  //state to save the snackbar severity
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<AlertColor>("success");

  //function to handle the close of the snackbar
  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  //function to handle the close of the backdrop
  const handleCloseBackdrop = (): void => {
    setOpenBackdrop(false);
  };

  //state to save the form data to be used in the model
  const [formData, setFormData] = useState<NurseInputFormData>({
    firstName: "",
    lastName: "",
    email: "",
    wardName: "",
    wardColor: "",
  });

  //function to handle the delete of the nurse which takes the id of the nurse to be deleted
  const handleDelete = async (id: number): Promise<void> => {
    try {
      setOpenBackdrop(true);
      //API call to delete the nurse
      const response = await Nurse.deleteNurse(id);

      //Checking if the token is expired and redirecting to the login page
      if (response.relogin) {
        localStorage.removeItem("token");
        navigate("/login");
      }

      //Checking if the nurse is deleted successfully
      if (!response.error) {
        setSnackbarSeverity("success");
        setSnackbarMessage("Nurse deleted successfully!!");
        setOpenSnackbar(true);
        fetchNurses();
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      console.error("Error deleting nurse:", error);
      setSnackbarSeverity("error");
      setSnackbarMessage(`Error deleting nurse: ${error.message}`);
      setOpenSnackbar(true);
    } finally {
      setOpenBackdrop(false);
    }
  };

  //function to handle the edit of the nurse which takes the id of the nurse to be edited
  const handleEdit = (id: number): void => {
    //Finding the row to be edited
    const foundRow = rows.find((row) => row.id === id);

    //Checking if the row is found and setting the selected row and form data
    foundRow && setSelectedRow(foundRow);
    foundRow &&
      setFormData({
        firstName: foundRow.firstName,
        lastName: foundRow.lastName,
        email: foundRow.email,
        wardName: foundRow.wardName,
        wardColor: foundRow.wardColor,
      });
    foundRow && setOpenModel(true);
  };

  //function to handle the close of the model and resetting the edit mode
  const handleCloseModel = (): void => {
    setOpenModel(false);
    setEditMode(false);
  };

  //function to handle the input change of the form input fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  //function to handle the select change of the form select fields
  const handleSelectChange = (e: SelectChangeEvent): void => {
    const { name, value } = e.target;

    //Checking if the ward name is selected and setting the ward color and ward name
    if (name === "wardName") {
      setFormData({
        ...formData,
        wardColor:
          wards.find((ward) => ward.wardName === value)?.wardColor || "",
        [name]: value,
      });
    } else {
      //Setting the form data for the other fields
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  //function to handle the save of the form
  const handleSave = async (): Promise<void> => {
    try {
      setOpenBackdrop(true);

      if (validateNurse()) {
        //Setting the ward id for the form data
        let newWordId;

        //Finding the ward id for the form data
        wards.forEach((val) => {
          if (val.wardName === formData.wardName) {
            newWordId = val.id;
          }
        });

        //Checking if the ward id is found
        if (!newWordId) {
          throw new Error("Invalid ward selected");
        }

        //Setting the body for the API call by adding the ward id to the form data
        const body = {
          ...formData,
          wardId: newWordId,
        };

        let response;

        //Checking if the edit mode.
        //If the edit mode is false, the nurse is created and the response is saved in the response variable
        if (!editMode) {
          response = await Nurse.createNurse(body as NurseCreateUpdatePayload);
        } else {
          //If the edit mode is true, the nurse is updated and the response is saved in the response variable
          if (!selectedRow) throw new Error("No nurse selected for update");
          response = await Nurse.updateNurse(
            selectedRow.id,
            body as NurseCreateUpdatePayload
          );
        }

        //Checking if the token is expired and redirecting to the login page
        if (response.relogin) {
          localStorage.removeItem("token");
          navigate("/login");
        }

        //Checking if the nurse is created or updated successfully
        if (!response.error) {
          setSnackbarSeverity("success");
          setSnackbarMessage(
            editMode
              ? "Nurse updated successfully!!"
              : "Nurse created successfully!!"
          );
          setOpenSnackbar(true);
          fetchNurses();
          handleCloseModel();
        } else {
          throw new Error("Failed to update nurse");
        }
      }
    } catch (error: any) {
      console.error("Error updating nurse:", error);
      setSnackbarSeverity("error");
      setSnackbarMessage(`Error updating nurse: ${error.message}`);
      setOpenSnackbar(true);
    } finally {
      setOpenBackdrop(false);
    }
  };

  //function to fetch the nurses from the API
  const fetchNurses = async (
    fullName?: string,
    ward?: string
  ): Promise<void> => {
    try {
      setOpenBackdrop(true);
      //API call to fetch the nurses
      const data = await Nurse.filterNurses(
        fullName ?? "",
        ward ?? "",
        pageDetails.page,
        pageDetails.pageSize
      );

      //Checking if the token is expired and redirecting to the login page
      if (data.relogin) {
        localStorage.removeItem("token");
        navigate("/login");
      }

      //Checking if the nurses are fetched successfully
      if (!data.error) {
        const rowsData = data.nurses.map((nurse: NurseType) => ({
          id: nurse.employeeId,
          firstName: nurse.firstName,
          lastName: nurse.lastName,
          email: nurse.email,
          wardName: nurse.ward.wardName,
          wardColor: nurse.ward.wardColor,
          wardId: nurse.ward.wardId,
        }));

        setTotalPages(data.totalRecords);
        setRows(rowsData);
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      console.error("Error fetching nurses:", error);
      setSnackbarSeverity("error");
      setSnackbarMessage(`Error fetching nurses: ${error.message}`);
      setOpenSnackbar(true);
    } finally {
      setOpenBackdrop(false);
    }
  };

  //function to fetch the wards from the API
  const fetchWards = async (): Promise<void> => {
    try {
      setOpenBackdrop(true);

      //API call to fetch the wards
      const data = await WardAPI.getAllWards();

      //Checking if the token is expired and redirecting to the login page
      if (data.relogin) {
        localStorage.removeItem("token");
        navigate("/login");
      }

      //Checking if the wards are fetched successfully
      if (!data.error) {
        setWards(data);
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      console.error("Error fetching wards:", error);
      setSnackbarSeverity("error");
      setSnackbarMessage(`Error fetching wards: ${error.message}`);
      setOpenSnackbar(true);
    } finally {
      setOpenBackdrop(false);
    }
  };

  //function to handle the page change of the table
  const handlePageChange = (pageDetails: PaginationDetails): void => {
    setPageDetails(pageDetails);
  };

  const validateNurse = (): boolean => {
    if (!validateString(formData.firstName)) {
      setSnackbarSeverity("error");
      setSnackbarMessage("First name is required");
      setOpenSnackbar(true);
      return false;
    }

    if (!validateString(formData.lastName)) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Last name is required");
      setOpenSnackbar(true);
      return false;
    }

    if (!validateString(formData.email)) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Email is required");
      setOpenSnackbar(true);
      return false;
    }

    if (!validateString(formData.wardName)) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Ward name is required");
      setOpenSnackbar(true);
      return false;
    }

    return true;
  };

  //useEffect to fetch the nurses and the wards
  useEffect(() => {
    fetchNurses();
    fetchWards();
  }, []);

  return (
    <>
      <div className="mt-3 mb-2">
        {/* Search filter component */}
        <SearchFileter pageDetails={pageDetails} fetchNurses={fetchNurses} />
      </div>
      <div>
        {/* Table component */}
        <div>
          <DataTable
            rows={rows}
            columns={columns}
            setOpen={setOpenModel}
            setPageDetails={handlePageChange}
            totalPages={totalPages}
          />
        </div>

        {/* Model component */}
        <Model
          open={openModel}
          handleClose={handleCloseModel}
          editMode={editMode}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
          handleSave={handleSave}
          wards={wards}
        />

        {/* Backdrop/Loading component */}
        <Backdrop
          sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
          open={openBackdrop}
          onClick={handleCloseBackdrop}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        {/* Snackbar/Toast component */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={2000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "left" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbarSeverity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    </>
  );
};

export default Home;
