import React from 'react';

import { ThemeProvider } from '@material-ui/styles';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { SnackbarProvider } from 'notistack';

import logo from './logo.svg';
import FirebaseProvider from 'data/Firebase'
import theme from './theme';
import { Main, AuthGuard, Cart } from 'components'
import { OrgContext } from 'context'
// import './App.css';
import './data/Firebase'
import 'react-square-payment-form/lib/default.css'


function App() {
  return (

    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={4}>
        <MuiPickersUtilsProvider utils={MomentUtils}>

          <FirebaseProvider>
            {/* <ScrollReset /> */}
            {/* <GoogleAnalytics /> */}
            {/* This should be pulled from the init method in the embed */}
            <OrgContext.Provider value={window.orgBrightdel || 'panaderia-mexico'}>
              <AuthGuard>
                <Cart>
                    <Main />
                    
                </Cart>
              </AuthGuard>
            </OrgContext.Provider>
          </FirebaseProvider>

        </MuiPickersUtilsProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
