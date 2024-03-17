import axios from 'axios';
import _ from 'lodash';


export const getPrograms = async (user , populate) => {
    let filters
    let p = []
    if(user && user.id) filters = { user: user.id }
    else if(user) filters = { user: user }
    let progs = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/programs`, {
        params: {
            filters,
            populate
        }
    })
    progs.data.data.map(program => {
        p.push({
            id: program.id,
             ...program.attributes

        })
    })
    return p
}
export const getEnrollmentCodes = async (Name) => {
    let codes = []
    let res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/enrollment-codes`, {
        params: {
            filters: {
                program: {
                    Name
                }
            },
            populate: ['program', 'hcp']

        }
    })
        res.data.data.map(item => {
            codes.push({
                id: item.id,
                code: item.attributes.code,
                name: item.attributes.program.data.attributes.Name,
                hcp: !_.isEmpty(item.attributes.hcp.data) ? item.attributes.hcp.data.attributes.title + ',' + item.attributes.hcp.data.attributes.username : "Not Assigned"
            })
        })

   
    return codes
}
export const getUsers = async (filters) => {
    let data = []
    let users = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users`, {
        params: {
            filters
        }
    })

    users.data.map(user => {
        data.push({
            id: user.id,
            name: user.username,
            email: user.email,
            specialty: user.specialty,
            title: user.title
        })
    })


    return data
}
export const getReferalRequests = async (user, program) => {
    let filters ={
        status  : 'pending'
    }, 
    requests = []
    
    if (!_.isEmpty(program)) filters.program = program.id 
    else filters.program = {
            user: {
                id: user.id
            }
        }
    

   let results = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/referal-requests`, {
        params: {
            filters,
            populate: {
                program: {
                    populate: ["user"]
                },
                hcp: true
            }
        }
    })

    results.data.data.map(item => {
        let hcp = item.attributes.hcp.data.attributes.title + '.' + item.attributes.hcp.data.attributes.username
        let program = item.attributes.program.data.attributes.Name
        let number = item.attributes.number_of_codes

        requests.push({
            id: item.id,
            hcp,
            hcpId: item.attributes.hcp.data.id,
            programId: item.attributes.program.data.id,
            program,
            number
        })
    })
    return requests
}

export const getHcpEnrollmentCodes = async (user , id) => {
    let filters = {
        hcp: { id: user.id }
    }
    let codes = []

    if (id) {
        filters.program = {
            id
        }
    }

    let res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/enrollment-codes`, {
        params: {
            filters,
            populate: {
                program: {
                    populate: ["user"]
                },
            }

        }
    })

    if (res.data.data.length > 0) {
      res.data.data.map(item => {
        let code = item.attributes.code
        let name = item.attributes.program.data.attributes.Name
        let company = item.attributes.program.data.attributes.user.data.attributes.username
        codes.push({
            id: item.id,
            code,
            name,
            company
        })
      })
        
    }else codes = []

    return codes

}

export const rejectReferalRequest = async (id) => {
    try{
        await axios.put(`${process.env.REACT_APP_BACKEND_URL}/referal-requests/${id}`, {
            data: {
                status: 'rejected'
            }
        })
    
        return "Request Rejected"
    }catch(err){
        return err
    }
}

export const checkEnrollment = async (nationalId, id) => {
    const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/enrollments`, {
        params :{
            filters : {
                userID :{
                    nationalId
                
                },
                programID : {
                    id 
                }
            },
        populate : [ 'programID' , 'userID']
        }
    })

    return res.data.data
}



export const getPendingEnrollments = async (user) => {
    let data =[]
        let res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/getPendingEnrollments` , {
            params : {
                userID : user.id
            }
        })
            res.data.data.map(items => {
                data.push({
                    name: items.programID.Name,
                    Drug: items.programID.Drug,
                    date : items.enrollmentDate.split('T')[0],
                    patient : items.userID.username,
                    status : items.status
                })
            })
            
       
        return data
}



export const getPatientEnrollments = async (user) => {
    
    const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/enrollments`, {
        params :{
            filters : {
                userID :{
                    id : user.id
                
                }
            },populate : ['programID']
        }
    })
    
    return res.data.data.map(item => item.attributes.programID.data.id)
    
    
}