import React from "react";
import axios from "axios";
import _ from 'lodash';
import { useSelector } from 'react-redux';

import {
    Grid
} from '@mui/material';

import SelectProgram from "ui-component/selectProgram";
import ListTable from 'ui-component/listTable';


const columns = [
    { id: 'program', label: 'Program Name', minWidth: 170 },
    { id: 'patient', label: 'Patient Name', minWidth: 100 },
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
    const [selectedProgram, setselectedProgram] = React.useState([]);
    const [data, setData] = React.useState([]);

    React.useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/programs`, {
            params: {
                fields: ['Name']
            }
        }).then((res) => {
            let p = []
            res.data.data.map(program => {
                p.push({
                    id: program.id,
                    Name: program.attributes.Name

                })
            })
            setPrograms(p)
        })
    }, []);

    const handleFind = () => {
        let selected
            , filters = {
                hcp: { id: user.id }
            }

        if (selectedProgram.length > 0) {
            selected = programs.filter(prog => selectedProgram.includes(prog.Name))
            filters.programID = {
                Name: selected[0].Name
            }
        }
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/enrollments`, {
            params: {
                filters,
                populate: {
                    programID: {
                        populate: ["user"]
                    },
                    userID: true
                }

            }
        }).then(res => {
            if (res.data.data.length > 0) {
                let enrrolments = []
                res.data.data.map(item => {
                    let program = item.attributes.programID.data.attributes.Name
                    let patient = item.attributes.userID.data.attributes.username
                    let company = item.attributes.programID.data.attributes.user.data.attributes.username

                    enrrolments.push({
                        program,
                        patient,
                        company
                    })

                })
                setData(enrrolments)
            } else setData([])
            
        })
    }


    return (
        <Grid container justifyContent='center' alignItems='center'>
            <Grid item md={12} sm={9} xs={9} >
                <SelectProgram
                    programs={programs}
                    selectedProgram={selectedProgram}
                    setselectedProgram={setselectedProgram}
                    handleFind={handleFind}
                    helperText={"Press Find to get all your enrollments"}

                />
            </Grid>
            <Grid item md={9} xs={9}>
                    <ListTable data={data} columns={columns} />
                </Grid>
        </Grid>
    )
}