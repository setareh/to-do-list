import { Box, Container, Grid2, Typography } from "@mui/material";
import AccessAlarmOutlinedIcon from '@mui/icons-material/AccessAlarmOutlined';
import DataTable from "../../Component/DataTable/DataTable";
import SemiCirclePieChart from "../../Component/Charts/SemiCirclePieChart";
import { AddCircleOutlineOutlined } from "@mui/icons-material";

type Props = {}    

export default function HomePage({}: Props) {  

  return (
    <Container>
      <Box sx={{my: 2}}>
        <Grid2 container spacing={{ xs: 2 }} columns={{ xs: 12}}>
          <Grid2 size={{ xs: 1, md: 6 }} >
            <Typography variant="h1" fontSize={'26px'}>
              To-do List
            </Typography>
          </Grid2>
        </Grid2>
      </Box>
    <Box sx={{my: 2}}>
      <Grid2 container spacing={{ xs: 2 }} columns={{ xs: 12}}>
        <Grid2 size={{ xs: 1, md: 6 }} >
          <AddCircleOutlineOutlined />
        </Grid2>
        <Grid2 size={{ xs: 1, md: 6}} >
          <Box sx={{
            display:'flex',
            flexDirection:'row'
            }}>
            <AccessAlarmOutlinedIcon sx={{mr: 1}} />
            <Typography>
              2024/05/02 - 11:30:12
            </Typography>
          </Box>
        </Grid2>
    </Grid2>
  </Box>
  <Box sx={{my: 2}}>
    <Grid2 container spacing={{ xs: 2, md: 3 }} columns={{ xs: 1, sm: 8 }} >
      <Grid2 size={{ xs: 12}} >
        <SemiCirclePieChart />
      </Grid2>
    </Grid2>
  </Box>
  <Box sx={{my: 2}}>
    <Grid2 container spacing={{ xs: 2, md: 3 }} columns={{ xs: 1, sm: 8 }} >
      <Grid2 size={{ xs: 12}} >
        <DataTable />
      </Grid2>
    </Grid2>
  </Box>
  </Container>
  )
}