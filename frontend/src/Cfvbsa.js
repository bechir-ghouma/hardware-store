import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function Cfvbsa({ selectedFacture }) {
  const [clName, setClName] = useState('Comptoir');
  const [client_id, setClientCode] = useState('13');
  const [date, setDate] = useState('');
  const [DT, setDT] = useState('1.000');
  const [inputs, setInputs] = useState([{ refAr: '', quantité: '', price: 0, remise: 0 }]);
  const [references, setReferences] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);

  const remiseInputRef = useRef(null);

  useEffect(() => {
    axios.get('http://localhost:7777/articlesbsv')
      .then(res => {
        console.log('Fetched Articles:', res.data);
        const parsedArticles = res.data;
        setReferences(parsedArticles.map(article => article.refAr));
        setInputs(parsedArticles);
      })
      .catch(err => console.log('Error fetching articles:', err));
  }, []);
  
  useEffect(() => {
    if (selectedFacture) {
      console.log('Selected Facture in CreateFactureVente:', selectedFacture);
      setClName(selectedFacture.clName || '');
      setClientCode(selectedFacture.client_id || '');
      setDate(selectedFacture.date || '');
      setDT(selectedFacture.DT || '1.000');
      setInputs(selectedFacture.articles || [{ refAr: '', quantité: '', price: 0, remise: 0 }]);
    }
  }, [selectedFacture]);

  const fetchPriceByReference = (reference, index) => {
    axios.get(`http://localhost:7777/cfvbs/${reference}`)
      .then(res => {
        const price = res.data.price;
        const newInputs = [...inputs];
        newInputs[index].price = price;
        setInputs(newInputs);
      })
      .catch(err => console.log('Error fetching price:', err));
  };

  const handleReferenceChange = (event, index) => {
    const { value } = event.target;
    const newInputs = [...inputs];
    newInputs[index].refAr = value;
    setInputs(newInputs);
    fetchPriceByReference(value, index);
  };

  const handleRemiseChange = (event, index) => {
    const { value } = event.target;
    const newInputs = [...inputs];
    newInputs[index].remise = value;
    setInputs(newInputs);
  };

  const handleQuantityChange = (event, index) => {
    const { value } = event.target;
    const newInputs = [...inputs];
    newInputs[index].quantité = value;

    if (!isNaN(value) && value !== '') {
      axios.get(`http://localhost:7777/article/${newInputs[index].refAr}/quantity`)
        .then(res => {
          const availableQuantity = res.data.quantity;
          const remainingQuantity = availableQuantity - parseInt(value);

          if (remainingQuantity < 0) {
            alert(`La quantité souhaitée n'est pas suffisante, vous n'avez que ${availableQuantity} pièces de cet article`);
            newInputs[index].quantité = availableQuantity; 
          }

          setInputs(newInputs);
        })
        .catch(err => console.error('Error fetching quantity:', err));
    } else {
      alert('Veuillez entrer une quantité valide.');
    }
  };

  const handleAddInput = () => {
    const isEmpty = inputs.some(input => input.refAr === '' || input.quantité === '' || input.remise === '');
    if (isEmpty) {
      alert("Veuillez remplir tous les champs de la ligne précédente avant d'ajouter une nouvelle ligne.");
      return;
    }
    setInputs([...inputs, { refAr: '', price: 0, quantité: '', remise: 0 }]);
  };

  const calculateTotal = () => {
    if (!inputs) return 0;
    const total = inputs.reduce((acc, curr) => acc + (curr.price * curr.quantité) * (1 - (curr.remise / 100)), 0) + parseFloat(DT);
    return total.toFixed(3);
  };

