import React from 'react';


import { useSelector } from 'react-redux';


import {
    Grid,
    Button,

} from '@mui/material';


import ListTable from 'ui-component/listTable';
import SelectProgram from "ui-component/selectProgram";
import Dialoug from './Dialog';

import {
    getEnrollmentCodes,
    getPrograms,
    getUsers

} from 'utils/functions';

const columns = [
    { id: 'name', label: 'Program Name', minWidth: 170 },
    { id: 'code', label: 'Referal Code', minWidth: 100 },
    { id: 'hcp', label: 'HCP', minWidth: 100 },

    {
        id: 'actions',
        label: 'Actions',
        minWidth: 170,
        align: 'center',
    },
];

const ReferalTab = () => {
    

    const { user } = useSelector((state) => state.auth);
    const [programs, setPrograms] = React.useState([]);
    const [selectedProgram, setselectedProgram] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [data, setData] = React.useState([]);
    const [hcps, setHcps] = React.useState([])


    const handleFind = () => {
        const fetchCodes = async () => {
            const selectedPrograms = programs.filter(prog => selectedProgram.includes(prog.Name))
            let r = await getEnrollmentCodes(selectedPrograms[0].Name)
            setData(r)
        }
        selectedProgram.length > 0 && fetchCodes()
        
    }
    
    React.useEffect(() => {
        const fetchData = async () => {
            let progs = await getPrograms(user)
            setPrograms(progs)
            let users = await getUsers({ userType: 'HCP' })
            setHcps(users)
        }
        fetchData()
    
    }, [])






    return (
        <>
            <Grid container justifyContent='center' alignItems='center'>
                <Grid item md={12} sm={9} xs={9} >
                    <SelectProgram programs={programs} selectedProgram={selectedProgram} setselectedProgram={setselectedProgram} handleFind={handleFind} />
                    <Button variant="contained" className='btn ml-4 mt-1' onClick={() => { setOpen(true) }}>Generate Referal Codes </Button>
                </Grid>
                <Grid item md={9} xs={9}>
                    <ListTable data={data} columns={columns} />
                </Grid>

            </Grid>
           {open && <Dialoug open={open} setOpen={setOpen} data={{ programs, program: selectedProgram, hcps }} />}
        </>

    )
}


export default ReferalTab;  