import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";


export default function Details(props) {
    const [program, setProgram] = useState({});
    let params = useParams()
    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_BACKEND_URL}/programs/${params.id}`, {
                params: {
                    populate: ['program_types', 'companyLogo', 'drugLogo']
                }
            })
            .then((response) => {
                setProgram(response.data.data.attributes);


            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <>
            <main className="container mx-auto p-6">
                {/* Program Details Section */}
                {
                    program.Benefits ? (
                        <section className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-4xl font-bold text-indigo-600 mb-4">{program.Name}</h2>
                            <img
                                className="w-full h-64 object-cover rounded-lg mb-6"
                                src={program.companyLogo?.data?.attributes?.url ? `${process.env.REACT_APP_APP_BACKEND}${program.companyLogo?.data?.attributes?.url}` : "https://via.placeholder.com/150x50"}
                                alt="Program Image"
                            />
                            <div className="grid md:grid-cols-3 gap-4">
                                {/* Program Description */}
                                <div className="md:col-span-3">
                                    <h3 className="text-2xl font-semibold mb-2">Description</h3>
                                    <p className="text-gray-700 mb-4">
                                        {program.Description}
                                    </p>
                                </div>

                                {/* Program Drug */}
                                <div>
                                    <h3 className="text-2xl font-semibold mb-2">Program Benefits</h3>
                                    {program.Benefits.split("\n").map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-semibold mb-2">Program Drug</h3>
                                    {program.Drug.split("\n").map((item) => (
                                        <div key={item}>
                                            <li>{item}</li>
                                            {
                                                program.drugLogo?.data?.attributes?.url ? (
                                                    <img
                                                        src={`${process.env.REACT_APP_APP_BACKEND}${program.drugLogo?.data?.attributes?.url}`}
                                                        alt="Placeholder Image"
                                                        className="w-16 h-auto rounded-md  m-auto"
                                                    />
                                                ) : null

                                            }

                                        </div>

                                    ))}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-semibold mb-2">Program Countries</h3>
                                    {program.Countries.split("\n").map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-semibold mb-2">Program Eligibility Criteria</h3>
                                    {program.Eligibility_criteria.split("\n").map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </div>
                                {/* Disease Area */}
                                <div>
                                    <h3 className="text-2xl font-semibold mb-2">Disease </h3>
                                    <ul className="list-disc text-sm text-gray-500 ml-4">
                                        {program.Disease.split("\n").map((item) => (
                                            <li key={item}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            {/* Enrollment Button */}
                            <div className="flex justify-center mt-6">
                                <a
                                    href="#"
                                    className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700"
                                >
                                    Enroll Now
                                </a>
                            </div>
                        </section>
                    ) : null
                }
            </main>

        </>
    )

}

