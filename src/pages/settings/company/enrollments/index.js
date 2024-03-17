

import * as React from 'react';
import { getPendingEnrollments } from 'utils/functions';
// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Grid
} from '@mui/material';


// project imports
import ListTable from 'ui-component/listTable';
import { useDispatch, useSelector } from 'store';


// assets




const columns = [
    { id: 'name', label: 'Program Name', minWidth: 170 },
    { id: 'patient', label: 'patient Name', minWidth: 170 },
    { id: 'Drug', label: 'Drug', minWidth: 100 },
    { id: 'date', label: 'Enrollment Date', minWidth: 100 },
    { id: 'status', label: 'Enrollment Status', minWidth: 100 },
    { id: 'actions', label: 'Actions', minWidth: 170, align: 'center' },
];

const ProgramList = () => {
    const theme = useTheme();
    const dispatch = useDispatch();

    const user = useSelector((state) => state.auth.user);
   
    const [data, setData] = React.useState([])
   
    React.useEffect(() => {
        const fetchData = async () => {
            let d = await getPendingEnrollments(user)
            setData(d)
        }
        fetchData()
    }, [])

    return (
        <>
            <Grid conatiner justifyContent='center' alignContent='center'>
                <Grid item md={6}>
                    {data && (
                        <ListTable columns={columns} data={data} />
                    )}
                </Grid>
            </Grid>
        </>
    );
};

export default ProgramList;
