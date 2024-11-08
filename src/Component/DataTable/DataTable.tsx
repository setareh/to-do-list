import { Delete, Edit } from "@mui/icons-material";
import { Alert, Button } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import React from "react";
import { Task } from "../../Types/Task";
import dayjs from "dayjs";
import { convertHours } from "../../utils/convertHours";
  interface DataTableProps {
    tasks : Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>
  }
  
  const paginationModel = { page: 0, pageSize: 5 };

  const DataTable: React.FC<DataTableProps> = ({ tasks, setTasks }) => {

  const columns: GridColDef[] = [
    { 
      field: 'title', 
      headerName: 'Title', 
      width: 300, 
      sortable: false, },
    { 
      field: 'priority', 
      headerName: 'Priority', 
      width: 100, 
      sortable: true },
    { 
      field: 'dateTime', 
      headerName: 'Date & Time', 
      width: 200, 
      sortable: false,
      valueFormatter: (params) => {
        const dateValue = dayjs(params);
        return dateValue.format('YYYY-MM-DD HH:mm:ss');
      }
    },
    { 
      field: 'estimate', 
      headerName: 'Estimate', 
      sortable: false, 
      width: 100,
      valueFormatter: (params) => {
        return convertHours(params)
      }
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      sortable: false, 
      width: 100},
    { 
      field: 'actions', 
      headerName: 'Actions', 
      width: 150, 
      sortable: false, 
      renderCell: (params: GridRenderCellParams) => ( 
        <div> 
          <Button variant="text" color="primary" size="large" onClick={() => handleEdit(params.id as number)} style={{ marginRight: 8 }} > 
              <Edit /> 
          </Button> 
          <Button variant="text" color="error" size="large" onClick={() => handleDelete(params.id as number)} > 
              <Delete /> 
          </Button> 
        </div> ) }
  ];

  const handleEdit = (id: number) => {
    console.log('edit',id);
  }

  const handleDelete = (id: number) => {
    const updatedTasks = tasks.filter(task => task.id !== id); 
    setTasks(updatedTasks); 
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  }

  return (
    <>
      {
        tasks.length > 0 
          ? <DataGrid
              rows={tasks}
              columns={columns}
              initialState={{ pagination: { paginationModel } }}
              pageSizeOptions={[5, 10]}
            />
          : <Alert severity="info">
              There is no Task
            </Alert> 
      }
    </>
    
  )
}

export default DataTable;