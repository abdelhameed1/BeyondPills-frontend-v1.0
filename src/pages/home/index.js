import React, { useEffect, useState } from "react";
import axios from "axios";

import ProgramCard from 'ui-component/programCard/index';

function Home() {
  const [programs, setPrograms] = useState([]);
  const [programTypes, setProgramTypes] = useState([]);

  useEffect(() => {
    async function fetchPrograms() {
      const result = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/programs`,
        {
          params: {
            filters: {
              featured: true,
            },
            populate:  { program_types: true, drugLogo: true, user: { populate: ['logo'] } }
          },
        }
      );
      setPrograms(
        result.data.data.map((program) => {
          return { ...program.attributes, id: program.id };
        })
      );
    }
    async function fetchProgramTypes() {
      const result = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/program-types`
      );
      setProgramTypes(
        result.data.data.map((programType) => {
          return { ...programType.attributes, id: programType.id };
        })
      );
    }
    fetchPrograms();
    fetchProgramTypes();
  }, []);

  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>BeyondPills Homepage</title>
      <link
        href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
      />

      <div className="container mx-auto">
       
        <section className="hero-section py-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center flex-col-reverse lg:flex-row">
              <div className="lg:w-1/2">
                <h1 className="text-4xl font-bold mb-6">
                  Join BeyondPills and Be Part of a Revolution in Patient Care
                </h1>
                <p className="text-gray-500 text-lg mb-8">
                  BeyondPills connects patients, healthcare providers, and
                  pharmaceutical companies to deliver personalized care and
                  improved health outcomes.
                </p>
                <button className="bg-blue-600 px-5 py-2 text-white rounded-md">
                  Get Started Now
                </button>
              </div>
              <div className="lg:w-1/2">
                <img
                  src="/hero2.png"
                  alt="OIG Image"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4 flex justify-center items-center flex-col">
            <h2 className="section-title mb-10">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="flex flex-col items-center justify-center p-6 border rounded-md bg-white h-full">
                <i className="fas fa-user-plus text-6xl text-blue-600 mb-5" />
                <h4 className="text-xl font-semibold mb-5">Sign Up</h4>
                <p className="text-gray-500">
                  Create your account by filling out the registration form. It's
                  quick, easy, and free.
                </p>
              </div>
              <div className="flex flex-col items-center justify-center p-6 border rounded-md bg-white h-full">
                <i className="fas fa-pills text-6xl text-green-500 mb-5" />
                <h4 className="text-xl font-semibold mb-5">
                  Find Your Treatment
                </h4>
                <p className="text-gray-500">
                  Search for your medication by name or browse our treatment
                  options. Our platform provides detailed information about the
                  drug and its uses.
                </p>
              </div>
              <div className="flex flex-col items-center justify-center p-6 border rounded-md bg-white h-full">
                <i className="fas fa-user-md text-6xl text-orange-500 mb-5" />
                <h4 className="text-xl font-semibold mb-5">
                  Connect with Your HCP
                </h4>
                <p className="text-gray-500">
                  Connect with your healthcare provider through our platform to
                  discuss your treatment options and receive personalized
                  advice.
                </p>
              </div>
              <div className="flex flex-col items-center justify-center p-6 border rounded-md bg-white h-full">
                <i className="fas fa-clipboard-check text-6xl text-purple-500 mb-5" />
                <h4 className="text-xl font-semibold mb-5">
                  Enroll in a Program
                </h4>
                <p className="text-gray-500">
                  Enroll in a program that suits your needs and preferences. Our
                  programs provide additional support, resources, and savings
                  for your treatment.
                </p>
              </div>
              <div className="flex flex-col items-center justify-center p-6 border rounded-md bg-white h-full">
                <i className="fas fa-mobile-alt text-6xl text-pink-500 mb-3" />
                <h4 className="text-xl font-semibold mb-3">Stay Connected</h4>
                <p className="text-gray-500">
                  Use our platform to stay connected with your HCP, track your
                  progress, and receive reminders about your treatment. Our team
                  is always here to support you.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* Featured Patient Assistance Programs */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="section-title mb-10 justify-center items-center text-center">
              Featured Patient Assistance Programs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {programs.map((program) => (
                <div key={program.id}>
                  <ProgramCard program={program} />
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="py-16 bg-gray-100">
          <div className="px-4 sm:px-10 mt-8">
            <h2 className="text-4xl text-gray-800 font-bold mb-6 text-center">
              Types of Patient Assistance Programs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Placeholder for Type Cards */}
              {/* Repeat this block for each type, update alt text accordingly */}
              {programTypes.map((programType) => (
                <div className="bg-white p-4 rounded-md shadow" key={programType.id}>
                  <h3 className="text-xl font-semibold">{programType.name}</h3>
                  <p className="text-gray-600 mt-2">
                    {programType.description}
                  </p>
                  <a
                    href="#"
                    className="text-blue-600 hover:underline mt-4 block"
                  >
                    Read more
                  </a>
                </div>
              ))}
              {/* Repeat for other types */}
              {/* ... additional cards ... */}
            </div>
          </div>
        </section>
        <section>
          {/* Become a Partner Section */}
          <div className="py-10 mt-8">
            <div className="container mx-auto px-4">
              <div className="text-center mb-10">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-800">
                  Become a Partner
                </h2>
                <p className="text-md text-gray-600 mt-2">
                  Collaborate with us and contribute to innovative patient care
                  solutions.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Card for Pharmaceutical Companies */}
                <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-blue-600">
                      For Pharmaceutical Companies
                    </h3>
                    <p className="text-gray-600 mt-4">
                      Join our Patient Assistance platform to provide valuable
                      support to patients and enhance their treatment journey.
                    </p>
                    <button className="bg-blue-600 text-white px-6 py-3 mt-6 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300">
                      Become a Partner
                    </button>
                  </div>
                </div>
                {/* Card for HCPs */}
                <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-green-600">
                      For HCPs
                    </h3>
                    <p className="text-gray-600 mt-4">
                      Join our network of healthcare providers and be part of a
                      comprehensive Patient Support Program.
                    </p>
                    <button className="bg-green-600 text-white px-6 py-3 mt-6 rounded-lg font-medium hover:bg-green-700 transition-colors duration-300">
                      Become a Partner
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
      </div>
    </>
  );
}

export default Home;
