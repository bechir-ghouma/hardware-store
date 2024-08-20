// import React, {useEffect, useState} from 'react';
// import axios from 'axios';
// // import { Link } from 'react-router-dom';
// import CreateClient from './CreateClient';


// function Client() {
//     const [client,setClient] = useState([])
//     useEffect(() => {
//         axios.get('http://localhost:7777/client/')
//         .then(res => setClient(res.data))
//         .catch(err => console.log(err));
//     }, [])

//     const handleDelete = async (id) => {
//         try {
//             await axios.delete('http://localhost:7777/client/'+id)
//             window.location.reload()
//         } catch(err){
//             console.log(err);
//         }
//     }

//     const handleAddClient = (newClient) => {
//         setClient([...client, newClient]);
//     }
    
//   return (
//     <div className='article-container'>
//         <div className='w-110 bg-white rounded p-3'>
//         <CreateClient onAddArticle={handleAddClient} /><br />
//         <h2>Liste des clients</h2>
//         <div className='table-responsive'>
//             <table className='table table-striped'>
//                 <thead>
//                     <tr>
//                     <th>Id</th>
//                     <th>Nom</th>
//                     <th>Adresse</th>
//                     <th>Telephone</th>
//                     <th>Matricule fiscale</th>
//                     <th>Registre Commerciale</th>
//                     <th>Nom du resposable</th>
//                     <th>Telephone du responsable</th>                    
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {
//                         client.map((data,i) => (
//                             <tr key={i}>
//                                 <td>{data.clID}</td>
//                                 <td>{data.clName}</td>
//                                 <td>{data.clAdr}</td>
//                                 <td>{data.clTel}</td>
//                                 <td>{data.clMF}</td>
//                                 <td>{data.clRC}</td>
//                                 <td>{data.responsable}</td>
//                                 <td>{data.resTel}</td>
//                                 <td>
//                                     {/* <Link to={`updateCl/${data.clID}`} className='btn btn-primary'>Changer</Link> */}
//                                     {/* <button className='btn btn-danger ms-2' onClick={e => handleDelete(data.clID)}>Supprimer</button> */}
//                                 </td>
//                             </tr>
//                         ))
//                     }
//                 </tbody>
//             </table>

//         </div>
//         </div>
//     </div>
//   )
// }

// export default Client;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CreateClient from './CreateClient';
import './Article.css';  // Assuming you have this stylesheet for consistent styling

function Client() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:7777/client/')
      .then(res => setClients(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:7777/client/${id}`);
      setClients(clients.filter(client => client.clID !== id));
      setSelectedClient(null);
      setSelectedRow(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddClient = (newClient) => {
    setClients([...clients, newClient]);
  };

  return (
    <div className='article-container'>
      <CreateClient onAddClient={handleAddClient} onDelete={handleDelete} selectedClient={selectedClient} />
      <div className='table-responsive'>
        <table className='table table-striped'>
          <thead>
            <tr>
              <th>Id</th>
              <th>Nom</th>
              <th>Adresse</th>
              <th>Telephone</th>
              <th>Matricule fiscale</th>
              <th>Registre Commerciale</th>
              <th>Nom du responsable</th>
              <th>Telephone du responsable</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client, index) => (
              <tr
                key={client.clID}
                onClick={() => {
                  setSelectedClient(client);
                  setSelectedRow(index);
                }}
                className={selectedRow === index ? 'table-active' : ''}
                style={{ cursor: 'pointer' }}
              >
                <td>{client.clID}</td>
                <td>{client.clName}</td>
                <td>{client.clAdr}</td>
                <td>{client.clTel}</td>
                <td>{client.clMF}</td>
                <td>{client.clRC}</td>
                <td>{client.responsable}</td>
                <td>{client.resTel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Client;
