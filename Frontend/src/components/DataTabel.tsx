/**
 * Data Table component.
 * This component is used to display the data in a table format.
 * @param {DataTableCompProps} props - The props for the data table component.
 * Props:
 * - rows: The data to be displayed in the table.
 * - columns: The columns to be displayed in the table.
 * - setOpen: The function to open the modal.
 * - setPageDetails: The function to set the page details.
 * - totalPages: The total number of pages.
 */

import { useEffect, useState } from "react";

import { Button } from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridPaginationModel,
} from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";

import { DataTableCompProps } from "../types/comp.types";

const DataTable = ({
  rows,
  columns,
  setOpen,
  setPageDetails,
  totalPages,
}: DataTableCompProps) => {
  //State for the saving the pagination details
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });

  useEffect(() => {
    if (setPageDetails) {
      setPageDetails({
        //Adding 1 to the page number because the data grid starts from 0
        page: paginationModel.page + 1,
        pageSize: paginationModel.pageSize,
      });
    }
  }, [paginationModel]);

  /**
   * Edit Toolbar component.
   * This component is used to display the Add Record button above the table.
   * onClick event is used to open the modal.
   */
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

  return (
    <DataGrid
      //Setting the cell to the center
      sx={{
        "& .MuiDataGrid-cell": {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        "& .MuiTablePagination-selectLabel": {
          margin: "0",
        },
        "& .MuiTablePagination-displayedRows": {
          margin: "0",
        },
      }}
      rows={rows}
      columns={columns}
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
      //Setting the page size options to 5, 10, 25, 100
      pageSizeOptions={[5, 10, 25, 100]}
      //Setting the toolbar to the edit toolbar
      rowCount={totalPages}
      paginationMode="server"
      slots={{ toolbar: EditToolbar }}
    />
  );
};

export default DataTable;
