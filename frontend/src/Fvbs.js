import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import Cfvbs from './Cfvbs';
import 'bootstrap/dist/css/bootstrap.min.css';

Modal.setAppElement('#root');

function Fvbs() {
  const [fVente, setFVente] = useState([]);
  const [ssortieVente, setSSortieVente] = useState([]);
  const [selectedFacture, setSelectedFacture] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:7777/fvbs/')
      .then((res) => {
        const formattedFVente = res.data.map((facture) => {
          const date = new Date(facture.date);
          const formattedDate = date.toISOString().split('T')[0];
          return {
            ...facture,
            date: formattedDate,
          };
        });
        setFVente(formattedFVente);
      })
      .catch((err) => console.log('Error fetching fvbs data:', err));

    axios.get('http://localhost:7777/ssortievente')
      .then((res) => {
        setSSortieVente(res.data);
      })
      .catch((err) => console.log('Error fetching ssortievente data:', err));
  }, []);

  const handleDelete = async () => {
    if (!selectedRowId) {
      console.log("No facture selected for deletion");
      return;
    }
    try {
      await axios.delete(`http://localhost:7777/fvbs/${selectedRowId}`);
      setFVente(fVente.filter((facture) => facture.id !== parseInt(selectedRowId)));
      setSSortieVente(ssortieVente.filter((entry) => entry.id !== parseInt(selectedRowId)));
      setSelectedFacture(null);
      setSelectedRowId(null);
    } catch (err) {
      console.log('Error deleting facture:', err);
    }
  };

  const handleSubmit = (newFactureData) => {
    axios.post('http://localhost:7777/cfvbs/', newFactureData)
      .then(res => {
        setModalIsOpen(false);
        setFVente([...fVente, res.data]);
      })
      .catch(err => console.log('Error creating facture:', err));
  };

  const handleRowClick = (id, articles) => {
    setSelectedFacture({ articles });
    setSelectedRowId(id);
  };

  const handleCreateFactureClick = () => {
    navigate('/cfvbsa', { state: { selectedFacture } });
  };

  return (
    <div className="facture-vente-container">
      <Cfvbs onFactureSubmit={handleSubmit} selectedFacture={selectedFacture} />
      <button onClick={() => setModalIsOpen(true)}>Voir les produits</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Voir les factures de vente"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            maxWidth: '800px',
            maxHeight: '80vh',
            overflowY: 'auto',
          },
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-4">Factures de vente :</h2>
        </div>
        <button onClick={handleDelete}>Supprimer</button>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Prix</th>
                <th>Quantité</th>
                <th>Remise</th>
              </tr>
            </thead>
            <tbody>
              {ssortieVente.length > 0 ? (
                ssortieVente.map((entry) => {
                  let articles;
                  try {
                    articles = JSON.parse(entry.articles);
                  } catch (error) {
                    console.error('Error parsing articles JSON:', error);
                    return null;
                  }

                  return (
                    <tr
                      key={entry.id}
                      onClick={() => handleRowClick(entry.id, articles)}
                      className={selectedRowId === entry.id ? 'table-active' : ''}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>{articles.refAr}</td>
                      <td>{articles.price}</td>
                      <td>{articles.quantité}</td>
                      <td>{articles.remise}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
          <button onClick={handleCreateFactureClick}>Créer facture</button>
        </div>
      </Modal>
    </div>
  );
}

export default Fvbs;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import Modal from 'react-modal';
// import Cfvbs from './Cfvbs';
// import 'bootstrap/dist/css/bootstrap.min.css';

// Modal.setAppElement('#root');

// function Fvbs() {
//   const [fVente, setFVente] = useState([]);
//   const [ssortieVente, setSSortieVente] = useState([]);
//   const [selectedFacture, setSelectedFacture] = useState(null);
//   const [selectedRowId, setSelectedRowId] = useState(null);
//   const [modalIsOpen, setModalIsOpen] = useState(false);

//   const navigate = useNavigate();

//   useEffect(() => {
//     axios.get('http://localhost:7777/fvbs/')
//       .then((res) => {
//         const formattedFVente = res.data.map((facture) => {
//           const date = new Date(facture.date);
//           const formattedDate = date.toISOString().split('T')[0];
//           return {
//             ...facture,
//             date: formattedDate,
//           };
//         });
//         setFVente(formattedFVente);
//       })
//       .catch((err) => console.log('Error fetching fvbs data:', err));

//     axios.get('http://localhost:7777/ssortievente')
//       .then((res) => {
//         setSSortieVente(res.data);
//       })
//       .catch((err) => console.log('Error fetching ssortievente data:', err));
//   }, []);

//   const handleDelete = async () => {
//     if (!selectedRowId) {
//       console.log("No facture selected for deletion");
//     }
//     try {
//       await axios.delete(`http://localhost:7777/fvbs/${selectedRowId}`);
//       setFVente(fVente.filter((facture) => facture.id !== selectedRowId));
//       setSSortieVente(ssortieVente.filter((entry, entryIndex) => `${entryIndex}` !== selectedRowId));
//       setSelectedFacture(null);
//       setSelectedRowId(null);
//     } catch (err) {
//       console.log('Error deleting facture:', err);
//     }
//   };

//   const handleSubmit = (newFactureData) => {
//     axios.post('http://localhost:7777/cfvbs/', newFactureData)
//       .then(res => {
//         setModalIsOpen(false);
//         setFVente([...fVente, res.data]);
//       })
//       .catch(err => console.log('Error creating facture:', err));
//   };

//   const handleRowClick = (id, articles) => {
//     setSelectedFacture({ articles });
//     setSelectedRowId(id);
//   };

//   const handleCreateFactureClick = () => {
//     navigate('/cfvbsa', { state: { selectedFacture } });
//   };

//   return (
//     <div className="facture-vente-container">
//       <Cfvbs onFactureSubmit={handleSubmit} selectedFacture={selectedFacture} />
//       <button onClick={() => setModalIsOpen(true)}>Voir les produits</button>
//       <Modal
//         isOpen={modalIsOpen}
//         onRequestClose={() => setModalIsOpen(false)}
//         contentLabel="Voir les factures de vente"
//         style={{
//           content: {
//             top: '50%',
//             left: '50%',
//             right: 'auto',
//             bottom: 'auto',
//             marginRight: '-50%',
//             transform: 'translate(-50%, -50%)',
//             width: '80%',
//             maxWidth: '800px',
//             maxHeight: '80vh',
//             overflowY: 'auto',
//           },
//         }}
//       >
//         <div className="d-flex justify-content-between align-items-center mb-3">
//           <h2 className="mb-4">Factures de vente :</h2>
//         </div>
//         <button onClick={handleDelete}>Supprimer</button>
//         <div className="table-responsive">
//           <table className="table table-striped">
//             <thead>
//               <tr>
//                 <th>Reference</th>
//                 <th>Prix</th>
//                 <th>Quantité</th>
//                 <th>Remise</th>
//               </tr>
//             </thead>
//             <tbody>
//               {ssortieVente.length > 0 ? (
//                 ssortieVente.map((entry, entryIndex) => {
//                   let articles;
//                   try {
//                     articles = JSON.parse(entry.articles);
//                   } catch (error) {
//                     console.error('Error parsing articles JSON:', error);
//                     return null;
//                   }

//                   const id = `${entry.id}`;
//                   return (
//                     <tr
//                       key={id}
//                       onClick={() => handleRowClick(id, articles)}
//                       className={selectedRowId === id ? 'table-active' : ''}
//                       style={{ cursor: 'pointer' }}
//                     >
//                       <td>{articles.refAr}</td>
//                       <td>{articles.price}</td>
//                       <td>{articles.quantité}</td>
//                       <td>{articles.remise}</td>
//                     </tr>
//                   );
//                 })
//               ) : (
//                 <tr>
//                   <td colSpan="4">No data available</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//           <button onClick={handleCreateFactureClick}>Créer facture</button>
//         </div>
//       </Modal>
//     </div>
//   );
// }

// export default Fvbs;
