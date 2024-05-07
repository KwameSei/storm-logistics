import React, { useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, useTheme } from '@mui/material';
import { ResponsiveChoropleth } from '@nivo/geo';
import { GeoData } from '../../../components';
import { getUsers } from '../../../state-management/userState/userSlice';

import classes from './geography.module.scss';

const UserGeography = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const users = useSelector(state => state.user.users);
  const currentUser = useSelector(state => state.user.currentUser);
  const token = useSelector(state => state.user.token);
  console.log('Users: ', users);
  const URL = import.meta.env.VITE_SERVER_URL;

  // Get all users based on their geographical locations
  const fetchUserGeographicalLocations = async () => {
    try {
      const response = await axios.get(`${URL}/api/users/get-user-geographical-locations`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('User geographical locations: ', response.data.data);

      const geoData = response.data.data;

      if (geoData) {
        dispatch(getUsers(geoData));
      }
    } catch (error) {
      console.error('Error fetching user geographical locations: ', error);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchUserGeographicalLocations();
    }
  }, [ currentUser ]);

  return (
    <Box className={classes.geography_container}>
      <Typography variant="h4" sx={{ textAlign: 'center', marginBottom: '1rem' }}>User Geography</Typography>
      <Typography variant="body1" sx={{ textAlign: 'center', marginBottom: '1rem' }}>Geographical locations of all users</Typography>
      <Box className={classes.geography_main}>
        {users.length > 0 ? (
          <ResponsiveChoropleth
          data={users}
          theme={{
              background: theme.palette.mode === 'dark' ? '#222222' : '#ffffff',
              textColor: theme.palette.text.primary,
              fontSize: 11,
              tooltip: {
                  container: {
                      background: theme.palette.background.paper,
                      color: theme.palette.text.primary
                  }
              },
              axis: {
                  domain: {
                      line: {
                          stroke: theme.palette.primary[200]
                      }
                  },
                  ticks: {
                      line: {
                          stroke: theme.palette.primary[200],
                          strokeWidth: 1
                      },
                      text: {
                          fill: theme.palette.primary[200]
                      }
                  },
                  legends: {
                      text: {
                          fill: theme.palette.primary[200]
                      }
                    }

              }
          }}
          features={GeoData.features}
          margin={{ top: 0, right: 0, bottom: 0, left: 80 }}
          colors="nivo"
          domain={[ 0, 100000 ]}
          unknownColor="#666666"
          label="properties.name"
          valueFormat=".2s"
          projectionScale={180}
          projectionTranslation={[ 0.45, 0.6 ]}
          projectionRotation={[ 0, 0, 0 ]}
          // enableGraticule={true}
          // graticuleLineColor="#dddddd"
          borderWidth={1.3}
          borderColor="#ffffff"
          // defs={[
          //     {
          //         id: 'dots',
          //         type: 'patternDots',
          //         background: 'inherit',
          //         color: '#38bcb2',
          //         size: 4,
          //         padding: 1,
          //         stagger: true
          //     },
          //     {
          //         id: 'lines',
          //         type: 'patternLines',
          //         background: 'inherit',
          //         color: '#eed312',
          //         rotation: -45,
          //         lineWidth: 6,
          //         spacing: 10
          //     },
          //     {
          //         id: 'gradient',
          //         type: 'linearGradient',
          //         colors: [
          //             {
          //                 offset: 0,
          //                 color: '#000'
          //             },
          //             {
          //                 offset: 100,
          //                 color: 'inherit'
          //             }
          //         ]
          //     }
          // ]}
          // fill={[
          //     {
          //         match: {
          //             id: 'CAN'
          //         },
          //         id: 'dots'
          //     },
          //     {
          //         match: {
          //             id: 'CHN'
          //         },
          //         id: 'lines'
          //     },
          //     {
          //         match: {
          //             id: 'ATA'
          //         },
          //         id: 'gradient'
          //     }
          // ]}
          legends={[
              {
                  anchor: 'bottom-left',
                  direction: 'column',
                  justify: true,
                  translateX: 0,
                  translateY: -125,
                  itemsSpacing: 0,
                  itemWidth: 94,
                  itemHeight: 18,
                  itemDirection: 'left-to-right',
                  itemTextColor: '#ffffff',
                  itemOpacity: 1,
                  symbolSize: 18,
                  effects: [
                      {
                          on: 'hover',
                          style: {
                              itemTextColor: '#000000',
                              itemOpacity: 1
                          }
                      }
                  ]
              }
          ]}
      />
        ) : <Typography>No users found</Typography>}
      </Box>
    </Box>
  )
};

export default UserGeography;