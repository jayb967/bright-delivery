import { colors } from '@material-ui/core';

const white = '#FFFFFF';
const black = '#000000';

export default {
  black,
  white,
  primary: {
    contrastText: white,
    light: '#ff784e',
    main: '#ff5722',
    dark: '#b23c17'
  },
  secondary: {
    contrastText: white,
    light: '#33c9dc',
    main: '#00bcd4',
    dark: '#008394'
  },
  third: {
    contrastText: black,
    light: '#ebeceb',
    main: '#E6E8E6',
    dark: '#a1a2a1'
  },
  error: {
    contrastText: white,
    dark: colors.red[900],
    main: colors.red[600],
    light: colors.red[400]
  },
  text: {
    primary: colors.blueGrey[900],
    secondary: colors.blueGrey[600],
    link: colors.blue[600]
  },
  link: colors.blue[800],
  icon: colors.blueGrey[600],
  background: {
    default: '#F4F6F8',
    paper: white
  },
  divider: colors.grey[200]
};
