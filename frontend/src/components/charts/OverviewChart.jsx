import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useTheme } from '@mui/material';
import { ResponsiveLine } from '@nivo/line';
import { getShipments } from '../../state-management/shipmentState/shipmentSlice';

const OverviewChart = ({ isDashboard = false, view, shipments }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  // const shipments = useSelector(state => state.shipment.shipments);
  // console.log('Shipments data: ', shipments);
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
    // console.log('View:', view);
    // console.log('useEffect Shipments:', shipments);
    fetchShipments();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [totalShipmentLine, totalUnitsLine] = useMemo(() => {
    // if (!shipments || !shipments.data) return [];
  
    const overview_shipments = shipments?.data || shipments;
    console.log('Overview shipments: ', overview_shipments);
  
    const totalShipmentLine = {
      id: 'total-shipment',
      color: 'hsl(0, 70%, 50%)',  // Red
      data: [],
    };
    const totalUnitsLine = {
      id: 'total-units',
      color: 'hsl(120, 70%, 50%)',  // Green
      data: [],
    };
  
    overview_shipments.forEach((shipment) => {
      const stats = shipment.stats;
      console.log('Shipment stats: ', stats);
      if (!stats || !stats.length) return;
  
      const monthlyData = stats[0].monthly_data;  // Get the first year data
      console.log('Monthly data: ', monthlyData);
      if (!monthlyData || !monthlyData.length) return;
  
      monthlyData.forEach(({ month, monthly_sales_total, monthly_total_sold_units }) => {
        const existingPointShipment = totalShipmentLine.data.find((point) => point.x === month);
        if (existingPointShipment) {
          existingPointShipment.y += monthly_sales_total;
        } else {
          totalShipmentLine.data.push({ x: month, y: monthly_sales_total });
        }
        
        const existingPointUnits = totalUnitsLine.data.find((point) => point.x === month);
        if (existingPointUnits) {
          existingPointUnits.y += monthly_total_sold_units;
        } else {
          totalUnitsLine.data.push({ x: month, y: monthly_total_sold_units });
        }
      });
    });
  
    return [totalShipmentLine, totalUnitsLine];
  }, [shipments]); // eslint-disable-line react-hooks/exhaustive-deps
  
  return (
    <div>
      <ResponsiveLine
        // data={[totalShipmentLine, totalUnitsLine]}
        data={view === 'total-shipment' ? [totalShipmentLine] : [totalUnitsLine]}
        margin={{ top: 20, right: 50, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
        yFormat=" >-.2f"
        curve="catmullRom"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          format: (value) => {
            // if (value === 'Jan') return 'January';
            if (isDashboard) return value.slice(0, 3);
            return value;
          },
          orient: 'bottom',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          // legend: 'Month',
          legend: isDashboard ? '' : 'Month',
          legendOffset: 36,
          legendPosition: 'middle',
        }}
        axisLeft={{
          orient: 'left',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          // legend: 'Total',
          legend: isDashboard ? '' : `Total ${view === 'total-shipment' ? 'Shipment' : 'Units'} for Year`,
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
        legends={
          !isDashboard ? [
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
        ] : undefined
      }
      />
    </div>
  )
}

export default OverviewChart;