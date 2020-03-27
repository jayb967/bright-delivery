import React from 'react';

import { ThemeProvider } from '@material-ui/styles';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { SnackbarProvider } from 'notistack';

import logo from './logo.svg';
import FirebaseProvider from 'data/Firebase'
import theme from './theme';
import { Main, AuthGuard } from 'components'
// import './App.css';
import './data/Firebase'


function App() {
  return (

    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={4}>
        <MuiPickersUtilsProvider utils={MomentUtils}>

          <FirebaseProvider>
            {/* <ScrollReset /> */}
            {/* <GoogleAnalytics /> */}
            <AuthGuard>
              <Main />
            </AuthGuard>
          </FirebaseProvider>

        </MuiPickersUtilsProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
