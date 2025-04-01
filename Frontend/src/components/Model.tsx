/**
 * Model component.
 * This component is used to display the modal.
 * @param {ModelComponentProps} props - The props for the model component.
 * Props:
 * - open: The state of the modal to be open or closed conditionally.
 * - handleClose: The function to close the modal.
 * - editMode: The state to indicate the edit mode (true or false).
 *      If true, the form will be display the data of the selected row.
 * - formData: The form data to be displayed in the modal.
 * - handleInputChange: The function to handle the input change.
 * - handleSelectChange: The function to handle the select change.
 * - handleSave: The function to handle the save button.
 * - wards: The wards data to be displayed in the select options.
 */

import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from "@mui/icons-material/Close";

import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

import { ModelComponentProps } from "../types/comp.types";
import { WardType } from "../types/ward.types";

/**
 * Bootstrap Dialog component.
 * This component is used to display the modal in a styled way (Bootstrap).
 * This is moved out of the Model component to avoid the re-rendering of the modal.
 */
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const Model = ({
  open,
  handleClose,
  editMode,
  formData,
  handleInputChange,
  handleSelectChange,
  handleSave,
  wards,
}: ModelComponentProps) => {
  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth={"sm"}
        fullWidth={true}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Edit Nurse
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
                label="First Name"
                name="firstName"
                variant="outlined"
                value={editMode ? formData.firstName : null}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                className="mb-4"
                id="outlined-basic"
                label="Last Name"
                name="lastName"
                variant="outlined"
                value={editMode ? formData.lastName : undefined}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                className="mb-4"
                id="outlined-basic"
                label="Email"
                name="email"
                variant="outlined"
                value={editMode ? formData.email : undefined}
                onChange={handleInputChange}
                fullWidth
              />

              <FormControl className="mb-4" fullWidth>
                <InputLabel id="ward-select-label">Ward</InputLabel>
                <Select
                  labelId="ward-select-label"
                  id="ward-select"
                  name="wardName"
                  value={editMode ? formData.wardName : undefined}
                  label="Ward"
                  onChange={handleSelectChange}
                >
                  {wards.map((ward: WardType) => (
                    <MenuItem key={ward.id} value={ward.wardName}>
                      {`${ward.wardName} - ${ward.id}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl className="mb-4" fullWidth>
                <InputLabel id="color-select-label">Color</InputLabel>
                <Select
                  labelId="color-select-label"
                  id="color-select"
                  name="wardColor"
                  value={editMode ? formData.wardColor : formData.wardColor}
                  label="Color"
                  onChange={handleSelectChange}
                  disabled={true}
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
    </div>
  );
};

export default Model;