const handleSubmit = async (event) => {
    event.preventDefault();
  
    const nonEmptyInputs = inputs.filter(input => input.refAr !== '' && input.quantité !== '' && input.remise !== '');
    const invalidReference = nonEmptyInputs.some(input => !references.includes(input.refAr));
  
    if (invalidReference) {
      alert("Sélectionner une référence valide");
      return;
    }
  
    const refArArray = nonEmptyInputs.map(input => ({
      refAr: input.refAr,
      price: input.price,
      quantité: input.quantité,
      remise: input.remise
    }));
  
    const totalPrice = calculateTotal();
    try {
      console.log('Submitting data:', {
        clName,
        client_id,
        date,
        DT,
        refAr: refArArray,
        totalPrice
      });
  
      const res = await axios.post('http://localhost:7777/cfvbs/', {
        clName,
        client_id,
        date,
        DT,
        refAr: refArArray,
        totalPrice
      });
  
      console.log('Response:', res.data);
      handleClear(); // Clear the form and table after successful submission
      window.location.reload();
    } catch (err) {
      console.error('Error creating facture:', err.response ? err.response.data : err);
    }
  };
  

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleAddInput();
    }
  };

  const handleClientSelect = (name, code) => {
    setClName(name);
    setClientCode(code);
    setFilteredClients([]);
  };

  const handleClientChange = (e) => {
    const { value } = e.target;
    setClName(value);

    axios.get(`http://localhost:7777/clients/search?name=${value}`)
      .then(res => {
        setFilteredClients(res.data);
      })
      .catch(err => console.log('Error fetching clients:', err));

    axios.get(`http://localhost:7777/clients/search?name=${value}`)
      .then(res => {
        if (res.data.length > 0) {
          setClientCode(res.data[0].clID);
        } else {
          setClientCode('');
        }
      })
      .catch(err => console.log('Error fetching client code:', err));
  };

  const handleClientBlur = () => {
    setFilteredClients([]);
  };

  const handleClientCodeChange = (e) => {
    const { value } = e.target;
    setClientCode(value);

    axios.get(`http://localhost:7777/clients/search?id=${value}`)
      .then(res => {
        if (res.data.length > 0) {
          setClName(res.data[0].clName);
        } else {
          setClName('');
        }
      })
      .catch(err => console.log('Error fetching client name:', err));
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    const nonEmptyInputs = inputs.filter(input => input.refAr !== '' && input.quantité !== '' && input.remise !== '');
    const invalidReference = nonEmptyInputs.some(input => !references.includes(input.refAr));

    if (invalidReference) {
      alert("Sélectionner une référence valide");
      return;
    }

    const refArArray = nonEmptyInputs.map(input => ({
      refAr: input.refAr,
      price: input.price,
      quantité: input.quantité,
      remise: input.remise
    }));

    const totalPrice = calculateTotal();
    try {
      const res = await axios.put(`http://localhost:7777/cfvbs/update/${selectedFacture.id}`, {
        clName,
        client_id,
        date,
        DT,
        articles: refArArray,
        totalPrice
      });
      console.log(res.data);
      window.location.reload();
    } catch (err) {
      console.log('Error updating facture:', err);
    }
  };
  
  const handleClear = () => {
    setClName('');
    setClientCode('');
    setDate('');
    setDT('1.000');
    setInputs([{ refAr: '', quantité: '', price: 0, remise: 0 }]);
  };

  return (
    <div style={{ margin: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h2 style={{ marginBottom: '20px' }}>{selectedFacture ? 'Modifier Facture Vente' : 'Créer Facture Vente'}</h2>
      <form onSubmit={selectedFacture ? handleUpdate : handleSubmit} style={{ width: '100%', maxWidth: '600px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Nom du client:</label>
          <input
            type="text"
            value={clName}
            onChange={handleClientChange}
            onBlur={handleClientBlur}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', marginBottom: '5px' }}
          />
          {filteredClients.length > 0 && (
            <ul style={{ listStyleType: 'none', padding: '0', margin: '0', border: '1px solid #ddd', borderRadius: '4px', maxHeight: '100px', overflowY: 'auto' }}>
              {filteredClients.map(client => (
                <li key={client.clID} onClick={() => handleClientSelect(client.clName, client.clID)} style={{ padding: '8px', cursor: 'pointer', backgroundColor: '#fff', borderBottom: '1px solid #ddd' }}>
                  {client.clName}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Code client:</label>
          <input
            type="text"
            value={client_id}
            onChange={handleClientCodeChange}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Date:</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>DT:</label>
          <input
            type="text"
            value={DT}
            onChange={e => setDT(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '15px' }}>
          <thead>
            <tr>
              <th style={{ padding: '8px', border: '1px solid #ddd', backgroundColor: '#f1f1f1' }}>Référence Article</th>
              <th style={{ padding: '8px', border: '1px solid #ddd', backgroundColor: '#f1f1f1' }}>Quantité</th>
              <th style={{ padding: '8px', border: '1px solid #ddd', backgroundColor: '#f1f1f1' }}>Prix</th>
              <th style={{ padding: '8px', border: '1px solid #ddd', backgroundColor: '#f1f1f1' }}>Remise</th>
            </tr>
          </thead>
          <tbody>
            {inputs.map((input, index) => (
              <tr key={index}>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  <input
                    type="text"
                    value={input.refAr}
                    onChange={e => handleReferenceChange(e, index)}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  />
                </td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  <input
                    type="text"
                    value={input.quantité}
                    onChange={e => handleQuantityChange(e, index)}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  />
                </td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  <input
                    type="text"
                    value={input.price}
                    readOnly
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', backgroundColor: '#f9f9f9' }}
                  />
                </td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  <input
                    type="text"
                    value={input.remise}
                    onChange={e => handleRemiseChange(e, index)}
                    ref={remiseInputRef}
                    onKeyPress={handleKeyPress}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" onClick={handleAddInput} style={{ padding: '10px 20px', borderRadius: '4px', border: 'none', backgroundColor: '#007bff', color: '#fff', cursor: 'pointer', marginBottom: '15px' }}>
          Ajouter une ligne
        </button>
        <p style={{ fontSize: '16px', fontWeight: 'bold' }}>Total: {calculateTotal()} DT</p>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button type="submit" style={{ padding: '10px 20px', borderRadius: '4px', border: 'none', backgroundColor: '#28a745', color: '#fff', cursor: 'pointer' }}>
            {selectedFacture ? 'Mettre à jour la facture' : 'Créer la facture'}
          </button>
          {/* <button type="button" onClick={handleClear} style={{ padding: '10px 20px', borderRadius: '4px', border: 'none', backgroundColor: '#dc3545', color: '#fff', cursor: 'pointer' }}>
            Effacer
          </button> */}
        </div>
      </form>
    </div>
  );
}

export default Cfvbsa;
