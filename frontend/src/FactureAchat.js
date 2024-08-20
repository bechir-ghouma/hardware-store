import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import CreateFactureAchat from './CreateFactureAchat';
import { FaSearch } from 'react-icons/fa';

Modal.setAppElement('#root');

function FactureAchat() {
  const [fAchat, setFAchat] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedFacture, setSelectedFacture] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');


  useEffect(() => {
    axios
      .get('http://localhost:7777/factureAchat/')
      .then((res) => {
        console.log('API Response:', res.data);
        const formattedFAchat = res.data.map((facture) => {
          const date = new Date(facture.date);
          const formattedDate = date.toISOString().split('T')[0];
          let articlesArray = [];

          try {
            articlesArray = JSON.parse(facture.articles);
          } catch (e) {
            console.error('Error parsing articles JSON:', e);
          }

          return {
            ...facture,
            date: formattedDate,
            articles: articlesArray, // Set the parsed array
          };
        });
        setFAchat(formattedFAchat);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = async () => {
    const id = selectedFacture?.id;
    if (!id) return;
    try {
      await axios.delete(`http://localhost:7777/factureAchat/${id}`);
      setFAchat(fAchat.filter((facture) => facture.id !== id));
      setSelectedFacture(null); 
      setSelectedRow(null);
    } catch (err) {
      console.log(err);
    }
  };
  const filteredFAchat = fAchat.filter((facture) => {
    return (
      facture.fssName?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
      facture.articles.some(article => article.refAr.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });
  
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleSubmit = (newFactureData) => {
    axios.post('http://localhost:7777/factureAchat/', newFactureData)
      .then(res => {
        console.log(res);
        setModalIsOpen(false);
        setFAchat([...fAchat, res.data]);
      })
      .catch(err => console.log('Error creating facture:', err));
  };

  return (
    <div>
      <CreateFactureAchat onFactureSubmit={handleSubmit} selectedFacture={selectedFacture} />
      <button onClick={() => setModalIsOpen(true)}>Voir les factures d'achat</button>
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
          <h2 className="mb-4">Factures d'achat' :</h2>
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
        <button
        onClick={handleDelete}
        >Supprimer</button>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Id</th>
                <th>Code fss</th>
                <th>Nom du fss</th>
                <th>Articles</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredFAchat.length > 0 ? (
                filteredFAchat.map((facture, index) => (
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
                    <td>{facture.fssID}</td>
                    <td>{facture.fssName}</td>
                    <td>
                      {Array.isArray(facture.articles) && facture.articles.length > 0 ? (
                        facture.articles.map((article, i) => (
                          <span key={i}>
                            {`${article.refAr}: ${article.quantité} | `}
                          </span>
                        ))
                      ) : (
                        <span>No articles</span>
                      )}
                    </td>
                    <td>{facture.totalPrice}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">Loading...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Modal>
    </div>
  );
}

export default FactureAchat;
