import { SelectChangeEvent } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";

import {
  NurseInputFormData,
  PaginationDetails,
  NurseColumnHeader,
} from "./nurse.types";

import { WardType } from "./ward.types";

export interface SearchFilterComponentProps {
  pageDetails: PaginationDetails;
  fetchNurses: (fullName: string, ward: string) => void;
}

export interface ModelComponentProps {
  open: boolean;
  handleClose: () => void;
  editMode: boolean;
  formData: NurseInputFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (e: SelectChangeEvent) => void;
  handleSave: () => void;
  wards: WardType[];
}

export interface DataTableProps {
  rows: NurseColumnHeader[];
  columns: GridColDef[];
  setOpen: (open: boolean) => void;
  setPageDetails: (pageDetails: PaginationDetails) => void;
}

export interface DataTableCompProps extends DataTableProps {
  totalPages: number;
}
