import { ResponsiveBar } from '@nivo/bar';
import style from "./DataAnalysis.module.css";

function Data1(props) {
  const {data1} = props;

  return (
    <>
      <div className={style.DataAnalysis_col_header}>최근 3달 진료수</div>
      <div className={style.DataAnalysis_col_content}>
        <ResponsiveBar
          data={data1}
          keys={['진료수']}
          indexBy="month"
          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
          padding={0.3}
          groupMode="grouped"
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          colors={{ scheme: 'accent' }}
          fill={[
            {
              match: {
                id: 'treatments'
              }
            }
          ]}
          borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          axisTop={null}
          axisRight={null}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: '진료수',
            legendPosition: 'middle',
            legendOffset: -40
          }}
          animate={true}
          motionStiffness={90}
          motionDamping={15}
        />
      </div>
    </>
  )
}

export default Data1;