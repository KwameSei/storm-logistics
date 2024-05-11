import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useTheme } from '@mui/material';
import { ResponsiveLine } from '@nivo/line';
import { getShipments } from '../../state-management/shipmentState/shipmentSlice';

const OverviewChart = ({ view, shipments }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [isTotalShipmentVisible, setIsTotalShipmentVisible] = useState(true);
  const [isTotalUnitsVisible, setIsTotalUnitsVisible] = useState(true);

  // const shipments = useSelector(state => state.shipment.shipments);
  console.log('Shipments data: ', shipments);
  const token = useSelector((state) => state.user.token);
  const currentUser = useSelector((state) => state.user.currentUser);
  // const username = currentUser?.data?.name;
  const URL = import.meta.env.VITE_SERVER_URL;
  console.log('Shipments in OverviewChart:', shipments);

  if (!shipments) {
    return <div>Loading...</div>;
  }

  // Fetch shipments
  const fetchShipments = async () => {
    try {
      const response = await axios.get(`${URL}/api/shipment/get-all-shipments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const shipmentData = response.data.data;
      console.log('Overview shipment data: ', shipmentData);
      if (shipmentData) {
        dispatch(getShipments(shipmentData));
      }
    } catch (error) {
      console.error('Error in OverviewChart:', error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Toggle visibility of total shipment line
  const toggleTotalShipmentVisibility = () => {
    setIsTotalShipmentVisible((prev) => !prev);
  };

  // Toggle visibility of total units line
  const toggleTotalUnitsVisibility = () => {
    setIsTotalUnitsVisible((prev) => !prev);
  };

  // Transform shipments data for chart
  const [totalShipmentLine, totalUnitsLine] = useMemo(() => {
    const overview_shipments = shipments?.data || shipments;
  
    const totalShipmentLine = {
      id: 'total-shipment',
      color: 'hsl(0, 70%, 50%)',
      data: [],  
    };
    
    const totalUnitsLine = {
      id: 'total-units',
      color: 'hsl(120, 70%, 50%)',
      data: []
    };    
  
    // Create a map to accumulate values for each month
    const monthlyAccumulator = {};
  
    overview_shipments.forEach(({ stats }) => {
      stats.forEach(({ monthly_data }) => {
        monthly_data.forEach(({ month, monthly_sales_total, monthly_total_sold_units }) => {
          if (!monthlyAccumulator[month]) {
            monthlyAccumulator[month] = {
              sales: 0,
              units: 0
            };
          }
  
          // Accumulate sales and units for each month
          monthlyAccumulator[month].sales += monthly_sales_total;
          monthlyAccumulator[month].units += monthly_total_sold_units;
        });
      });
    });
  
    // Push accumulated values into the data array
    Object.entries(monthlyAccumulator).forEach(([month, { sales, units }]) => {
      totalShipmentLine.data.push({ x: month, y: sales });
      totalUnitsLine.data.push({ x: month, y: units });
    });
  
    console.log('Transformed shipments for total shipment line:', totalShipmentLine);
    console.log('Transformed shipments for total units line:', totalUnitsLine);
  
    return [totalShipmentLine, totalUnitsLine];
  }, [shipments]);  // eslint-disable-line react-hooks/exhaustive-deps

  // const [totalShipmentLine, totalUnitsLine] = useMemo(() => {
  //   // if (!shipments || !shipments.data) return [];
  
  //   const overview_shipments = shipments?.data || shipments;
  //   console.log('Overview shipments: ', overview_shipments);
  
  //   const totalShipmentLine = {
  //     id: 'total-shipment',
  //     color: 'hsl(0, 70%, 50%)',
  //     data: []
  //   };
    
  //   const totalUnitsLine = {
  //     id: 'total-units',
  //     color: 'hsl(120, 70%, 50%)',
  //     data: []
  //   };    

  //   Object.values(overview_shipments).reduce(
  //     (acc, { month, monthly_sales_total, monthly_total_sold_units }) => {
  //       const curSales = acc.sales + monthly_sales_total;
  //       const curUnits = acc.units + monthly_total_sold_units;

  //       totalShipmentLine.shipments = [
  //         ...totalShipmentLine.data,  // Spread the existing data
  //         { x: month, y: curSales }
  //       ];
  //       totalUnitsLine.data = [
  //         ...totalUnitsLine.data,  // Spread the existing data
  //         { x: month, y: curUnits }
  //       ];

  //       return { sales: curSales, units: curUnits };
  //     },
  //     { sales: 0, units: 0 }
  //   )
  
  //   // overview_shipments.forEach((shipment) => {
  //   //   const stats = shipment.stats;
  //   //   console.log('Shipment stats: ', stats);
  //   //   if (!stats || !stats.length) return;
  
  //   //   const monthlyData = stats[0].monthly_data;  // Get the first year data
  //   //   console.log('Monthly data: ', monthlyData);
  //   //   if (!monthlyData || !monthlyData.length) return;
  
  //   //   monthlyData.forEach(({ month, monthly_sales_total, monthly_total_sold_units }) => {
  //   //     const existingPointShipment = totalShipmentLine.data.find((point) => point.x === month);
  //   //     if (existingPointShipment) {
  //   //       existingPointShipment.y += monthly_sales_total;
  //   //     } else {
  //   //       totalShipmentLine.data.push({ x: month, y: monthly_sales_total });
  //   //     }
        
  //   //     const existingPointUnits = totalUnitsLine.data.find((point) => point.x === month);
  //   //     if (existingPointUnits) {
  //   //       existingPointUnits.y += monthly_total_sold_units;
  //   //     } else {
  //   //       totalUnitsLine.data.push({ x: month, y: monthly_total_sold_units });
  //   //     }
  //   //   });
  //   // });

  //   console.log('Transformed shipments for total shipment line:', totalShipmentLine);
  //   console.log('Transformed shipments for total units line:', totalUnitsLine);
  
  //   return [totalShipmentLine, totalUnitsLine];
  // }, [shipments]); // eslint-disable-line react-hooks/exhaustive-deps

  console.log('Data passed to ResponsiveLine:', [totalShipmentLine, totalUnitsLine]);
  
  return (
    <div style={{ width: '90%', height: '400px', margin: '20px auto', marginBottom: '5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <button
          style={{
            backgroundColor: isTotalShipmentVisible ? theme.palette.primary.main : theme.palette.secondary.main,
            color: 'white',
            padding: '10px',
            margin: '5px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
          onClick={toggleTotalShipmentVisibility}
        > Total Shipment </button>
        <button
          style={{
            backgroundColor: isTotalUnitsVisible ? theme.palette.primary.main : theme.palette.secondary.main,
            color: 'white',
            padding: '10px',
            margin: '5px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
          onClick={toggleTotalUnitsVisibility}
        > Total Units </button>
      </div>
      <ResponsiveLine
        data={[
          isTotalShipmentVisible ? totalShipmentLine : null,
          isTotalUnitsVisible ? totalUnitsLine : null,
        ].filter(Boolean)}
        margin={{ top: 20, right: 50, bottom: 50, left: 80 }}
        xScale={{ type: 'point', min: 'auto', max: 'auto', stacked: false, reverse: false}}
        yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
        yFormat=" >-.2f"
        curve="catmullRom"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          format: (value) => value.toString().substring(0, 3),  // Format the month (e.g. Jan, Feb, Mar, ...
          orient: 'bottom',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Month',
          legendOffset: 36,
          legendPosition: 'middle',
        }}
        axisLeft={{
          orient: 'left',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: `Total ${view === 'total-shipment' ? 'Shipment' : 'Units'} for Year`,
          legendOffset: -60,
          legendPosition: 'middle',
        }}
        colors={{ scheme: 'nivo' }}
        pointSize={10}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        useMesh={true}
        legends={[
          {
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 30,
            translateY: -40,
            itemsSpacing: 0,
            itemDirection: 'left-to-right',
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: 'circle',
            symbolBorderColor: 'rgba(0, 0, 0, .5)',
            effects: [
              {
                on: 'hover',
                style: {
                  itemBackground: 'rgba(0, 0, 0, .03)',
                  itemOpacity: 1,
                },
              },
            ],
          }
        ]}
        enablePoints={true}
        enableSlices={'x'}
        enableCrosshair={true}
        enableGridX={true}
        enableGridY={true}
        enableArea={true}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
        lineWidth={3}
        path={view === 'total-shipment' ? 'monotoneX' : 'linear'}
      />
    </div>
  )
}

export default OverviewChart;