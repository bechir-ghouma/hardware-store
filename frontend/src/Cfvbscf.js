
// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';

// function Cfvbscf({ selectedFacture }) {
//   const [clName, setClName] = useState('');
//   const [client_id, setClientCode] = useState('');
//   const [inputs, setInputs] = useState([{ refAr: '', quantité: '', price: 0, remise: 0 }]);
//   const [references, setReferences] = useState([]);
//   const [filteredClients, setFilteredClients] = useState([]);

//   const remiseInputRef = useRef(null);

//   useEffect(() => {
//     axios.get('http://localhost:7777/article')
//       .then(res => {
//         setReferences(res.data.map(article => article.ref));
//       })
//       .catch(err => console.log('Error fetching articles:', err));
//   }, []);

//   useEffect(() => {
//     if (selectedFacture) {
//       console.log('Selected Facture in CreateFactureVente:', selectedFacture);
//       setClName(selectedFacture.clName || '');
//       setClientCode(selectedFacture.client_id || '');
//       setInputs(selectedFacture.articles || [{ refAr: '', quantité: '', price: 0, remise: 0 }]);
//     }
//   }, [selectedFacture]);

//   const fetchPriceByReference = (reference, index) => {
//     axios.get(`http://localhost:7777/factureVente/${reference}`)
//       .then(res => {
//         const price = res.data.price;
//         const newInputs = [...inputs];
//         newInputs[index].price = price;
//         setInputs(newInputs);
//       })
//       .catch(err => console.log('Error fetching price:', err));
//   };

//   const handleReferenceChange = (event, index) => {
//     const { value } = event.target;
//     const newInputs = [...inputs];
//     newInputs[index].refAr = value;
//     setInputs(newInputs);
//     fetchPriceByReference(value, index);
//   };

//   const handleRemiseChange = (event, index) => {
//     const { value } = event.target;
//     const newInputs = [...inputs];
//     newInputs[index].remise = value;
//     setInputs(newInputs);
//   };

//   const handleQuantityChange = (event, index) => {
//     const { value } = event.target;
//     const newInputs = [...inputs];
//     newInputs[index].quantité = value;

//     if (!isNaN(value) && value !== '') {
//       axios.get(`http://localhost:7777/article/${newInputs[index].refAr}/quantity`)
//         .then(res => {
//           const availableQuantity = res.data.quantity;
//           const remainingQuantity = availableQuantity - parseInt(value);

//           if (remainingQuantity < 0) {
//             alert(`La quantité souhaitée n'est pas suffisante, vous n'avez que ${availableQuantity} pièces de cet article`);
//             newInputs[index].quantité = availableQuantity; // Setting the input quantity to available quantity
//           }

//           setInputs(newInputs);
//         })
//         .catch(err => console.error('Error fetching quantity:', err));
//     } else {
//       // Handle case where value is not a valid number
//       alert('Veuillez entrer une quantité valide.');
//     }
//   };

//   const handleAddInput = () => {
//     const isEmpty = inputs.some(input => input.refAr === '' || input.quantité === '' || input.remise === '');
//     if (isEmpty) {
//       alert("Veuillez remplir tous les champs de la ligne précédente avant d'ajouter une nouvelle ligne.");
//       return;
//     }
//     setInputs([...inputs, { refAr: '', price: 0, quantité: '', remise: 0 }]);
//   };

//   const calculateTotal = () => {
//     if (!inputs) return 0;
//     const total = inputs.reduce((acc, curr) => acc + (curr.price * curr.quantité) * (1 - (curr.remise / 100)), 0);
//     return total.toFixed(3);
//   };

//   const updateStock = async (inputs) => {
//     try {
//       for (const input of inputs) {
//         if (!isNaN(input.quantité) && input.quantité !== '') {
//           const response = await axios.put(`http://localhost:7777/article/${input.refAr}/updateStock`, { quantity: input.quantité });
//           console.log(`Stock updated for ${input.refAr}:`, response.data);
//         }
//       }
//     } catch (error) {
//       console.error('Error updating stock:', error);
//     }
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const nonEmptyInputs = inputs.filter(input => input.refAr !== '' && input.quantité !== '' && input.remise !== '');
//     const invalidReference = nonEmptyInputs.some(input => !references.includes(input.refAr));

