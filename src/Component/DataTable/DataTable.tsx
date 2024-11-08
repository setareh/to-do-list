import { Delete, Edit } from "@mui/icons-material";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Snackbar, TextField } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams, GridRowParams } from "@mui/x-data-grid";
import React, { useState } from "react";
import { Priority, Status, Task } from "../../Types/Task";
import dayjs, { Dayjs } from "dayjs";
import { convertHours } from "../../utils/convertHours";
import './DataTable.css'
  interface DataTableProps {
    tasks : Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>
  }
  
  const paginationModel = { page: 0, pageSize: 5 };

  const DataTable: React.FC<DataTableProps> = ({ tasks, setTasks }) => {
    const [snackbarOpen, setSnackbarOpen] = useState(false); 
    const [snackbarMessage, setSnackbarMessage] = useState(''); 

    const [mainDialogOpen, setMainDialogOpen] = useState(false); 
    const [nestedDialogOpen, setNestedDialogOpen] = useState(false); 
    const [inputHash, setInputHash] = useState(''); 
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [status, setStatus] = useState<Status>(Status.TODO);

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

  const handleDelete = (taskId: number) => { 
    const task = tasks.find(t => t.id === taskId); 
    if (task) { 
      setSelectedTask(task); 
      setMainDialogOpen(true); 
    } 
  }

  const handleMainDialogClose = () => { 
    setMainDialogOpen(false); 
    setInputHash(''); 
    setSelectedTask(null); 
  }; 

  const handleNestedDialogOpen = () => { 
    setNestedDialogOpen(true); 
    setMainDialogOpen(false); 
  }

  const handleNestedDialogClose = () => { 
    setNestedDialogOpen(false); 
    setSelectedTask(null); 
    setInputHash('')
  }

    const handleSnackbarClose = () => { 
    setSnackbarOpen(false); 
  }

  const handleDeleteConfirm = () => { 
    if (selectedTask && inputHash === selectedTask.hash) { 
      const updatedTasks = tasks.filter(task => task.id !== selectedTask.id); 
      setTasks(updatedTasks); 
      localStorage.setItem('tasks', JSON.stringify(updatedTasks)); 
      setNestedDialogOpen(false); 
      setSnackbarMessage('Task deleted successfully!'); 
      setSnackbarOpen(true); 
      setInputHash('')
    } else { 
      setSnackbarMessage('Task key does not match! Task not deleted.'); 
      setSnackbarOpen(true);
      setInputHash('')
    } 
  }
  
// edit status
  const handleRowClick = (params: GridRowParams) => { 
    const task = tasks.find(t => t.id === params.id); 
    if (task) { 
      setSelectedTask(task); 
      setStatus(task.status); 
      setEditDialogOpen(true); 
    } 
  }
  
  const handleEditDialogClose = () => { 
    setEditDialogOpen(false); 
    setSelectedTask(null); 
  }

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => { 
    setStatus(event.target.value as Status); 
  }

  const handleSaveStatus = () => { 
    if (selectedTask) { 
      const updatedTasks = tasks.map(
        task => task.id === selectedTask.id ? { ...task, status } : task 
      ); 
      setTasks(updatedTasks); 
      localStorage.setItem('tasks', JSON.stringify(updatedTasks)); 
      setEditDialogOpen(false); 
      setSnackbarMessage('Status updated successfully!'); 
      setSnackbarOpen(true); 
    } 
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
              onRowClick={handleRowClick}
            />
          : <Alert severity="info" icon={false}>
              There is no Task
            </Alert> 
      }
      <Dialog open={mainDialogOpen} onClose={handleMainDialogClose}> 
        <DialogTitle>
          Are you sure you want to delete this task?
        </DialogTitle> 
        <DialogContent> 
          <DialogContentText>
            If you delete 
            <span style={{fontWeight: 'bold'}}>
              {` ${selectedTask?.title}`}
            </span>
            , it will be permanently removed.
          </DialogContentText> 
        </DialogContent> 
        <DialogActions sx={{px: 3, pb: 2}}> 
          <Button onClick={handleMainDialogClose}>
            Cancel
          </Button> 
          <Button onClick={handleNestedDialogOpen} color="error">
            Delete
          </Button> 
        </DialogActions> 
      </Dialog>

      <Dialog open={nestedDialogOpen} onClose={handleNestedDialogClose}> 
        <DialogTitle>
          Enter Task Key
        </DialogTitle> 
        <DialogContent> 
          <DialogContentText>
            If you are sure that you want to delete it, enter the task key <code className="code-label">{selectedTask?.hash}</code> 
          </DialogContentText>
          <TextField 
            autoFocus 
            sx={{mt:2}}
            label="Task Key" 
            type="text" 
            fullWidth 
            value={inputHash} 
            onChange={(e) => setInputHash(e.target.value)} 
          /> 
        </DialogContent> 
        <DialogActions sx={{px: 3, pb: 2}}> 
          <Button onClick={handleNestedDialogClose}>
            Cancel
          </Button> 
          <Button onClick={handleDeleteConfirm} color="error">
            Confirm Delete
          </Button> 
        </DialogActions> 
      </Dialog>

      <Dialog open={editDialogOpen} onClose={handleEditDialogClose}> 
        <DialogTitle>
          Edit Task Status
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select the new status for the task. 
          </DialogContentText>
          <TextField 
            select 
            label="Status" 
            value={status} 
            onChange={handleStatusChange} 
            fullWidth 
            sx={{mt:2}} 
           > 
            {
              Object.values(Status).map((statusOption) => ( 
                <MenuItem key={statusOption} value={statusOption}>{statusOption}</MenuItem> 
              ))
            }
          </TextField> 
          </DialogContent> 
          <DialogActions> 
            <Button onClick={handleEditDialogClose}>Cancel</Button> 
            <Button onClick={handleSaveStatus} color="primary">Save</Button> 
          </DialogActions> 
      </Dialog>

      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={2000} 
        onClose={handleSnackbarClose}> 
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbarMessage.includes('not') ? 'error' : 'success'}
          variant="filled"
          > 
          {snackbarMessage} 
        </Alert> 
      </Snackbar>
    </>
    
  )
}

export default DataTable;