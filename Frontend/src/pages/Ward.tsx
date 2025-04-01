/**
 * Ward page component.
 * This component is used to display the ward page.
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { DataGrid, GridColDef, GridToolbarContainer } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from "@mui/icons-material/Close";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import { WardAPI } from "../API/Ward-API";
import { WardType, WardInputFormData } from "../types/ward.types";
import AddIcon from "@mui/icons-material/Add";

/**
 * BootstrapDialog component.
 * This component is used to display the dialog for the ward page.
 */
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const Ward = () => {
  const navigate = useNavigate();

  //state to save the rows
  const [rows, setRows] = useState<WardType[]>([]);

  //state to save the form data
  const [formData, setFormData] = useState<WardInputFormData>({
    wardName: "",
    wardColor: "",
  });

  //state to save the open/close state of the dialog
  const [open, setOpen] = useState<boolean>(false);

  //state to indicate the open backdrop (true or false)
  const [openBackdrop, setOpenBackdrop] = useState<boolean>(false);

  //state to indicate the open snackbar (true or false)
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

  //state to save the snackbar message
  const [snackbarMessage, setSnackbarMessage] =
    useState<string>("Login successful!!");

  //state to save the snackbar severity
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

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

  //columns for the table
  const columns: GridColDef[] = [
    { field: "id", headerName: "Ward ID", flex: 1, headerAlign: "center" },
    {
      field: "wardName",
      headerName: "Ward Name",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "wardColor",
      headerName: "Ward Color",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      headerAlign: "center",
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleDelete(params.row.id)} color="error">
            <DeleteIcon />
          </IconButton>
          {/* <IconButton
            onClick={() => {
              setOpen(true);
            }}
            color="primary"
          >
            <AddIcon />
          </IconButton> */}
        </>
      ),
    },
  ];

  //function to fetch the wards
  const fetchWards = async (): Promise<void> => {
    try {
      setOpenBackdrop(true);
      //Call the API to fetch the wards
      const data = await WardAPI.getAllWards();
      if (data.relogin) {
        localStorage.removeItem("token");
        navigate("/login");
      }
      //Checking if the wards are fetched successfully
      if (!data.error) {
        const rowsData = data.map((ward: WardType) => ({
          id: ward.id,
          wardName: ward.wardName,
          wardColor: ward.wardColor,
        }));

        setRows(rowsData);
      }
    } catch (error: any) {
      console.error("Error fetching wards:", error);
      setSnackbarSeverity("error");
      setSnackbarMessage(`Wards fetched failed: ${error.message}`);
      setOpenSnackbar(true);
    } finally {
      setOpenBackdrop(false);
    }
  };

  //function to handle the delete of the ward based on the id
  const handleDelete = async (id: number): Promise<void> => {
    try {
      setOpenBackdrop(true);
      //Call the API to delete the ward
      const data = await WardAPI.deleteWard(id);
      if (data.relogin) {
        localStorage.removeItem("token");
        navigate("/login");
      }
      //Checking if the ward is deleted successfully
      if (!data.error) {
        setSnackbarSeverity("success");
        setSnackbarMessage("Ward deleted successfully!!");
        setOpenSnackbar(true);
        fetchWards();
      }
    } catch (error: any) {
      console.error("Error deleting ward:", error);
      setSnackbarSeverity("error");
      setSnackbarMessage(`Ward deleted failed: ${error.message}`);
      setOpenSnackbar(true);
    } finally {
      setOpenBackdrop(false);
    }
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  //function to handle the change of the input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  //function to handle the change of the select
  const handleSelectChange = (e: SelectChangeEvent): void => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  //function to handle the save of the ward
  const handleSave = async (): Promise<void> => {
    try {
      setOpenBackdrop(true);
      if (validateWard()) {
        //Call the API to create the ward
        const data = await WardAPI.createWard(formData);
        if (data.relogin) {
          localStorage.removeItem("token");
          navigate("/login");
        }
        //Checking if the ward is created successfully
        if (!data.error) {
          setSnackbarSeverity("success");
          setSnackbarMessage("Ward created successfully!!");
          setOpenSnackbar(true);
          setFormData({
            wardName: "",
            wardColor: "",
          });
          fetchWards();
          handleClose();
        }
      }
    } catch (error: any) {
      console.error("Error creating ward:", error);
      setSnackbarSeverity("error");
      setSnackbarMessage(`Ward created failed: ${error.message}`);
      setOpenSnackbar(true);
    } finally {
      setOpenBackdrop(false);
    }
  };

  const validateWard = (): boolean => {
    if (formData.wardName === "" || formData.wardColor === "") {
      setSnackbarSeverity("error");
      setSnackbarMessage("Ward name and color are required");
      setOpenSnackbar(true);
      return false;
    }
    return true;
  };

  function EditToolbar() {
    return (
      <GridToolbarContainer>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Add record
        </Button>
      </GridToolbarContainer>
    );
  }

  useEffect(() => {
    fetchWards();
  }, []);
  return (
    <div>
      {/* <DataTable rows={rows} columns={columns} setOpen={setOpen} /> */}
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5, 10, 25]}
        slots={{ toolbar: EditToolbar }}
      />

      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth={"sm"}
        fullWidth={true}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Add Ward
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <form>
            <div>
              <TextField
                className="mb-4"
                id="outlined-basic"
                label="Ward Name"
                name="wardName"
                variant="outlined"
                value={formData.wardName}
                onChange={handleInputChange}
                fullWidth
              />

              <FormControl className="mb-4" fullWidth>
                <InputLabel id="ward-select-label">Ward Color</InputLabel>
                <Select
                  labelId="ward-select-label"
                  id="ward-select"
                  name="wardColor"
                  value={formData.wardColor}
                  label="Ward Color"
                  onChange={handleSelectChange}
                >
                  <MenuItem value="Red">Red</MenuItem>
                  <MenuItem value="Green">Green</MenuItem>
                  <MenuItem value="Blue">Blue</MenuItem>
                  <MenuItem value="Yellow">Yellow</MenuItem>
                </Select>
              </FormControl>
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleSave}>
            Save changes
          </Button>
        </DialogActions>
      </BootstrapDialog>

      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={openBackdrop}
        onClick={handleCloseBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
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
  );
};

export default Ward;
