import React from "react";

import { useSelector } from "react-redux";

import ListTable from 'ui-component/listTable';
import SelectProgram from "ui-component/selectProgram";
import {
    getReferalRequests,
    getPrograms,
    rejectReferalRequest

} from 'utils/functions';
import Dialoug from "./Dialog";

import { Grid } from "@mui/material";
import { useDispatch } from "store";
import { openSnackbar } from 'store/slices/snackbar';

const columns = [
    { id: 'program', label: 'Program Name', minWidth: 170 },
    { id: 'hcp', label: 'Requester', minWidth: 100 },
    { id: 'number', label: 'Codes Requested', minWidth: 100 },
    {
        id: 'actions',
        label: 'Actions',
        minWidth: 170,
        align: 'center',
    },
];


export default function Index() {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [programs, setPrograms] = React.useState([]);
    const [selectedProgram, setselectedProgram] = React.useState([]);
    const [row, setRow] = React.useState({})
    const [data, setData] = React.useState([]);
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        const fetchData = async () => {
            let progs = await getPrograms(user)
            setPrograms(progs)
            let requests = await getReferalRequests(user, selectedProgram);
            setData(requests)
        }
        fetchData()

    }, []);

    const handleFind = () => {
        const fetchData = async () => {
            let selected = programs.filter(prog => selectedProgram.includes(prog.Name))
            let requests = await getReferalRequests(user, selected[0]);
            setData(requests)
        }
        selectedProgram.length > 0 &&  fetchData()
    }

    const actions = {
        acceptRequest: (id) => {
            let selectedRow = data.filter(item => item.id == id)
            setRow(selectedRow[0])
            setOpen(true)

        },
        rejectRequest: async (id) => {
            let result = await rejectReferalRequest(id)
            if(result== "Request Rejected" ){
                let newData = data.filter(item => item.id !== id)
                setData(newData)
                dispatch(
                    openSnackbar({
                        open: true,
                        message: result,
                        variant: 'alert',
                        alert: {
                            color: 'success'
                        },
                        close: true
                    })
                )
            }else {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: result,
                        variant: 'alert',
                        alert: {
                            color: 'error'
                        },
                        close: true
                    })
                )
            }
            
        }
    }

    return (
        <Grid container justifyContent='center' alignContent='center'>
            <Grid item xs={12} md={6}>
                <SelectProgram programs={programs} selectedProgram={selectedProgram} setselectedProgram={setselectedProgram} handleFind={handleFind} />
            </Grid>
            <Grid item xs={12} md={9}>
                <ListTable columns={columns} data={data} actions={actions} />
            </Grid>
            {
                open && <Dialoug open={open} setOpen={setOpen} row={row} data={data} setData={setData} />
            }
        </Grid>
    )
}