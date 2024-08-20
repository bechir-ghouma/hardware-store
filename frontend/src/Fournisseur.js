// import React, {useEffect, useState} from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import CreateFournisseur from './CreateFournisseur';


// function Fournisseur() {
//     const [fournisseur,setFournisseur] = useState([])
//     useEffect(() => {
//         axios.get('http://localhost:7777/fournisseur/')
//         .then(res => setFournisseur(res.data))
//         .catch(err => console.log(err));
//     }, [])

//     const handleDelete = async (id) => {
//         try {
//             await axios.delete('http://localhost:7777/fournisseur/'+id)
//             window.location.reload()
//         } catch(err){
//             console.log(err);
//         }
//     }
//     const handleAddFss = (newFss) => {
//         setFournisseur([...fournisseur, newFss]);
//     }
//   return (
//     <div className='article-container'>
//         <div className='w-110 bg-white rounded p-3'>
//         <CreateFournisseur onAddArticle={handleAddFss} /><br />
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
//                     <th>Responsable</th>
//                     <th>Telephone du responsable</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {
//                         fournisseur.map((data,i) => (
//                             <tr key={i}>
//                                 <td>{data.fssID}</td>
//                                 <td>{data.fssName}</td>
//                                 <td>{data.fssAdr}</td>
//                                 <td>{data.fssTel}</td>
//                                 <td>{data.fssMF}</td>
//                                 <td>{data.fssRC}</td>
//                                 <td>{data.fssRES}</td>
//                                 <td>{data.fssRTEL}</td>
//                                 {/* <td>
//                                     <Link to={`update/${data.fssID}`} className='btn btn-primary'>Changer</Link>
//                                     <button className='btn btn-danger ms-2' onClick={e => handleDelete(data.fssID)}>Supprimer</button>
//                                 </td> */}
//                             </tr>
//                         ))
//                     }
//                 </tbody>
//             </table>
//             </div>
//         </div>
//     </div>
//   )
// }

// export default Fournisseur
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CreateFournisseur from './CreateFournisseur';
import './Article.css';   

function Fournisseur() {
  const [fournisseurs, setFournisseurs] = useState([]);
  const [selectedFournisseur, setSelectedFournisseur] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:7777/fournisseur/')
      .then(res => setFournisseurs(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:7777/fournisseur/${id}`);
      setFournisseurs(fournisseurs.filter(fournisseur => fournisseur.fssID !== id));
      setSelectedFournisseur(null);
      setSelectedRow(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddFournisseur = (newFournisseur) => {
    setFournisseurs([...fournisseurs, newFournisseur]);
  };

  return (
    <div className='article-container'>
      <CreateFournisseur onAddFournisseur={handleAddFournisseur} onDelete={handleDelete} selectedFournisseur={selectedFournisseur} />
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
              <th>Responsable</th>
              <th>Telephone du responsable</th>
            </tr>
          </thead>
          <tbody>
            {fournisseurs.map((fournisseur, index) => (
              <tr
                key={fournisseur.fssID}
                onClick={() => {
                  setSelectedFournisseur(fournisseur);
                  setSelectedRow(index);
                }}
                className={selectedRow === index ? 'table-active' : ''}
                style={{ cursor: 'pointer' }}
              >
                <td>{fournisseur.fssID}</td>
                <td>{fournisseur.fssName}</td>
                <td>{fournisseur.fssAdr}</td>
                <td>{fournisseur.fssTel}</td>
                <td>{fournisseur.fssMF}</td>
                <td>{fournisseur.fssRC}</td>
                <td>{fournisseur.fssRES}</td>
                <td>{fournisseur.fssRTEL}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Fournisseur;
