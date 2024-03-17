import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { useSelector } from 'react-redux';
import { getPrograms } from "utils/functions";

import _ from "lodash";

import ProgramCard from 'ui-component/programCard/index';



export default function Programs(props) {
    const params = useParams();
    const navigate = useNavigate();
    const [programs, setPrograms] = useState([]);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        async function fetchPrograms() {
            if (params.id) {
                let res = await getPrograms(params.id, { program_types: true, drugLogo: true, user: { populate: ['logo'] } })
                    setPrograms(res);
            } else {
                const result = await getPrograms(null , { program_types: true, drugLogo: true, user: { populate: ['logo'] } })
                setPrograms(result);
            }

        }
        fetchPrograms();
    }, []);


    return (
       <section className="container mx-auto px-6 m-10">
         {
                    params.id ?
                        null
                        :
                        <h1 className="text-3xl font-bold text-center mb-6">
                            Patient Support Programs
                        </h1>
                }
                {/* Filters */}
                {user?.userType == "company" && (
                    <div className="mb-6 flex justify-end ">
                        <Button className='btn' size="large" type="" variant="contained" onClick={() => { navigate('/createProgram', { replace: true }); }}>
                            Create New Program
                        </Button>
                    </div>
                )}
       { !_.isEmpty(programs) ? (
            <>
              
                {/* Programs List */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Repeat this block for each program */}

                    {
                       programs.length>0 && programs.map((program) => (
                            <div key={program.id}>
                                <ProgramCard
                                    program={program}

                                />
                            </div>

                        ))
                    }

                    {/* End program block */}



                </div>
                {/* Pagination */}
                <div className="flex justify-center mt-10">
                    <nav
                        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                        aria-label="Pagination"
                    >
                        <a
                            href="#"
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                            Previous
                        </a>
                        {/* Numbers go here */}
                        <a
                            href="#"
                            className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                        >
                            1
                        </a>
                        <a
                            href="#"
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                            Next
                        </a>
                    </nav>
                </div>
            </>
        ) : <h1> no Programs yet</h1>}
       </section> 

    )
}