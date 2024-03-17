import React from 'react';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';

import {
    FormHelperText,
    Button,
    OutlinedInput,
    MenuItem,
    FormControl,
    Select
} from '@mui/material';



const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function getStyles(name, selectedProgram, theme) {
    return {
        fontWeight:
            selectedProgram.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

export default function SelectProgram({ programs, selectedProgram, setselectedProgram, handleFind, helperText }) {
    const theme = useTheme();


    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setselectedProgram(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };



    return (
        <>
            <FormControl sx={{ width: 300, mr: 2 }}>
                <Select

                    displayEmpty
                    value={selectedProgram}
                    onChange={handleChange}
                    input={<OutlinedInput />}
                    renderValue={(selected) => {
                        if (selected.length === 0) {
                            return <em>Please Select A program</em>;
                        }

                        return selected.join(', ');
                    }}
                    MenuProps={MenuProps}
                    inputProps={{ 'aria-label': 'Without label' }}
                >
                    <MenuItem disabled value="">
                        <em>Please Select A program</em>
                    </MenuItem>
                    
                    {programs.map((prog) => (
                        <MenuItem
                            key={prog.Name}
                            value={prog.Name}
                            style={getStyles(prog.Name, selectedProgram, theme)}
                        >
                            {prog.Name}
                        </MenuItem>
                    ))}
                </Select>
                <FormHelperText>{selectedProgram.length == 0 ? helperText : ''}</FormHelperText>
            </FormControl>
            <Button variant="contained" className='btn mt-1' onClick={handleFind}>Find </Button>

        </>

    )

}