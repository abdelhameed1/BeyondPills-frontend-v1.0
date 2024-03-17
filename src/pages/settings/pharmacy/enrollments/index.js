import React from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    getPrograms,
    checkEnrollment
} from 'utils/functions'
import ListTable from 'ui-component/listTable';

import { parseNationalId } from "parse-national-id";

import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    FormHelperText,
    TextField,
    Grid
} from '@mui/material'

const columns = [
    { id: 'program', label: 'Program Name', minWidth: 170 },
    { id: 'patient', label: 'Patient Name', minWidth: 100 },
    { id: 'date', label: 'Enrollment Date', minWidth: 100 },
    { id: 'status', label: 'Enrollment Status', minWidth: 100 },
];


//29704291601398
export default function Index() {
    const [programs, setPrograms] = React.useState([])
    const [data, setData] = React.useState([])
    const formik = useFormik({
        initialValues: {
            program: "",
            nationalId: "",
        },
        validationSchema: Yup.object().shape({
            program: Yup.object().required('Program is required'),
            nationalId: Yup.number().required('National ID is required'),

        }),
        onSubmit: (values, actions) => {
            const checkEnroll = async () => {
                let d = []
                let res = await checkEnrollment(values.nationalId, values.program.id);
                res.map(item => {
                    d.push({
                        id: item.id,
                        program: item.attributes.programID.data.attributes.Name,
                        patient: item.attributes.userID.data.attributes.username,
                        date: item.attributes.enrollmentDate.split('T')[0],
                        status: item.attributes.status
                    })
                })
                setData(d)
            }
            let validId = parseNationalId(`${values.nationalId}`)
            if (!validId) actions.setFieldError('nationalId', 'Invalid National ID')
            else {
                checkEnroll()
            }


        }
    })
    React.useEffect(() => {
        const fetchData = async () => {
            let progs = await getPrograms()
            setPrograms(progs)
        }
        fetchData()

    }, [])


    return (
        <>
            <Grid container justifyContent='center' alignItems='center' >
                <Grid item md={12}>
                    <form noValidate onSubmit={formik.handleSubmit} >
                        <FormControl className='mt-4'>
                            <InputLabel id="program-label">Program</InputLabel>
                            <Select
                                labelId="program-label"
                                id="program"
                                value={formik.values.program}
                                label="Program"
                                name="program"
                                fullWidth
                                sx={{ minWidth: 200 }}
                                error={Boolean(formik.errors.program && formik.touched.program)}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                {programs.map((prog) => (
                                    <MenuItem
                                        key={prog.Name}
                                        value={prog}
                                    >
                                        {prog.Name}
                                    </MenuItem>
                                ))}
                            </Select>
                            {formik.errors.program && formik.touched.program && (
                                <FormHelperText error id="standard-weight-helper-text-email-login">
                                    {' '}
                                    {formik.errors.program}{' '}
                                </FormHelperText>
                            )}
                        </FormControl>
                        <FormControl className='ml-2' >
                            <TextField
                                fullWidth
                                label="National ID"
                                margin="normal"
                                name="nationalId"
                                type="number"
                                error={Boolean(formik.touched.nationalId && formik.errors.nationalId)}
                                value={formik.values.nationalId}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}

                            />
                            {formik.touched.nationalId && formik.errors.nationalId && (
                                <FormHelperText error id="standard-weight-helper-text--register">
                                    {formik.errors.nationalId}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <Button variant="contained" className='btn ml-2 mt-5' onClick={formik.handleSubmit}>Check </Button>
                    </form>
                </Grid>
                <Grid item md={12}>
                    {
                        data.length > 0 ? (<ListTable data={data} columns={columns} />) :  <h1 style={{ marginTop: "25vh" }}> No Enrollment Data Found  </h1>
                    }
                </Grid>
            </Grid>
        </>
    )
}