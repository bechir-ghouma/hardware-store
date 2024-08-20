import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import CreateFactureVente from './CreateFactureVente';
import { FaSearch } from 'react-icons/fa';

Modal.setAppElement('#root');

function FactureVente() {
  const [fVente, setFVente] = useState([]);
  const [selectedFacture, setSelectedFacture] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    axios
      .get('http://localhost:7777/factureVente/')
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
  }, []);

  const handleDelete = async () => {
    const id = selectedFacture?.id;
    if (!id) return;
    try {
      await axios.delete(`http://localhost:7777/factureVente/${id}`);
      setFVente(fVente.filter((facture) => facture.id !== id));
      setSelectedFacture(null); 
      setSelectedRow(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddFactureVente = (newFactureVente) => {
    setFVente([...fVente, newFactureVente]);
  };

  const filteredFVente = fVente.filter((facture) => {
    return (
      facture.clName?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
      facture.articles.some(article => article.refAr.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleSubmit = (newFactureData) => {
    axios.post('http://localhost:7777/factureVente/', newFactureData)
      .then(res => {
        console.log(res);
        setModalIsOpen(false); 
        setFVente([...fVente, res.data]); 
      })
      .catch(err => console.log('Error creating facture:', err));
  };

  return (
    <div className="facture-vente-container">
      <CreateFactureVente onFactureSubmit={handleSubmit} selectedFacture={selectedFacture} />
      <button onClick={() => setModalIsOpen(true)}>Voir les factures de vente</button>
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
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Rechercher un client ou une référence..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <span className="input-group-text">
              <FaSearch />
            </span>
          </div>
        </div>
        <button onClick={handleDelete}>Supprimer</button>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Id</th>
                <th>Code client</th>
                <th>Nom du client</th>
                <th>Articles</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredFVente.map((facture, index) => (
                <tr
                  key={facture.id}
                  onClick={() => {
                    console.log('Selected Facture:', facture); 
                    setSelectedFacture(facture);
                    setSelectedRow(index);
                  }}
                  className={selectedRow === index ? 'table-active' : ''}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{facture.id}</td>
                  <td>{facture.client_id}</td>
                  <td>{facture.clName}</td>
                  <td>
                    {facture.articles.map((article, i) => (
                      <span key={i}>
                        {`${article.refAr}: ${article.quantité} | `}
                      </span>
                    ))}
                  </td>
                  <td>{facture.totalPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>
    </div>
  );
}

export default FactureVente;
