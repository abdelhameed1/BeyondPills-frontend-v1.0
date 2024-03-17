import * as React from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import List from 'ui-component/listTable';

const columns = [
  { id: 'name', label: 'Program Name', minWidth: 170 },
  { id: 'drug', label: 'Drug', minWidth: 100 },
  {
    id: 'disease',
    label: 'Disease',
    minWidth: 170,
    align: 'left',
  },
  {
    id: 'status',
    label: 'Status',
    minWidth: 170,
    align: 'center',
  },
  {
    id: 'actions',
    label: 'Actions',
    minWidth: 170,
    align: 'center',
  },
];



export default function StickyHeadTable() {
 
  const [data , setData] = React.useState([])
  const { user } = useSelector((state) => state.auth);

  React.useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/getPatientEnrollments` , {
        params:{
            userID : user.id
        } }).then((res) => {
            let d = []
            res.data.data.map((item) => {
                d.push({
                    name : item.programID.Name,
                    drug : item.programID.Drug,
                    disease : item.programID.Disease,
                    status : item.status,
                })
            })
            setData(d)
        })
  },[])

  

  

  return (
   <List data={data} columns={columns} />
  );
}