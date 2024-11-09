import React, { useState } from 'react'
import { Button, Dialog, DialogActions, DialogContent, InputLabel, MenuItem, Select, TextField, FormControl, SelectChangeEvent, Snackbar , Alert, SnackbarOrigin, IconButton } from "@mui/material";
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { Priority, Status, Task } from '../../Types/Task';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useOnChangeHandler } from '../../utils/hooks/useOnChangeHandler';
import { generateHashCode } from '../../utils/hash';

interface AddTaskProps {
  onAddTask: (task: Task) => void;
}

interface Toast extends SnackbarOrigin {
  open: boolean;
}

const AddTask: React.FC<AddTaskProps> = ({onAddTask}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false); 
  const [snackbarMessage, setSnackbarMessage] = useState(''); 
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const [title, setTitle, onChangeHandlerTitle] = useOnChangeHandler<string>("");
  const [estimate, setEstimate, onChangeHandlerEstimate] = useOnChangeHandler<number>(1);
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [status, setStatus] = useState<Status>(Status.TODO);
  const [dateTime, setDateTime] = useState<Dayjs>(dayjs());
  
  const handleClickOpen = () => {
    setIsOpen(true);
  };
  
  const handleClose = () => {
    setIsOpen(false);
    setTitle('');
    setPriority(Priority.MEDIUM);
    setStatus(Status.TODO);
    setEstimate(0);
    setDateTime(dayjs());
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => { 
    setSnackbarMessage(message); 
    setSnackbarSeverity(severity); 
    setSnackbarOpen(true); 
  }; 

  const handleSnackbarClose = () => { 
    setSnackbarOpen(false); 
  };

  const handlePriority = (event: SelectChangeEvent) => {
    setPriority(event.target.value as Priority);
  }
  
  const handleStatus = (event: SelectChangeEvent) => {
    setStatus(event.target.value as Status);
  }

  const handleDateTime = (newDate: Dayjs | null) => {
    if(newDate){
      setDateTime(newDate);  
    }
  }

    return (
    <>
        <IconButton 
          onClick={handleClickOpen}
          sx={{p:0, color: '#0a7d64'}}
          >
          <AddCircleOutlineOutlinedIcon sx={{fontSize:{xs: '30px', md:'35px'}}} />
        </IconButton>
        <Snackbar 
          open={snackbarOpen} 
          autoHideDuration={2000} 
          onClose={handleSnackbarClose}
          > 
          <Alert 
            onClose={handleSnackbarClose} 
            severity={snackbarSeverity}
            variant="filled"
            >
              {snackbarMessage}
            </Alert>
         </Snackbar>
        <Dialog
            open={isOpen}
            onClose={handleClose}
            fullWidth 
            aria-hidden="true"
            PaperProps={{
              component: 'form',
              onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                if (estimate <= 0) {
                  showSnackbar('Estimate must be a positive number and grather than 0.', 'error');
                  return; 
                }
                const hash =  generateHashCode(5);
                const newTask: Task = {
                  id: Date.now(),
                  title,
                  priority,
                  dateTime,
                  estimate,
                  status,
                  hash
                }
                onAddTask(newTask);
                setTitle('');
                setPriority(Priority.MEDIUM);
                setStatus(Status.TODO);
                setEstimate(0);
                setDateTime(dayjs());
                handleClose();
                showSnackbar('Task added to to-do', 'success');

              },
            }}
          >
            <DialogContent>
              <TextField
                  autoFocus
                  type="text"
                  id="task"
                  label="Task"
                  required
                  value={title}
                  onChange={onChangeHandlerTitle}
                  fullWidth
                  sx={{mb: 2}}
                  
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                {/* <DemoContainer components={['DateTimePicker']}> */}
                  <DateTimePicker 
                    label="Choose time"
                    value={dayjs(dateTime)}
                    onChange={handleDateTime}
                    disablePast={true}
                    sx={{mb: 2, mr: 2}}
                    />
                {/* </DemoContainer> */}
              </LocalizationProvider>
              <TextField
                  autoFocus
                  type="number"
                  id="estimate"
                  label="Estimate"
                  value={estimate}
                  onChange={onChangeHandlerEstimate}
                  sx={{mr: 2,mb: 2}}
              />
              <FormControl  sx={{ mr:2, minWidth: 120 }}>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                labelId="status-label"
                id="status"
                value={status}
                label="Status"
                sx={{mb: 2}}
                onChange={handleStatus}
                >
                  <MenuItem value={Status.TODO}>{Status.TODO}</MenuItem>
                  <MenuItem value={Status.DOING}>{Status.DOING}</MenuItem>
                  <MenuItem value={Status.DONE}>{Status.DONE}</MenuItem>
                  <MenuItem value={Status.WARNING}>{Status.WARNING}</MenuItem>
                  <MenuItem value={Status.PENDING}>{Status.PENDING}</MenuItem>
                  <MenuItem value={Status.FAILED}>{Status.FAILED}</MenuItem>
                </Select>
              </FormControl>
              <FormControl  sx={{ mr: 2, minWidth: 120 }}>
                  <InputLabel id="priority-label">Priority</InputLabel>
                  <Select
                  labelId="priority-label"
                  id="priority"
                  value={priority}
                  label="Priority"
                  sx={{mb: 2}}
                  onChange={handlePriority}
                  >
                    <MenuItem value={Priority.LOW}>{Priority.LOW}</MenuItem>
                    <MenuItem value={Priority.MEDIUM}>{Priority.MEDIUM}</MenuItem>
                    <MenuItem value={Priority.HIGH}>{Priority.HIGH}</MenuItem>
                  </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit">Add Task</Button>
            </DialogActions>
        </Dialog>
    </>
  )
}

export default AddTask;