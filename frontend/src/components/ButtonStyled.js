import styled from 'styled-components';
import { Button } from '@mui/material';

export const BlueButton = styled(Button)`
  && {
    height: 50px;
    background-color: #002d75;
    color: #fff;
    font-size: 1rem;
    &:hover {
      background-color: rgb(255, 215, 0);
      border: 1px solid #fff;
      box-shadow: 0 0 10px #fff
    }
  }
`;

export const GoldButton = styled(Button)`
  && {
    height: 50px;
    background-color: rgb(255, 215, 0);
    color: #000;
    font-size: 1rem;
    &:hover {
      background-color: #002d75;
      border: 1px solid #fff;
      box-shadow: 0 0 10px #fff
    }
  }
`;

export const RedButton = styled(Button)`
  && {
    height: 50px;
    background-color: rgb(255, 0, 0);
    color: #fff;
    font-size: 1rem;
    &:hover {
      background-color: rgb(255, 215, 0);
      border: 1px solid #fff;
      box-shadow: 0 0 10px #fff
    }
  }
`;

export const BlackButton = styled(Button)`
  && {
    height: 50px;
    background-color: #000;
    color: #fff;
    font-size: 1rem;
    &:hover {
      background-color: rgb(255, 215, 0);
      border: 1px solid #fff;
      box-shadow: 0 0 10px #fff
    }
  }
`;