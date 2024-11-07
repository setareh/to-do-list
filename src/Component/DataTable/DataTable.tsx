import { Delete, Edit } from "@mui/icons-material";
import { Button } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useState } from "react";
import { Task , Priority, Status } from "../../Types/Task";

type Props = {}

  const initialData: Task[] = [
    { id: 1, title: `Do task 1`, priority: Priority.HIGH, dateTime: new Date(), estimate: 5, status: Status.DONE, hash: 'hdsd,kdfh,dkfj' },
    { id: 2, title: 'Do task Lorem 2', priority: Priority.HIGH, dateTime: new Date(), estimate: 5, status: Status.WARNING, hash: 'hdsd,kdfh,dkfj' },
    { id: 3, title: 'Do task 3', priority: Priority.LOW, dateTime: new Date(), estimate: 5, status: Status.DOING, hash: 'hdsd,kdfh,dkfj' },
    { id: 4, title: 'Do task 4 fdfd', priority: Priority.MEDIUM, dateTime: new Date(), estimate: 5, status: Status.DONE, hash: 'hdsd,kdfh,dkfj' },
    { id: 5, title: 'Lorem Do task 5', priority: Priority.HIGH, dateTime: new Date(), estimate: 5, status: Status.PENDING, hash: 'hdsd,kdfh,dkfj' },
    { id: 6, title: 'Do task df2dd 6', priority: Priority.MEDIUM, dateTime: new Date(), estimate: 5, status: Status.DOING, hash: 'hdsd,kdfh,dkfj' },
    { id: 7, title: 'Do task asdf  7', priority: Priority.LOW, dateTime: new Date(), estimate: 5, status: Status.FAILED, hash: 'hdsd,kdfh,dkfj' },
    { id: 8, title: 'Do task df2dd 8', priority: Priority.LOW, dateTime: new Date(), estimate: 5, status: Status.TODO, hash: 'hdsd,kdfh,dkfj' },
    { id: 9, title: 'Do task lorem 9', priority: Priority.HIGH, dateTime: new Date(), estimate: 5, status: Status.PENDING, hash: 'hdsd,kdfh,dkfj' },
    { id: 10, title: 'Do task df2dd 10 ', priority: Priority.MEDIUM, dateTime: new Date(), estimate: 5, status: Status.FAILED, hash: 'hdsd,kdfh,dkfj' },
    { id: 11, title: 'Do task fdfsd 11', priority: Priority.HIGH, dateTime: new Date(), estimate: 5, status: Status.PENDING, hash: 'hdsd,kdfh,dkfj' },
  ]
  
  const paginationModel = { page: 0, pageSize: 5 };

export default function DataTable({}: Props) {
    const [data, setData] = useState<Task[]>(initialData);

    const columns: GridColDef[] = [
        // { field: 'id', headerName: 'ID', width: 40, sortable: false, },
        { field: 'title', headerName: 'Title', width: 250, sortable: false, },
        { field: 'priority', headerName: 'Priority', width: 100, sortable: true },
        { field: 'dateTime', headerName: 'Date Time', width: 130, sortable: false, },
        { field: 'estimate', headerName: 'Estimate (h)', sortable: false, width: 100},
        { field: 'status', headerName: 'Status', sortable: false, width: 100},
        // { field: 'estimate', headerName: 'Estimate (h)', sortable: false, width: 160, valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,},
        { field: 'actions', 
            headerName: 'Actions', 
            width: 150, 
            sortable: false, 
            renderCell: (params: GridRenderCellParams) => ( 
                <div> 
                    <Button variant="contained" color="primary" size="small" onClick={() => handleEdit(params.id as number)} style={{ marginRight: 8 }} > 
                        <Edit fontSize="small" /> 
                    </Button> 
                    <Button variant="contained" color="secondary" size="small" onClick={() => handleDelete(params.id as number)} > 
                        <Delete fontSize="small" /> 
                    </Button> 
                </div> ) }
      ];

    const handleEdit = (id: number) => {
        console.log('edit',id);
    }

    const handleDelete = (id: number) => {
        console.log('delete');
        setData(data.filter((item) => item.id !== id));
    }
  return (
    <DataGrid
        rows={data}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        // checkboxSelection
        // sx={{ border: 0 }}
      />
  )
}