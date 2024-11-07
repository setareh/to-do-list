import Highcharts from 'highcharts'
import HighchartsReact from "highcharts-react-official";

type Props = {}

const options: Highcharts.Options = { 
    chart: { 
      type: 'pie', 
      height: '50%' }, 
      title: { 
        text: 'Status', 
        align: 'center', 
        verticalAlign: 'middle', 
        y: 100, 
        }, 
    plotOptions: { 
      pie: { 
        dataLabels: {
          enabled: true,
                  distance: -50,
                  style: {
                      fontWeight: 'bold',
                      color: 'white'
                  }
        },
        startAngle: -90, 
        endAngle: 90, 
        center: ['50%', '75%'], 
        size: '110%' } }, 
        series: [{ 
          type: 'pie', 
          innerSize: '50%',
          data: [ 
            { name: 'Todo', 
              y: 30 }, 
            { name: 'Doing', 
              y: 20 },
            { name: 'Done', 
              y: 10 },
            { name: 'Warning', 
              y: 10 },
            { name: 'Pending', 
              y: 20 },
            { name: 'Failed', 
              y: 10 },
          ] 
        }] 
      };

export default function SemiCirclePieChart({}: Props) {
  return (
    <HighchartsReact highcharts={Highcharts} options={options} />
)
}