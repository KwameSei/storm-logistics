import React, { useState, useEffect } from 'react';
import { Country, State, City } from 'country-state-city';
import { Container, Grid, Typography, Select, MenuItem } from '@mui/material';
import { toast } from 'react-toastify';

const CountryDropdown = ({ onChange }) => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const countryData = Country.getAllCountries().map((country) => ({
          isoCode: country.isoCode,
          name: country.name
        }));
        setCountries(countryData);
        setSelectedCountry(countryData[0]?.isoCode); // Select the first country by default
      } catch (error) {
        console.error('Error fetching countries:', error);
        toast.error('Failed to fetch countries');
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      const stateData = State.getStatesOfCountry(selectedCountry).map((state) => ({
        isoCode: state.isoCode,
        name: state.name
      }));
      setStates(stateData);
      setSelectedState(stateData[0]?.isoCode); // Select the first state by default
    }
  }, [selectedCountry]);

  // useEffect(() => {
  //   if (selectedState) {
  //     const cityData = City.getCitiesOfState(selectedCountry, selectedState).map((city) => ({
  //       name: city.name
  //     }));
  //     setCities(cityData);
  //     setSelectedCity(cityData[0]?.name); // Select the first city by default
  //   }
  // }, [selectedState]);

  const handleCountryChange = (countryIsoCode) => {
    setSelectedCountry(countryIsoCode);
  };

  const handleStateChange = (stateIsoCode) => {
    setSelectedState(stateIsoCode);
  };

  // const handleCityChange = (cityName) => {
  //   setSelectedCity(cityName);
  // };

  useEffect(() => {
    if (onChange) {
      onChange({
        country: selectedCountry,
        state: selectedState,
        // city: selectedCity
      });
    }
  }, [selectedCountry, selectedState, onChange]);

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Typography variant='subtitle1'>Country</Typography>
          <Select value={selectedCountry} onChange={(e) => handleCountryChange(e.target.value)}>
            {countries.map((country) => (
              <MenuItem key={country.isoCode} value={country.isoCode}>{country.name}</MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={4}>
          <Typography variant='subtitle1'>State</Typography>
          <Select value={selectedState} onChange={(e) => handleStateChange(e.target.value)}>
            {states.map((state) => (
              <MenuItem key={state.isoCode} value={state.isoCode}>{state.name}</MenuItem>
            ))}
          </Select>
        </Grid>
        {/* <Grid item xs={4}>
          <Typography variant='subtitle1'>City</Typography>
          <Select value={selectedCity} onChange={(e) => handleCityChange(e.target.value)}>
            {cities.map((city, index) => (
              <MenuItem key={index} value={city.name}>{city.name}</MenuItem>
            ))}
          </Select>
        </Grid> */}
      </Grid>
    </Container>
  );
};

export default CountryDropdown;
