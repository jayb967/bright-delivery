import React from 'react';
import { TextField } from '@material-ui/core';

const ContactInfo = (props) => {
    // Dont return anything if there is not data or function to update
    const { data, updateDic, type} = props
    if (!data || !updateDic) return null;

    const handleChange = (event) => {
        const value = event.target.value;
        const field = event.target.id

        updateDic && updateDic({ [field]: value || '' })
    }
    return (
        <React.Fragment>
            <TextField
                margin="dense"
                id="name"
                // error={name_first.length < 2}
                // helperText={name_first.length < 2 && 'Not a valid name!'}
                error={!data.name || data.name && data.name.length < 2}
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
                error={!data.lastname || data.lastname && data.lastname.length < 2}
                type="text"
                onChange={handleChange}
                value={data.lastname || ''}
                fullWidth
            />
            <TextField
                margin="dense"
                id="deliveryMsg"
                label={type !== 'delivery' ? 'Order notes' :'Message to delivery driver & Order Notes (Optional)'}
                type="text"
                onChange={handleChange}
                value={data.deliveryMsg || ''}
                fullWidth
            />
            <br />
            <br />
            {type === 'delivery' && <React.Fragment>
                <TextField
                    autoFocus
                    margin="dense"
                    id="address"
                    label="Address"
                    type="text"
                    error={!data.address || data.address && data.address.length < 4}
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
                    error={!data.city || data.city && data.city.length < 3}
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
                    error={!data.state || data.state && data.state.length < 1}
                    onChange={handleChange}
                    value={data.state || ''}
                    fullWidth
                />
                <TextField
                    margin="dense"
                    id="zip"
                    label="Postal Code"
                    type="number"
                    error={!data.zip || data.zip && data.zip.length !== 5}
                    onChange={handleChange}
                    value={data.zip || ''}
                    fullWidth
                />

            </React.Fragment>}
        </React.Fragment>
    )
}

export default ContactInfo;