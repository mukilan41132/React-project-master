import React, { useState } from 'react';
import { Drawer, Box, Typography } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Alert, FormControl, InputLabel, Select, MenuItem, IconButton, TextField } from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
const RightDrawer = ({ open, onClose }) => {
    const options = [
        { label: 'First Name', value: 'first_name' },
        { label: 'Last Name', value: 'last_name' },
        { label: 'Gender', value: 'gender' },
        { label: 'Age', value: 'age' },
        { label: 'Account Name', value: 'account_name' },
        { label: 'City', value: 'city' },
        { label: 'State', value: 'state' },
    ];
    const webhookURL = 'https://webhook.site/99c0cd3e-56b1-473e-a0c3-48a7538939e5';
    const [selectedValue, setSelectedValue] = useState('');
    const [dropdowns, setDropdowns] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [segmentName, setSegmentName] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('success');
    const [showAlert, setShowAlert] = useState(false);

    const handleSelectChange = (event) => {
        setSelectedValue(event.target.value);
    };

    const addNewDropdown = () => {
        if (selectedValue) {
            const selectedOption = options.find(opt => opt.value === selectedValue);
            setDropdowns([...dropdowns, { [selectedOption.value]: selectedOption.label }]);
            setSelectedOptions([...selectedOptions, selectedValue]);
            setSelectedValue('');
        }
    };
    const handleCancel = () => {
        onClose()
        setDropdowns([]);
        setSelectedOptions([]);
        setSelectedValue('');
        setSegmentName('')
    };
    const getRemainingOptions = () => {
        return options.filter(opt => !selectedOptions.includes(opt.value));
    };
    const removeDropdown = (indexToRemove) => {
        const updatedDropdowns = dropdowns.filter((_, index) => index !== indexToRemove);
        const updatedSelectedOptions = selectedOptions.filter((_, index) => index !== indexToRemove);
        setDropdowns(updatedDropdowns);
        setSelectedOptions(updatedSelectedOptions);
    };
    const handleSaveSegment = () => {

        const formattedData = {
            segment_name: segmentName,
            schema: dropdowns,
        };

        console.log(formattedData);

        fetch(webhookURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'no-cors',
            body: JSON.stringify(formattedData),
        })
            .then(() => {
                setAlertMessage('Segment saved successfully!');
                setAlertType('success');
                setShowAlert(true);
            })
            .catch((error) => {
                console.error('Error:', error);
                setAlertMessage('Failed to save segment. Please try again.');
                setAlertType('error');
                setShowAlert(true);
            });
    };


    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            onScroll={true}
        >
            {showAlert && (
                <Alert severity={alertType} onClose={() => setShowAlert(false)}>
                    {alertMessage}
                </Alert>
            )}
            <Box
                sx={{
                    width: 500,
                    padding: 2,
                    textAlign: 'center',
                    backgroundColor: '#39aebc',
                    display: "flex",
                    alignItems: "center",
                    position: 'fixed',
                    zIndex:3
                }}
            >
                <IconButton onClick={onClose} >
                    <ChevronLeftIcon
                        style={{
                            fontSize: 30,
                            color: "white"
                        }}
                    />
                </IconButton>
                <Typography variant="h6" sx={{ color: "white" }}>Saving segment</Typography>
            </Box>
            <Box sx={{ marginTop: 8, marginBottom: 8, height: 'calc(100vh - 160px)', overflowY: 'auto', }}>
                <Box sx={{ padding: 2 }}>
                    <Typography sx={{ fontWeight: 600 }}>Enter the name of the segment</Typography>
                    <TextField
                        label="Name of the segment"
                        variant="outlined"
                        margin="normal"
                        size='small'
                        sx={{ width: "100%", marginBottom: "20px" }}
                        value={segmentName}
                        onChange={(e) => setSegmentName(e.target.value)}
                    />
                    <Typography variant="inherit" sx={{ marginBottom: "20px" }}>
                        To save your segment, you need to add the schemas to build the Query
                    </Typography>
                    <div className='content'>
                        <div className='sub-content'>
                            <span className='color-green'></span>
                            <span>- User Tracks</span>
                        </div>
                        <div className='sub-content'>
                            <span className='color-red'></span>
                            <span>- Group Tracks</span>
                        </div>
                    </div>
                </Box>
                <Box sx={{ padding: 2, border: '2px solid #e3f2fd', borderRadius: 1, margin: 2 }}>
                    <div>
                        {dropdowns.map((dropdown, index) => {
                            const key = Object.keys(dropdown)[0];
                            const label = dropdown[key];
                            return (
                                <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
                                    <FormControl key={index} size='small' sx={{ marginTop: 2, width: "100%" }}>
                                        <InputLabel id={`dropdown-label-${index}`}>{label}</InputLabel>
                                        <Select
                                            labelId={`dropdown-label-${index}`}
                                            size='small'
                                            value={key}
                                            onChange={(event) => {
                                                const updatedDropdowns = [...dropdowns];
                                                const newValue = event.target.value;
                                                const selectedOption = options.find(opt => opt.value === newValue);
                                                updatedDropdowns[index] = { [selectedOption.value]: selectedOption.label };
                                                setDropdowns(updatedDropdowns);
                                            }}
                                            label={label}
                                        >
                                            <MenuItem key={key} value={key}>
                                                {label}
                                            </MenuItem>
                                            {getRemainingOptions().map(option => (
                                                option.value !== key && (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                )
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <IconButton
                                        sx={{ marginLeft: 1 }}
                                        onClick={() => removeDropdown(index)}
                                    >
                                        <RemoveCircleOutlineIcon />
                                    </IconButton>
                                </Box>
                            );
                        })}
                    </div>
                </Box>
                <Box sx={{ padding: 2 }}>
                    <FormControl size='small' sx={{ marginBottom: 2, width: "100%" }}>
                        <InputLabel id="dropdown-label">Add schema to segment</InputLabel>
                        <Select
                            labelId="dropdown-label"
                            value={selectedValue}
                            onChange={handleSelectChange}
                            size='small'
                            label="Add schema to segment"
                        >
                            {getRemainingOptions().map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Typography
                        variant="inherit"
                        sx={{ color: "#3eb188", cursor: "pointer" }}
                        onClick={addNewDropdown}
                    >
                        + <span style={{ textDecoration: "underline" }}>Add new Schema</span>
                    </Typography>
                </Box>

            </Box>
            <Box sx={{
                position: "fixed",
                bottom: 0,
                width: '-webkit-fill-available',
                padding: 2, backgroundColor: '#f0f0f0',
                textAlign: 'center',
                display: "flex",
                gap: "10px",
                zIndex: 1,
            }}>
                <button className='button_element'
                    onClick={handleSaveSegment}
                >
                    Save the Segment
                </button>
                <button className='button_element_cncl'
                    style={{ color: "red", cursor: 'pointer' }}
                    onClick={handleCancel}
                >
                    Cancel
                </button>
            </Box>
        </Drawer>
    );
};

export default RightDrawer;