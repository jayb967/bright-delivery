import React from 'react';
import { TextField } from '@material-ui/core';

const ContactInfo = (props) => {
    // Dont return anything if there is not data or function to update
    const {data, updateDic} = props
    if(!data || !updateDic) return null;

    const handleChange = (event) => {
        const value = event.target.value;
        const field = event.target.id

        updateDic && updateDic({[field]: value || ''})
    }
    return (
        <React.Fragment>
            <TextField
                autoFocus
                margin="dense"
                id="address"
                label="Address"
                type="text"
                onChange={handleChange}
                placeholder='1234 Street'
                value={data.address || ''}
                fullWidth
            />
            <TextField
                margin="dense"
                id="address2"
                label="Apt/Suite Number (Optional)"
                type="text"
                onChange={handleChange}
                value={data.address2 || ''}
                fullWidth
            />
            <TextField
                margin="dense"
                id="city"
                label="City"
                type="text"
                onChange={handleChange}
                value={data.city || ''}
                fullWidth
            />
            <TextField
                margin="dense"
                id="state"
                label="State"
                type="text"
                onChange={handleChange}
                value={data.state || ''}
                fullWidth
            />
            <TextField
                margin="dense"
                id="zip"
                label="Postal Code"
                type="text"
                onChange={handleChange}
                value={data.zip || ''}
                fullWidth
            />
            <TextField
                margin="dense"
                id="deliveryMsg"
                label={'Message to delivery driver (Optional)'}
                type="text"
                onChange={handleChange}
                value={data.deliveryMsg || ''}
                fullWidth
            />
            <br />
            <TextField
                margin="dense"
                id="name"
                // error={name_first.length < 2}
                // helperText={name_first.length < 2 && 'Not a valid name!'}
                label="First Name"
                type="text"
                onChange={handleChange}
                value={data.name || ''}
                fullWidth
            />
            <TextField
                margin="dense"
                id="lastname"
                // error={name_last.length < 3}
                // helperText={name_last.length < 3 && 'Not a valid last name!'}
                label="Last Name"
                type="text"
                onChange={handleChange}
                value={data.lastname || ''}
                fullWidth
            />
        </React.Fragment>
    )
}

export default ContactInfo;