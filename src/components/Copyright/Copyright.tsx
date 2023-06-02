import React from 'react';
import Typography from '@mui/material/Typography';

import Link from '@mui/material/Link';

const Copyright: React.FC = (): JSX.Element => {
  const year: number = new Date().getFullYear();
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      sx={{ mt: 8, mb: 4 }}
    >
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {year}
      {'.'}
    </Typography>
  );
};

export default Copyright;