//     if (invalidReference) {
//       alert("Sélectionner une référence valide");
//       return;
//     }

//     const refArArray = nonEmptyInputs.map(input => ({
//       refAr: input.refAr,
//       price: input.price,
//       quantité: input.quantité,
//       remise: input.remise
//     }));

//     const totalPrice = calculateTotal();
//     try {
//       const res = await axios.post('http://localhost:7777/factureVente/cfvbscf/', {
//         clName,
//         client_id: client_id || 0, // Provide default value if client_id is empty
//         refAr: refArArray,
//         totalPrice
//       });
//       console.log(res.data);
//       await updateStock(refArArray);
//       window.location.reload();
//     } catch (err) {
//       console.log('Error creating facture:', err);
//     }
//   };

//   const handleUpdate = async (event) => {
//     event.preventDefault();
  
//     if (!selectedFacture || !selectedFacture.id) {
//       alert("No facture selected for update.");
//       return;
//     }
    
//     console.log('Selected Facture ID:', selectedFacture.id);
  
//     const nonEmptyInputs = inputs.filter(input => input.refAr !== '' && input.quantité !== '' && input.remise !== '');
//     const invalidReference = nonEmptyInputs.some(input => !references.includes(input.refAr));
  
//     if (invalidReference) {
//       alert("Sélectionner une référence valide");
//       return;
//     }
  
//     const refArArray = nonEmptyInputs.map(input => ({
//       refAr: input.refAr,
//       price: input.price,
//       quantité: input.quantité,
//       remise: input.remise
//     }));
  
//     const totalPrice = calculateTotal();
//     try {
//       const res = await axios.put(`http://localhost:7777/factureVente/update/${selectedFacture.id}`, {
//         clName,
//         client_id: client_id || 0, // Provide default value if client_id is empty
//         articles: refArArray,
//         totalPrice: totalPrice || 0 // Provide default value if totalPrice is empty
//       });
//       console.log(res.data);
//       await updateStock(refArArray);
//       window.location.reload();
//     } catch (err) {
//       console.log('Error updating facture:', err);
//     }
//   };

//   const handleKeyPress = (event) => {
//     if (event.key === 'Enter') {
//       handleAddInput();
//     }
//   };

//   const handleClientSelect = (name, code) => {
//     setClName(name);
//     setClientCode(code);
//     setFilteredClients([]);
//   };

//   const handleClientChange = (e) => {
//     const { value } = e.target;
//     setClName(value);

//     axios.get(`http://localhost:7777/clients/search?name=${value}`)
//       .then(res => {
//         setFilteredClients(res.data);
//       })
//       .catch(err => console.log('Error fetching clients:', err));

//     axios.get(`http://localhost:7777/clients/search?name=${value}`)
//       .then(res => {
//         if (res.data.length > 0) {
//           setClientCode(res.data[0].clID);
//         } else {
//           setClientCode('');
//         }
//       })
//       .catch(err => console.log('Error fetching client code:', err));
//   };

//   const handleClientBlur = () => {
//     setFilteredClients([]);
//   };

//   const handleClientCodeChange = (e) => {
//     const { value } = e.target;
//     setClientCode(value);

//     axios.get(`http://localhost:7777/clients/search?id=${value}`)
//       .then(res => {
//         if (res.data.length > 0) {
//           setClName(res.data[0].clName);
//         } else {
//           setClName('');
//         }
//       })
//       .catch(err => console.log('Error fetching client name:', err));
//   };

//   const handleClear = () => {
//     setClName('');
//     setClientCode('');
//     setInputs([{ refAr: '', quantité: '', price: 0, remise: 0 }]);
//   };

