import Highcharts from 'highcharts'
import HighchartsReact from "highcharts-react-official";
import calculateStatusPercentages from '../../utils/calculateStatusPercentages'
import { Task } from '../../Types/Task';
import dayjs from 'dayjs';


const SemiCirclePieChart: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
  const data = calculateStatusPercentages(tasks);
  const currentDate = dayjs().format('DD MMM YYYY');

  const options: Highcharts.Options = { 
    chart: { 
      type: 'pie', 
      height: '50%' }, 
      title: { 
        text: `Status <br> ${currentDate}`, 
        align: 'center', 
        verticalAlign: 'middle', 
        y: 0, 
        }, 
    plotOptions: { 
      pie: { 
      dataLabels: {
        enabled: true,
        distance: -70,
        style: {
            fontWeight: 'bold',
            color: 'white'
        }
      },
        startAngle: -90, 
        endAngle: 90, 
        center: ['50%', '55%'], 
        size: '110%' 
      } 
    }, 
        series: [{ 
          type: 'pie', 
          innerSize: '50%',
          data: data,
        }] ,
        responsive: { 
          rules: [ { 
            condition: { 
              maxWidth: 320, 
            }, 
            chartOptions: { 
              plotOptions: { 
                pie: { 
                  size: '330%', 
                  center: ['50%', '150%'], 
                  dataLabels: { 
                    distance: -30, 
                  }, 
                }, 
              }, 
              title: { 
                style: { 
                  fontSize: '12px', 
                }, 
                y: 60, 
              }, 
            }, 
          },
          { 
            condition: { 
              minWidth: 368,
              maxWidth: 600, 
            }, 
            chartOptions: { 
              plotOptions: { 
                pie: { 
                  size: '200%', 
                  center: ['50%', '90%'], 
                  dataLabels: { 
                    distance: -30, 
                  }, 
                }, 
              }, 
              title: { 
                style: { 
                  fontSize: '12px', 
                }, 
                y: 40, 
              }, 
            }, 
            }, 
          ], 
        },
      };

  return (
    <HighchartsReact highcharts={Highcharts} options={options} />
  )
}

export default SemiCirclePieChart;