import React, { useState } from 'react';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const BMI: React.FC = (): JSX.Element => {
  const [weight, setWeight] = useState<number | number[]>(0);
  const [height, setHeight] = useState<number | number[]>(0);
  const [bmi, setBmi] = useState<string>('');

  const calcBmiResult = () => {
    const heightInMeters: number = (height as number) / 100;
    const squareHeight: number = heightInMeters * heightInMeters;
    const bmi: any = (weight as number) / squareHeight;
    if (weight === 0 || height === 0) {
      alert('Please fill in the details');
    } else {
      setBmi(bmi.toFixed(1).toString());
    }
  };
  return (
    <div style={{ width: '25%', margin: 'auto' }}>
      <div style={{ marginBottom: '50px' }}>
        <Typography align="center" variant="h6" gutterBottom>
          weight
        </Typography>
        <Typography align="center" variant="h6" gutterBottom>
          {weight ? weight : ''}
        </Typography>
      </div>
      <Slider
        defaultValue={80}
        aria-label="Default"
        valueLabelDisplay="auto"
        step={1}
        min={10}
        max={150}
        onChange={(
          event: Event,
          value: number | number[],
          activeThumb: number
        ) => setWeight(value)}
      />
      <div style={{ marginBottom: '50px' }}>
        <Typography align="center" variant="h6" gutterBottom>
          height
        </Typography>
        <Typography align="center" variant="h6" gutterBottom>
          {height ? height : ''}
        </Typography>
      </div>
      <Slider
        defaultValue={140}
        aria-label="Default"
        valueLabelDisplay="auto"
        step={1}
        min={40}
        max={240}
        onChange={(
          event: Event,
          value: number | number[],
          activeThumb: number
        ) => setHeight(value)}
      />
      <Button
        onClick={() => calcBmiResult()}
        type="button"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        BMI RESULTS
      </Button>
      {bmi !== '' && (
        <Box>
          <Typography align="center" variant="h6" gutterBottom>
            your bmi in percent is: {bmi}
          </Typography>
        </Box>
      )}
    </div>
  );
};

export default BMI;
