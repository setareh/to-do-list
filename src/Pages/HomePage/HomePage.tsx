import { Box, Container, Grid2, Typography } from "@mui/material";
import DataTable from "../../Component/DataTable/DataTable";
import SemiCirclePieChart from "../../Component/Charts/SemiCirclePieChart";
import AddTask from "../../Component/AddTask/AddTask";
import { useState, useEffect } from "react";
import { Task } from "../../Types/Task";
import dayjs, { Dayjs } from "dayjs";
import CurrentTime from "../../Component/CurrentTime/CurrentTime";

type Props = {}    

export default function HomePage({}: Props) {  
  const [tasks, setTasks] = useState<Task[]>([]);

  const formatDateForStorage = (date: Dayjs): string => { 
    return date.format('YYYY-MM-DD HH:mm:ss'); 
  };

  useEffect(() => {
    const storeTasks = localStorage.getItem('tasks');
    if(storeTasks) {
      const parseTasks: Task[] = JSON.parse(storeTasks).map((task:any) => ({
        ...task,
        dateTime: formatDateForStorage(dayjs(task.dateTime))
      }))
      setTasks(parseTasks);
    }
  },[])

  const  addTask = (task: Task) => {   
    const newTask = [...tasks, task];
    setTasks(newTask);    
    localStorage.setItem('tasks', JSON.stringify(newTask));
  }

  return (
    <Container>
      <Box sx={{my: 2}}>
        <Grid2 container spacing={{ xs: 2 }} columns={{ xs: 12}}>
          <Grid2 size={{ xs: 12, md: 6 }} >
            <Typography variant="h1" fontSize={'26px'}>
              To-do List
            </Typography>
          </Grid2>
        </Grid2>
      </Box>
      <Box sx={{my: 2}}>
        <Grid2 container spacing={{ xs: 2, }} columns={{ xs: 12}} sx={{alignItems: 'center'}}>
          <Grid2 size={{ xs: 12, md: 6 }} >
            <AddTask onAddTask={addTask} />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6}} >
            <CurrentTime />
          </Grid2>
      </Grid2>
    </Box>
    <Box sx={{my: 2}}>
      <Grid2 container spacing={{ xs: 2, md: 3 }} columns={{ xs: 1, sm: 8 }} >
        <Grid2 size={{ xs: 12}} >
          <SemiCirclePieChart  tasks={tasks} />
        </Grid2>
      </Grid2>
    </Box>
    <Box sx={{my: 2}}>
      <Grid2 container spacing={{ xs: 2, md: 3 }} columns={{ xs: 1, sm: 8 }} >
        <Grid2 size={{ xs: 12}} >
          <DataTable tasks={tasks} setTasks={setTasks} />
        </Grid2>
      </Grid2>
    </Box>
  </Container>
  )
}