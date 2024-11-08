import { Status, Task } from "../Types/Task";

const statusColors: Record<Status, string> = { 
    [Status.TODO]: '#673ab7',
    [Status.DOING]: '#03a9f4',  
    [Status.DONE]: '#4caf50', 
    [Status.WARNING]: '#ffc107', 
    [Status.PENDING]: '#ff9800',  
    [Status.FAILED]: '#f44336',  
    };

const calculateStatusPercentages = (tasks: Task[]) => {
    const totalTasks = tasks.length;
    const statusCounts = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<Status, number>);
  
    const statusPercentages = Object.keys(statusCounts).map(status => ({
      name: status,
      y: (statusCounts[status as Status] / totalTasks) * 100,
      color: statusColors[status as Status],
    }));
  
    return statusPercentages;
  };

  export default calculateStatusPercentages;
  