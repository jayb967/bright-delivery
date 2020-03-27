import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  Modal,
  Backdrop,
  TextField,
  Typography
} from '@material-ui/core';

import { OptionsCheck } from 'components'
import { AuthContext } from 'context'
import { capitalize } from 'helpers'

const useStyles = makeStyles(theme => ({
  root: {
    width: '90%',
    // height: 300,
    margin: '5%',
    borderRadius: 8,
  },
  action: {
    // height: 300
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function Item(props) {
  const classes = useStyles();
  const { data, app } = props
  const user = useContext(AuthContext)
  const [open, setOpen] = useState(false);
  const [orderItem, setOrderItem] = useState()
  const [options, setOptions] = useState([])

  // app.auth().signInAnonymously()
  // .then(()=> console.log('Signed in anonymous'))
  // .catch((error) => {
  //   // Handle Errors here.
  //   var errorCode = error.code;
  //   var errorMessage = error.message;
  //   console.log('There was an  error signing in the user', errorCode, errorMessage)
  //   // ...
  // });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const addToCart = () => {

  }

  const handleOption = (option) => {
    let arr = [...options]
    if (option.add) {
      delete option.add
      arr.push(option)
      setOptions(arr)
    } else {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].name == option.name) {
          arr.splice(i, 1);
          break;
        }
      }
      setOptions(arr)
    }
  }

  return (
    <Card className={classes.root} elevation={1}>
      <CardActionArea className={classes.action} onClick={() => handleOpen()}>
        <CardMedia
          component="img"
          alt={data.name}
          height="140"
          image={data.image}// "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"
          title={data.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {data.name ? capitalize(data.name) : 'The Name of item'}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {data.description || 'This plate is soo good, it is different than the picture but you get the point.'}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="large" color="secondary" onClick={() => handleOpen()}>
          Add to order ${(data && data.price) ? parseFloat(data.price).toFixed(2) : ''}
        </Button>
      </CardActions>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{data.name ? capitalize(data.name) : ''}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {data.description}
          </DialogContentText>
          <br />
          <DialogContentText>
            Do you want to add or remove anything to your order?
          </DialogContentText>
          <OptionsCheck handleOption={handleOption} currOptions={options} {...props} />
          {/* <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
          /> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Add to Order
          </Button>
        </DialogActions>
      </Dialog>

    </Card>
  );
}