import { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import AccessAlarmOutlinedIcon from '@mui/icons-material/AccessAlarmOutlined';
import dayjs from 'dayjs';


type Props = {}

export default function CurrentTime({}: Props) {
  const [currentTime, setCurrentTime] = useState(dayjs);

  useEffect(() => {
    const timer = setInterval(() => { setCurrentTime(dayjs()); }, 1000);
    return () => clearInterval(timer);
  },[])

  return (
    <Box sx={{
      display:'flex',
      flexDirection:'row',
      alignItems: 'center',
      justifyContent: {xs: 'left', md: 'right'}
      }}>
      <AccessAlarmOutlinedIcon 
        sx={{mr: 1, fontSize:{xs: '30px', md:'35px', color: '#0a7d64'}}} 
      />
      <Typography sx={{color: '#0a7d64'}}>
        {
          currentTime.format('YYYY-MM-DD - HH:mm:ss')
        }
      </Typography>
    </Box>
  )
}