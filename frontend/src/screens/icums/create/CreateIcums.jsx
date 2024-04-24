import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BlueButton } from '../../../components/ButtonStyled';
import { Box, CircularProgress, Container, Grid, Typography, TextField, DialogActions, MenuItem, InputLabel, Select, FormControl } from '@mui/material';
import { setIcums } from '../../../state-management/icums/icumsSlice';

import classes from './create_icums.module.scss';

const CreateIcums = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [hs_code, setHs_code] = useState('');
  const [description, setDescription] = useState('');
  const [hs_head_code, setHs_head_code] = useState('');
  const [qty_unit_code, setQty_unit_code] = useState('');
  const [import_duty_rate, setImport_duty_rate] = useState('');
  const [import_duty_vat, setImport_duty_vat] = useState('');
  const [import_duty_excise, setImport_duty_excise] = useState('');
  const [export_duty_rate, setExport_duty_rate] = useState('');
  const [nhil_rate, setNhil_rate] = useState('');

  const icums = useSelector(state => state.icums.icums);
  const currentUser = useSelector(state => state.user.currentUser);
  const currentRole = useSelector(state => state.user.currentRole);
  const token = useSelector(state => state.user.token);
  const URL = import.meta.env.VITE_SERVER_URL;

  const fields = {
    hs_code,
    description,
    hs_head_code,
    qty_unit_code,
    import_duty_rate,
    import_duty_vat,
    import_duty_excise,
    export_duty_rate,
    nhil_rate
  };

  const handleCreateIcums = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${URL}/api/icums/create-icums`, fields, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Icums created successfully: ', response.data.data);
      
      const icumsData = response.data.data;

      dispatch(setIcums(icumsData));
      toast.success('ICUMS created successfully');
      navigate(`${currentRole.toLowerCase()}-dashboard/dashboard`);
    } catch (error) {
      console.log(error.response.message);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreateIcums();
  };

  return (
    <Container className={classes.container}>
      <Box className={classes.container_inner}>
        <Typography variant="h4" align="center" className={classes.title}>Create ICUMS</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="HS Code"
                variant="outlined"
                fullWidth
                value={hs_code}
                onChange={(e) => setHs_code(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="HS Head Code"
                variant="outlined"
                fullWidth
                value={hs_head_code}
                onChange={(e) => setHs_head_code(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Quantity Unit Code"
                variant="outlined"
                fullWidth
                value={qty_unit_code}
                onChange={(e) => setQty_unit_code(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Import Duty Rate"
                variant="outlined"
                fullWidth
                value={import_duty_rate}
                onChange={(e) => setImport_duty_rate(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Import Duty VAT"
                variant="outlined"
                fullWidth
                value={import_duty_vat}
                onChange={(e) => setImport_duty_vat(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Import Duty Excise"
                variant="outlined"
                fullWidth
                value={import_duty_excise}
                onChange={(e) => setImport_duty_excise(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Export Duty Rate"
                variant="outlined"
                fullWidth
                value={export_duty_rate}
                onChange={(e) => setExport_duty_rate(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="NHIL Rate"
                variant="outlined"
                fullWidth
                value={nhil_rate}
                onChange={(e) => setNhil_rate(e.target.value)}
              />
            </Grid>
          </Grid>
          <DialogActions>
            <BlueButton type="submit" disabled={loading}>
              {loading && <CircularProgress size={20} />}
              Create ICUMS
            </BlueButton>
          </DialogActions>
        </form>
      </Box>
    </Container>
  );
};

export default CreateIcums;