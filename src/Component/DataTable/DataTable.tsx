import { Delete, Edit } from "@mui/icons-material";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid2, MenuItem, Snackbar, TextField } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams, GridRowParams } from "@mui/x-data-grid";
import React, { useState } from "react";
import { Priority, Status, Task } from "../../Types/Task";
import dayjs from "dayjs";
import { convertHours } from "../../utils/convertHours";
import './DataTable.css'
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import SwapVertOutlinedIcon from '@mui/icons-material/SwapVertOutlined';
  interface DataTableProps {
    tasks : Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>
  }
  
  const paginationModel = { page: 0, pageSize: 5 };

  const DataTable: React.FC<DataTableProps> = ({ tasks, setTasks }) => {
    const [snackbarOpen, setSnackbarOpen] = useState(false); 
    const [snackbarMessage, setSnackbarMessage] = useState(''); 
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');


    const [mainDialogOpen, setMainDialogOpen] = useState(false); 
    const [nestedDialogOpen, setNestedDialogOpen] = useState(false); 
    const [inputHash, setInputHash] = useState(''); 
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editTaskDialogOpen, setEditTaskDialogOpen] = useState(false);
    const [status, setStatus] = useState<Status>(Status.TODO);

    const [searchQuery, setSearchQuery] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const priorityOrder = { [Priority.LOW]: 3, [Priority.MEDIUM]: 2, [Priority.HIGH]: 1, };

  const columns: GridColDef[] = [
    { 
      field: 'title', 
      headerName: 'Title', 
      width: 500, 
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
          <Button variant="text" sx={{color: '#0a7d64'}} size="large" onClick={(event) => handleEdit(params.id as number, event)} style={{ marginRight: 8 }} > 
              <Edit /> 
          </Button> 
          <Button variant="text" color="error" size="large" onClick={(event) => handleDelete(params.id as number, event)} > 
            <Delete /> 
          </Button> 
        </div> ) }
  ];

  const showSnackbar = (message: string, severity: 'success' | 'error') => { 
    setSnackbarMessage(message); 
    setSnackbarSeverity(severity); 
    setSnackbarOpen(true); 
  }; 



  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
    setSearchQuery(e.target.value); }; 
    const toggleSortOrder = () => { 
      setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc')); 
    }
    
  const getFilteredTasks = () => { 
    return tasks.filter(task => task.title.toLowerCase().includes(searchQuery.toLowerCase())); 
  }
  
  const getSortedTasks = () => { 
    return getFilteredTasks().sort((a, b) => { 
      if (sortOrder === 'asc') { return priorityOrder[a.priority] - priorityOrder[b.priority]; 
      } else { 
        return priorityOrder[b.priority] - priorityOrder[a.priority]; } 
      }
    ); 
  };

  const handleEdit = (id: number, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const task = tasks.find(task => task.id === id); 
    if (task) { 
      setSelectedTask(task); 
      setEditTaskDialogOpen(true); 
    }
  }

  const handleFieldChange = (field: keyof Task, value: any) => { 
    if (selectedTask) { 
      setSelectedTask({ ...selectedTask, [field]: value }); 
    } 
  }

  const handleSaveEdit = () => { 
    if (selectedTask) { 
      const updatedTasks = tasks.map(task => task.id === selectedTask.id ? selectedTask : task ); 
      if (selectedTask.estimate <= 0) {
        showSnackbar('Estimate must be a positive number and grather than 0.', 'error');
        
        return
      } else {
        setTasks(updatedTasks); 
        localStorage.setItem('tasks', JSON.stringify(updatedTasks)); 
        setEditTaskDialogOpen(false); 
        showSnackbar('Task updated successfully!','success'); 
      }
    } 
  }
