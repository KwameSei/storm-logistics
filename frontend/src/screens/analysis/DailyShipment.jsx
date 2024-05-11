import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Box,Typography,useTheme } from '@mui/material';
// import ReactDatePicker from 'react-datepicker';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ResponsiveLine } from '@nivo/line';
import { getShipments } from '../../state-management/shipmentState/shipmentSlice';

import classes from './analysis.module.scss';

const DailyShipment = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [isTotalShipmentVisible, setIsTotalShipmentVisible] = useState(true);
const [isTotalUnitsVisible, setIsTotalUnitsVisible] = useState(true);
const [startDate, setStartDate] = useState(new Date());
const [endDate, setEndDate] = useState(new Date());

const shipments = useSelector(state => state.shipment.shipments);
console.log('Shipments data: ', shipments);
const token = useSelector((state) => state.user.token);
const currentUser = useSelector((state) => state.user.currentUser);
// const username = currentUser?.data?.name;
const URL = import.meta.env.VITE_SERVER_URL;

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
const [formattedData] = useMemo(() => {
  const daily_shipments = shipments?.data || shipments;

  const totalShipmentLine = {
    id: 'total-shipment',
    color: 'hsl(0, 70%, 50%)',
    data: [],
  };

  const totalUnitsLine = {
    id: 'total-units',
    color: 'hsl(120, 70%, 50%)',
    data: [],
  };

  // Create a map to accumulate values for each day
  const dailyAccumulator = {};

  daily_shipments.forEach(({ stats }) => {
    stats.forEach(({ daily_data }) => {
      daily_data.forEach(({ date, daily_sales_total, daily_total_sold_units }) => {
        const dateFormatted = new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
        console.log('Date formatted:', dateFormatted);

        // Convert startDate and endDate to milliseconds since the epoch
        const startDateEpoch = startDate.getTime();
        const endDateEpoch = endDate.getTime();
        const dateEpoch = new Date(date).getTime();

        console.log('startDateEpoch:', startDateEpoch);
        console.log('endDateEpoch:', endDateEpoch);
        console.log('dateEpoch:', dateEpoch);

        // Check if the date is within the specified range
        if (dateEpoch >= startDateEpoch && dateEpoch <= endDateEpoch) {
          const splitDate = date.substring(date.indexOf('-') + 1); // Get the month and day

          // Push data to totalShipmentLine and totalUnitsLine arrays
          totalShipmentLine.data.push({ x: splitDate, y: daily_sales_total });
          totalUnitsLine.data.push({ x: splitDate, y: daily_total_sold_units });

          // Initialize accumulator for the date if not already present
          if (!dailyAccumulator[date]) {
            dailyAccumulator[date] = {
              sales: 0,
              units: 0,
            };
          }

          // Accumulate sales and units for each day
          dailyAccumulator[date].sales += daily_sales_total;
          dailyAccumulator[date].units += daily_total_sold_units;
        }
      });
    });
  });

  // Push accumulated values into the data array
  Object.entries(dailyAccumulator).forEach(([date, { sales, units }]) => {
    totalShipmentLine.data.push({ x: date, y: sales });
    totalUnitsLine.data.push({ x: date, y: units });
  });

  console.log('Transformed shipments for total shipment line:', totalShipmentLine);
  console.log('Transformed shipments for total units line:', totalUnitsLine);
  const formattedData = [totalShipmentLine, totalUnitsLine];
  return [formattedData];
}, [shipments, startDate, endDate]); // eslint-disable-line react-hooks/exhaustive-deps

console.log('Data passed to ResponsiveLine:', formattedData);
  
  return (
    <div style={{ width: '90%', height: '400px', margin: '20px auto', marginBottom: '5rem', marginTop: '15rem' }} className={classes.chart_main }>
      <Typography variant="h5" style={{ textAlign: 'center', marginBottom: '20px' }}>Daily Shipment Analysis</Typography>
      <Typography variant="h6" style={{ textAlign: 'center', marginBottom: '20px' }}>Select Date Range to view shipments within a day</Typography>
      <Box style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
        />
      </Box>
      {/* <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}> */}
        {/* <button
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
      </div> */}
      <ResponsiveLine
        data={formattedData}
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
          legend: 'Total Shipment',
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
            anchor: 'top-right',
            direction: 'column',
            justify: false,
            translateX: 50,
            translateY: 0,
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
        // path={view === 'total-shipment' ? 'monotoneX' : 'linear'}
        path={'monotoneX'}
      />
    </div>
  )
}

export default DailyShipment;