// return (
//   <div style={{ margin: '20px', justifyContent: 'center' }}>
//     <div style={{ display: 'flex', flex: '1' }}>
//       <div>
//         <div style={{ marginBottom: '20px' }}>
//           <label style={{ width: '120px' }} htmlFor="code-client">Code client:</label>
//           <input
//             style={{ width: '200px' }}
//             type="text"
//             id="code-client"
//             name="code-client"
//             value={client_id}
//             onChange={handleClientCodeChange}
//           />
//         </div>
//         <div style={{ marginBottom: '20px', position: 'relative' }}>
//           <label style={{ width: '120px' }} htmlFor="client">Nom du client</label>
//           <input
//             style={{ width: '200px' }}
//             type="text"
//             id="client"
//             value={clName}
//             onChange={handleClientChange}
//             onBlur={handleClientBlur}
//           />
//           {filteredClients.length > 0 && (
//             <div style={{ position: 'absolute', top: '100%', left: 0, backgroundColor: 'white', border: '1px solid #ccc', width: '100%' }}>
//               {filteredClients.map((client, index) => (
//                 <div key={index} style={{ padding: '5px', cursor: 'pointer' }} onClick={() => handleClientSelect(client.clName, client.clID)}>
//                   {client.clName}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//       <div>
//         {inputs.map((input, index) => (
//           <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
//             <div style={{ flex: '1', marginRight: '10px' }}>
//               <label>Référence d'article</label>
//               <input
//                 list="references"
//                 style={{ width: '100%' }}
//                 value={input.refAr}
//                 onChange={(e) => handleReferenceChange(e, index)}
//               />
//               <datalist id="references">
//                 {references.map((reference, idx) => (
//                   <option key={idx} value={reference} />
//                 ))}
//               </datalist>
//             </div>
//             <div style={{ flex: '1', marginRight: '10px' }}>
//               <label>Prix vente TTC</label>
//               <input
//                 type="number"
//                 style={{ width: '100%' }}
//                 value={input.price}
//                 readOnly
//               />
//             </div>
//             <div style={{ flex: '1', marginRight: '10px' }}>
//               <label>Quantité</label>
//               <input
//                 type="number"
//                 style={{ width: '100%' }}
//                 value={input.quantité}
//                 onChange={(e) => handleQuantityChange(e, index)}
//               />
//             </div>
//             <div style={{ display: 'flex', alignItems: 'center' }}>
//               <div style={{ flex: '1' }}>
//                 <label>Remise</label>
//                 <input
//                   type="number"
//                   style={{ width: '100%' }}
//                   value={input.remise}
//                   onChange={(e) => handleRemiseChange(e, index)}
//                   onKeyDown={handleKeyPress}
//                   ref={remiseInputRef}
//                 />
//               </div>
//               <div style={{ marginLeft: '10px' }}>
//                 <button type="button" onClick={handleAddInput}>+</button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//       <div>
//         <div style={{ display: "inline-block", marginBottom: '20px', textAlign: 'center' }}>
//           <button
//             style={{ width: '200px', marginBottom: '10px' }}
//             type="button"
//             onClick={handleSubmit}
//           >
//             Ajouter
//           </button>
//           <button
//             style={{ width: '200px', marginBottom: '10px' }}
//             type="submit"
//             onClick={handleUpdate}
//           >
//             {selectedFacture ? 'Mettre à jour' : 'Enregistrer'}
//           </button><br />
//           <button
//             style={{ width: '200px', marginBottom: '10px' }}
//             type="button"
//             onClick={handleClear}
//           >
//             Vider les champs
//           </button>
//         </div>
//       </div>
//     </div>
//     <div style={{ marginBottom: '20px' }}>
//       <label>Total</label>
//       <input
//         style={{ width: '100%' }}
//         value={calculateTotal()}
//         readOnly
//       />
//     </div>
//   </div>
// );
// }

