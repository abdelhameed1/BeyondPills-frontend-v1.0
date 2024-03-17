import React from "react";
import { useSelector } from 'react-redux';

import {
    getHcpEnrollmentCodes,
    getPrograms

} from 'utils/functions';

import {
    Grid,
    Button,
} from '@mui/material';

import ListTable from 'ui-component/listTable';
import SelectProgram from "ui-component/selectProgram";
import Dialoug from './Dialog';

const columns = [
    { id: 'name', label: 'Program Name', minWidth: 170 },
    { id: 'code', label: 'Referal Code', minWidth: 100 },
    { id: 'company', label: 'Company Name', minWidth: 100 },

    {
        id: 'actions',
        label: 'Actions',
        minWidth: 170,
        align: 'center',
    },
];


export default function Index() {
    const { user } = useSelector((state) => state.auth);
    const [programs, setPrograms] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [selectedProgram, setselectedProgram] = React.useState([]);
    const [data, setData] = React.useState([]);

    React.useEffect(() => {
        const fetchData = async () => {
            let progs = await getPrograms()
            setPrograms(progs)
        }
        fetchData()



    }, []);

    const handleFind = () => {
        const fetchCodes = async () => {
            const selectedPrograms = programs.filter(prog => selectedProgram.includes(prog.Name))
            let r = await getHcpEnrollmentCodes(user , selectedPrograms[0].id)
            setData(r)
        }
        fetchCodes()
    }

    return (
        <Grid container justifyContent='center' alignItems='center'>
            <Grid item md={12} sm={9} xs={9} >
                <SelectProgram
                    programs={programs}
                    selectedProgram={selectedProgram}
                    setselectedProgram={setselectedProgram}
                    handleFind={handleFind}
                    helperText={"Press Find to get all your referal codes"}

                />
                <Button variant="contained" className='btn ml-4 mt-1' onClick={() => { setOpen(true) }}>Request Referal Codes</Button>
            </Grid>
            <Grid item md={9} xs={9}>
                    <ListTable data={data} columns={columns} />
                </Grid>
               {open && <Dialoug open={open} setOpen={setOpen}  />} 
        </Grid>
    )
}