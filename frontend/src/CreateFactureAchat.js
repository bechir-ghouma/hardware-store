import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function CreateFactureVente({ selectedFacture }) {
  const [fssName, setfssName] = useState('');
//  ahou kifeh kenet const [client_id, setClientCode] = useState('');
  const [fssID, setfssCode] = useState('');
  const [date, setDate] = useState('');
  const [DT, setDT] = useState('1.000');
  const [inputs, setInputs] = useState([{ refAr: '', quantité: '', price: 0, remise: 0 }]);
  const [references, setReferences] = useState([]);
  const [filteredfss, setFilteredfss] = useState([]);

  const remiseInputRef = useRef(null);

  useEffect(() => {
    axios.get('http://localhost:7777/article')
      .then(res => {
        setReferences(res.data.map(article => article.ref));
      })
      .catch(err => console.log('Error fetching articles:', err));
  }, []);
  useEffect(() => {
    if (selectedFacture) {
      console.log('Selected Facture in CreateFactureAchat:', selectedFacture);
      setfssName(selectedFacture.fssName || '');
      setfssCode(selectedFacture.fssID || '');
      setDate(selectedFacture.date || '');
      setDT(selectedFacture.DT || '1.000');
      setInputs(selectedFacture.articles || [{ refAr: '', quantité: '', price: 0, remise: 0 }]);
    }
  }, [selectedFacture]);

  const handleAddInput = () => {
    const isEmpty = inputs.some(input => input.refAr === '' || input.quantité === '' || input.remise === '');
    if (isEmpty) {
      alert("Veuillez remplir tous les champs de la ligne précédente avant d'ajouter une nouvelle ligne.");
      return;
    }
    setInputs([...inputs, { refAr: '', price: 0, quantité: '', remise: 0 }]);
  };
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleAddInput();
    }
  };
  const fetchPriceByReference = (reference, index) => {
    axios.get(`http://localhost:7777/factureVente/${reference}`)
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
  const handleQuantityChange = (event, index) => {
    const { value } = event.target;
    const newInputs = [...inputs];
    newInputs[index].quantité = value;
  
    // Check if value is a valid number
    if (!isNaN(value) && value !== '') {
      axios.get(`http://localhost:7777/article/${newInputs[index].refAr}/quantity`)
        .then(res => {
          const availableQuantity = res.data.quantity;
          const remainingQuantity = availableQuantity + parseInt(value);
  
          // if (remainingQuantity < 0) {
          //   alert(`La quantité souhaitée n'est pas suffisante, vous n'avez que ${availableQuantity} pièces de cet article`);
          //   newInputs[index].quantité = availableQuantity; // Setting the input quantity to available quantity
          // }
  
          setInputs(newInputs);
        })
        .catch(err => console.error('Error fetching quantity:', err));
    } 
    // else {
    //   alert('Veuillez entrer une quantité valide.');
    // }
  };
  const handleRemiseChange = (event, index) => {
    const { value } = event.target;
    const newInputs = [...inputs];
    newInputs[index].remise = value;
    setInputs(newInputs);
  };
    const calculateTotal = () => {
    if (!inputs) return 0;
    const total = inputs.reduce((acc, curr) => acc + (curr.price * curr.quantité) * (1 - (curr.remise / 100)), 0) + parseFloat(DT);
    return total.toFixed(3);
  };
    const updateStock = async (inputs) => {
    try {
      for (const input of inputs) {
        if (!isNaN(input.quantité) && input.quantité !== '') {
          const response = await axios.put(`http://localhost:7777/article/${input.refAr}/updateStockAchat`, { quantity: input.quantité });
          console.log(`Stock updated for ${input.refAr}:`, response.data);
        }
      }
    } catch (error) {
      console.error('Error updating stock:', error);
    }
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
    const payload = {
      fssName,
      fssID,
      date,
      DT,
      refAr: refArArray,
      totalPrice
    };

    console.log("Sending payload:", payload); // Log payload for debugging

    try {
      const res = await axios.post('http://localhost:7777/factureAchat/createFacAchat/', payload);
      console.log(res.data);
      await updateStock(refArArray); 
      window.location.reload();
    } catch (err) {
      console.log("Error creating facture d'achat:", err);
      if (err.response && err.response.data) {
        console.error("Server response:", err.response.data); // Log server response
      }
    }
};
  const handleClientSelect = (name, code) => {
    setfssName(name);
    setfssCode(code);
    setFilteredfss([]);
  };

  // Function to handle changes in the name input
  const handleClientChange = (e) => {
    const { value } = e.target;
    setfssName(value);

    axios.get(`http://localhost:7777/fss/search?name=${value}`)
      .then(res => {
        setFilteredfss(res.data);
        if (res.data.length > 0) {
          setfssCode(res.data[0].fssID);
        } else {
          setfssCode('');
        }
      })
      .catch(err => console.log('Error fetching clients:', err));
  };

  // Function to handle changes in the ID input
  const handleClientCodeChange = (e) => {
    const { value } = e.target;
    setfssCode(value);

    axios.get(`http://localhost:7777/fss/search?id=${value}`)
      .then(res => {
        if (res.data.length > 0) {
          setfssName(res.data[0].fssName);
        } else {
          setfssName('');
        }
      })
      .catch(err => console.log('Error fetching client name:', err));
  };

  const handleClientBlur = () => {
    setFilteredfss([]);
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
      const res = await axios.put(`http://localhost:7777/factureAchat/update/${selectedFacture.id}`, {
        fssName,
        fssID,
        date,
        DT,
        articles: refArArray,
        totalPrice
      });
      console.log(res.data);
      await updateStock(refArArray);
      window.location.reload();
    } catch (err) {
      console.log('Error updating facture:', err);
    }
  };
  const handleClear = () => {
    setfssName('');
    setfssCode('');
    setDate('');
    setDT('1.000');
    setInputs([{ refAr: '', quantité: '', price: 0, remise: 0 }]);
  };
  return (
    <div style={{ margin: '20px', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flex: '1' }}>
        <div>
          <div style={{ marginBottom: '20px' }} >
            <label style={{ width: '120px' }} htmlFor="code-client">Code fournisseur:</label>
            <input
              style={{ width: '200px' }}
              type="text"
              id="code-client"
              name="code-client"
              value={fssID}
              onChange={handleClientCodeChange}
            />
          </div>
          <div style={{ marginBottom: '20px', position: 'relative' }}>
            <label style={{ width: '120px' }} htmlFor="client">Nom du fournisseur</label>
            <input
              style={{ width: '200px' }}
              type="text"
              id="client"
              value={fssName}
              onChange={handleClientChange}
              onBlur={handleClientBlur}
            />
            {filteredfss.length > 0 && (
              <div style={{ position: 'absolute', top: '100%', left: 0, backgroundColor: 'white', border: '1px solid #ccc', width: '100%' }}>
                {filteredfss.map((fss, index) => (
                  <div key={index} style={{ padding: '5px', cursor: 'pointer' }} 
                  onClick={() => handleClientSelect(fss.fssName, fss.fssID)}
                  >
                     {fss.fssName}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ width: '120px' }} htmlFor="date">Date</label>
            <input
              style={{ width: '200px' }}
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ width: '120px' }} htmlFor="DT">Droit de timbre</label>
            <input
              style={{ width: '200px' }}
              type="text"
              id="DT"
              value={DT}
              onChange={(e) => setDT(e.target.value)}
            />
          </div>
        </div>
        <div>
          {inputs.map((input, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ flex: '1', marginRight: '10px' }}>
                <label>Référence d'article</label>
                <input
                  list="references"
                  style={{ width: '100%' }}
                  value={input.refAr}
                  onChange={(e) => handleReferenceChange(e, index)}
                />
                <datalist id="references">
                  {references.map((reference, idx) => (
                    <option key={idx} value={reference} />
                  ))}
                </datalist>
              </div>
              <div style={{ flex: '1', marginRight: '10px' }}>
                <label>Prix vente TTC</label>
                <input
                  type="number"
                  style={{ width: '100%' }}
                  value={input.price}
                  readOnly
                />
              </div>
              <div style={{ flex: '1', marginRight: '10px' }}>
                <label>Quantité</label>
                <input
                  type="number"
                  style={{ width: '100%' }}
                  value={input.quantité}
                  onChange={(e) => handleQuantityChange(e, index)}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ flex: '1' }}>
                  <label>Remise</label>
                  <input
                    type="number"
                    style={{ width: '100%' }}
                    value={input.remise}
                    onChange={(e) => handleRemiseChange(e, index)}
                    onKeyDown={handleKeyPress}
                    ref={remiseInputRef}
                  />
                </div>
                <div style={{ marginLeft: '10px' }}>
                  <button type="button" onClick={handleAddInput}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div>
          <div style={{ display: "inline-block", marginBottom: '20px', textAlign: 'center' }}>
            <button
              style={{ width: '200px', marginBottom: '10px' }}
              type="button"
              onClick={handleSubmit}
            >
              Ajouter
            </button>
            <button
              style={{ width: '200px', marginBottom: '10px' }}
              type="submit"
              onClick={handleUpdate}
            >
              {selectedFacture ? 'Mettre à jour' : 'Enregistrer'}
            </button><br />
            <button
              style={{ width: '200px', marginBottom: '10px' }}
              type="button"
              onClick={handleClear}
            >
              Vider les champs
            </button>
          </div>
        </div>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label>Total</label>
        <input
        // type='text'
        style={{ width: '100%' }}
        value={calculateTotal()}
        readOnly
      />
      </div>
    </div>
  );
}

export default CreateFactureVente;
