import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import Cfvbscf from './Cfvbscf';
import 'bootstrap/dist/css/bootstrap.min.css';

Modal.setAppElement('#root');

function Fvbscf() {
  const [fVente, setFVente] = useState([]);
  const [ssortieVente, setSSortieVente] = useState([]);
  const [selectedFacture, setSelectedFacture] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:7777/fvbscf/')
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
      .catch((err) => console.log(err));

    axios.get('http://localhost:7777/ssortieventecf')
      .then((res) => {
        setSSortieVente(res.data);
      })
      .catch((err) => console.log('Error fetching ssortievente data:', err));
  }, []);

  const handleDelete = async () => {
    const id = selectedFacture?.id;
    if (!id) {
      console.log("No selected facture id");
      return;
    }
    try {
      console.log(`Deleting facture with id: ${id}`);
      await axios.delete(`http://localhost:7777/factureVentecf/${id}`);
      setFVente(fVente.filter((facture) => facture.id !== id));
      setSSortieVente(ssortieVente.filter((entry, entryIndex) => {
        const articles = JSON.parse(entry.articles);
        return articles.some((article, articleIndex) => {
          const rowId = `${entryIndex}-${articleIndex}`;
          return rowId !== selectedRowId;
        });
      }));
      setSelectedFacture(null);
      setSelectedRowId(null);
    } catch (err) {
      console.log("Error during delete request:", err);
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

  const handleRowClick = (id, facture) => {
    setSelectedFacture(facture);
    setSelectedRowId(id);
  };

  const handleCreateFactureClick = () => {
    navigate('/cfvbscfa', { state: { selectedFacture } });
  };

  return (
    <div className="facture-vente-container">
      <Cfvbscf onFactureSubmit={handleSubmit} selectedFacture={selectedFacture} />
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
              {ssortieVente.map((entry, entryIndex) => {
                const articles = JSON.parse(entry.articles);
                return articles.map((article, articleIndex) => {
                  const id = `${entryIndex}-${articleIndex}`;
                  const facture = {
                    id: entry.id,
                    articles,
                    clName: entry.clName,
                    client_id: entry.client_id
                  };
                  return (
                    <tr
                      key={id}
                      onClick={() => handleRowClick(id, facture)}
                      className={selectedRowId === id ? 'table-active' : ''}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>{article.refAr}</td>
                      <td>{article.price}</td>
                      <td>{article.quantité}</td>
                      <td>{article.remise}</td>
                    </tr>
                  );
                });
              })}
            </tbody>
          </table>
          <button onClick={handleCreateFactureClick}>Créer facture</button>
        </div>
      </Modal>
    </div>
  );
}

export default Fvbscf;