// export default Cfvbscf;
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function Cfvbscf({ selectedFacture }) {
  const [clName, setClName] = useState('');
  const [client_id, setClientCode] = useState('');
  const [inputs, setInputs] = useState([{ refAr: '', quantité: '', price: 0, remise: 0 }]);
  const [references, setReferences] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);

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
      console.log('Selected Facture in CreateFactureVente:', selectedFacture);
      setClName(selectedFacture.clName || '');
      setClientCode(selectedFacture.client_id || '');
      setInputs(selectedFacture.articles || [{ refAr: '', quantité: '', price: 0, remise: 0 }]);
    }
  }, [selectedFacture]);

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
            newInputs[index].quantité = availableQuantity; // Setting the input quantity to available quantity
          }

          setInputs(newInputs);
        })
        .catch(err => console.error('Error fetching quantity:', err));
    } else {
      // Handle case where value is not a valid number
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
    const total = inputs.reduce((acc, curr) => acc + (curr.price * curr.quantité) * (1 - (curr.remise / 100)), 0);
    return total.toFixed(3);
  };

  const updateStock = async (inputs) => {
    try {
      for (const input of inputs) {
        if (!isNaN(input.quantité) && input.quantité !== '') {
          const response = await axios.put(`http://localhost:7777/article/${input.refAr}/updateStock`, { quantity: input.quantité });
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
    try {
      const res = await axios.post('http://localhost:7777/factureVente/cfvbscf/', {
        clName,
        client_id: client_id || 0, // Provide default value if client_id is empty
        refAr: refArArray,
        totalPrice
      });
      console.log(res.data);
      await updateStock(refArArray);
      window.location.reload();
    } catch (err) {
      console.log('Error creating facture:', err);
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
  
    if (!selectedFacture || !selectedFacture.id) {
      alert("No facture selected for update.");
      return;
    }
  
    console.log('Selected Facture ID:', selectedFacture.id);
  
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
      const res = await axios.put(`http://localhost:7777/factureVentecf/update/${selectedFacture.id}`, {
        clName,
        client_id: client_id || 0, 
        articles: refArArray,
        totalPrice: totalPrice || 0
      });
      console.log(res.data);
  
      if (res.status === 200) {
        await updateStock(refArArray);
        // alert("Facture updated successfully");
        // Optionally, you can also update the local state instead of reloading the entire window
        window.location.reload();
      } else {
        alert('Error updating facture');
        console.log('Error:', res.data);
      }
    } catch (err) {
      console.log('Error updating facture:', err);
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

  const handleClear = () => {
    setClName('');
    setClientCode('');
    setInputs([{ refAr: '', quantité: '', price: 0, remise: 0 }]);
  };


return (
  <div style={{ margin: '20px', justifyContent: 'center' }}>
    <div style={{ display: 'flex', flex: '1' }}>
      <div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ width: '120px' }} htmlFor="code-client">Code client:</label>
          <input
            style={{ width: '200px' }}
            type="text"
            id="code-client"
            name="code-client"
            value={client_id}
            onChange={handleClientCodeChange}
          />
        </div>
        <div style={{ marginBottom: '20px', position: 'relative' }}>
          <label style={{ width: '120px' }} htmlFor="client">Nom du client</label>
          <input
            style={{ width: '200px' }}
            type="text"
            id="client"
            value={clName}
            onChange={handleClientChange}
            onBlur={handleClientBlur}
          />
          {filteredClients.length > 0 && (
            <div style={{ position: 'absolute', top: '100%', left: 0, backgroundColor: 'white', border: '1px solid #ccc', width: '100%' }}>
              {filteredClients.map((client, index) => (
                <div key={index} style={{ padding: '5px', cursor: 'pointer' }} onClick={() => handleClientSelect(client.clName, client.clID)}>
                  {client.clName}
                </div>
              ))}
            </div>
          )}
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
        style={{ width: '100%' }}
        value={calculateTotal()}
        readOnly
      />
    </div>
  </div>
);
}

export default Cfvbscf;
