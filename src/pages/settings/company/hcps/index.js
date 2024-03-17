import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid} from '@mui/material';
import { getUsers } from 'utils/functions';
// project imports

import ListTable from 'ui-component/listTable';
// ==============================|| USER LIST STYLE 1 ||============================== //
const columns = [
    { id: 'avatar', label: 'Name', minWidth: 170 },
    { id: 'specialty', label: 'Specialty', minWidth: 100 },
    {
        id: 'actions',
        label: 'Actions',
        minWidth: 170,
        align: 'center',
    },
];

const UsersTable = () => {
    const theme = useTheme();
    const [data, setData] = React.useState([]);



    React.useEffect(() => {
        const fetchData = async () => {
            let d = []
            let users = await getUsers({
                userType: 'HCP'
            })
            users.map(user => {
                d.push({
                    id: user.id,
                    avatar: true,
                    avatarName: user.title + ' ' + user.name,
                    avatarEmail: user.email,
                    specialty: user.specialty})
            })
            setData(d)
        }
        fetchData()

    }, []);

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

export default UsersTable;
