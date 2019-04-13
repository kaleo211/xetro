import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blueGrey from '@material-ui/core/colors/blueGrey';
import red from '@material-ui/core/colors/red';

import App from './App'
import { store } from './store';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: blueGrey[600],
    },
    secondary: {
      main: red[600],
    },
    text: {
      white: blueGrey[900],
    },
  },
});

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('react')
)