// delete task
  const handleDelete = (taskId: number, event: React.MouseEvent<HTMLButtonElement>) => { 
    event.stopPropagation();
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
      showSnackbar('Task deleted successfully!', 'success'); 
      
      setInputHash('');
    } else { 
      showSnackbar('Task key does not match! Task not deleted.', 'error'); 
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

  const handleEditTaskDialogClose = () => { 
    setEditTaskDialogOpen(false); 
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
      showSnackbar('Status updated successfully!', 'success'); 
    } 
  }

  return (
    <>
      {
        tasks.length > 0 
          ? <>
              <Box>
                <Grid2 container spacing={{ xs: 2, }} columns={{ xs: 12}}>
                  <Grid2 size={{ xs: 12, md: 6 }} >
                    <TextField 
                      label="Search" 
                      value={searchQuery} 
                      onChange={handleSearchChange} 
                      size="small"
                      variant="outlined"  
                      fullWidth
                      sx={{mr: 2}}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12, md: 6}} >
                    <Button 
                      onClick={toggleSortOrder} 
                      variant="contained" 
                      style={{backgroundColor: '#0a7d64', marginBottom: '16px'}}
                    > 
                        <SwapVertOutlinedIcon />
                        Sort by Priority ({sortOrder === 'asc' ? 'asc' : 'desc'})
                      </Button>
                    </Grid2>
                </Grid2>
              </Box>
              <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={getSortedTasks()}
                    columns={columns}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10]}
                    onRowClick={handleRowClick}
                    sx={{backgroundColor: '#fff'}}
                  />
              </Box>
            </>
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
            Select the new status for 
            <span style={{fontWeight: 'bold'}}>
              {` ${selectedTask?.title}`}
            </span> 
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
          <DialogActions sx={{px: 3, pb: 2}}> 
            <Button onClick={handleEditDialogClose}>Cancel</Button> 
            <Button onClick={handleSaveStatus} color="primary">Save</Button> 
          </DialogActions> 
      </Dialog>

      <Dialog open={editTaskDialogOpen} onClose={handleEditTaskDialogClose}> 
        <DialogTitle>Edit Task</DialogTitle> 
        <DialogContent> 
          {
            selectedTask &&
              <>
                <TextField 
                  label="Title" 
                  value={selectedTask?.title || ''} 
                  onChange={(e) => handleFieldChange('title', e.target.value)} 
                  fullWidth 
                  sx={{my: 2}} 
                /> 
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker 
                    label="Choose time"
                    value={dayjs(selectedTask.dateTime)}
                    onChange={(newValue) => handleFieldChange('dateTime', newValue)}
                    disablePast={true}
                    sx={{mb: 2}}
                    />
                </LocalizationProvider>
                <TextField 
                  label="Estimate" 
                  type="number" 
                  value={selectedTask?.estimate} 
                  onChange={(e) => handleFieldChange('estimate', e.target.value)} 
                  fullWidth  
                  sx={{mb: 2}} 
                /> 
                <TextField 
                  select 
                  label="Priority" 
                  value={selectedTask?.priority || ''} 
                  onChange={(e) => handleFieldChange('priority', e.target.value as Priority)} 
                  fullWidth 
                  sx={{mb: 2}} 
                > 
                  {
                    Object.values(Priority).map((priorityOption) => ( 
                    <MenuItem key={priorityOption} value={priorityOption}>{priorityOption}</MenuItem> 
                    ))
                  } 
                </TextField> 
                <TextField 
                  select 
                  label="Status" 
                  value={selectedTask?.status || ''} onChange={(e) => handleFieldChange('status', e.target.value as Status)} 
                  fullWidth
                  sx={{mb: 2}} 
                > 
                  {
                    Object.values(Status).map((statusOption) => ( 
                    <MenuItem key={statusOption} value={statusOption}>{statusOption}</MenuItem> 
                    ))
                  } 
                </TextField>
              </>
          }
           
        </DialogContent> 
        <DialogActions sx={{px: 3, pb: 2}}> 
          <Button onClick={handleEditTaskDialogClose}>Cancel</Button> 
          <Button onClick={handleSaveEdit} color="primary">Save</Button> 
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={2000} 
        onClose={handleSnackbarClose}> 
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbarSeverity}
          variant="filled"
          > 
          {snackbarMessage} 
        </Alert> 
      </Snackbar>
    </>
    
  )
}

export default DataTable;