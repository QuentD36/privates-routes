import * as React from 'react';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';



const theme = createTheme({
  spacing: 2
});

export default function Error404() {
  

  return (    
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        Erreur 404
      </Container>
    </ThemeProvider>
  );
}