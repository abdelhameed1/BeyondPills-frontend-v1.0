import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useSelector } from "store";

import EditIcon from '@mui/icons-material/Edit';
import Dialoug from 'ui-component/dialog/index';
import { getPatientEnrollments } from "utils/functions";
export default function ProgramCard({ program }) {
  const { user, islogged } = useSelector((state) => state.auth);

  const navigate = useNavigate()
  const params = useParams();

  const [isHovered, setIsHovered] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [enrolls, setEnrolls] = React.useState([]);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  React.useEffect(() => {
    async function fetchPrograms() {
      if (user?.userType === "patient" && islogged) {
        let e = await getPatientEnrollments(user)
        setEnrolls(e)
      }
      
    }
    fetchPrograms();
  }, [user ,islogged ]);
  return (
    <div className="p-6 border rounded-md bg-white text-left"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      <div className="flex mb-4">
        <div className="flex-col">
          <h3>
            <Link to={`/programs/${program.id}`} className="text-xl font-semibold hover:underline hover:text-blue-500" >{program.Name}</Link>
            {isHovered && user?.userType === "company" && user?.id === params.id && (
              <EditIcon className="ml-2 hover:text-gray-400" onClick={() => { navigate(`/editProgram/${program.id}`) }}>Edit</EditIcon>
            )}
          </h3>
          {
            program.program_types.data.map(type => {
              return (
                <p className="underline underline-offset-5" key={type.id}>
                  {type.attributes.name}
                </p>
              )
            })
          }

        </div>
        <img
          src={program.user.data.attributes.logo?.data ? `${process.env.REACT_APP_APP_BACKEND}${program.user.data.attributes.logo?.data.attributes.url}` : "https://via.placeholder.com/150x50"}
          alt="company logo"
          className="w-16 h-auto rounded-md ml-auto"
        />

      </div>

      <p className="text-gray-500 mb-4">{program.Description}</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-base font-semibold">Benefits</h4>
          <ul className="list-disc text-sm text-gray-500 ml-4">
            {program.Benefits.split("\n").map((item, index) => (
              <li key={`${item}${index}`}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-base font-semibold">Drug</h4>
          <ul className="list-disc text-sm text-gray-500 ml-4">
            {program.Drug.split("\n").map((item, index) => (
              <div key={`${item}${index}`}>

                <li key={`${item}${index}`}>{item}</li>
                {
                  program.drugLogo?.data && program.drugLogo?.data.length > 0 ? (
                    <img
                      src={`${process.env.REACT_APP_APP_BACKEND}${program.drugLogo?.data[0].attributes?.url}`}
                      alt={item}
                      className="w-16 h-auto rounded-md  mr-auto"
                    />
                  ) : null

                }
              </div>


            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-base font-semibold">Disease</h4>
          <ul className="list-disc text-sm text-gray-500 ml-4">
            {program.Disease.split("\n").map((item, index) => (
              <li key={`${item}${index}`}>{item}</li>
            ))}

          </ul>
        </div>
        <div>
          <h4 className="text-base font-semibold">
            Eligibility Criteria
          </h4>
          <ul className="list-disc text-sm text-gray-500 ml-4">
            {program.Eligibility_criteria
              .split("\n")
              .map((item, index) => (
                <li key={`${item}${index}`} >{item}</li>
              ))}
          </ul>
        </div>
        <div>
          <h4 className="text-base font-semibold">Countries</h4>
          <ul className="list-disc text-sm text-gray-500 ml-4">
            {program.Countries.split("\n").map((item, index) => (
              <li key={`${item}${index}`}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      {
        islogged && user?.userType == "patient" && !enrolls.includes(program.id) && (
          <button
            className="mt-6 bg-blue-500 text-white py-2 px-4 rounded-md text-right"
            onClick={() => (setOpen(true))}
          >
            Enroll Now
          </button>)
      }
      {
        islogged && user?.userType == "patient" && enrolls.includes(program.id) && (
          <button
            disabled
            className="mt-6 bg-green-500 text-white py-2 px-4 rounded-md text-right"

          >
            Enrolled
          </button>)
      }
      <Dialoug open={open} setOpen={setOpen} data={{ programID: program.id, userID: user?.id }} />
    </div>
  )


}