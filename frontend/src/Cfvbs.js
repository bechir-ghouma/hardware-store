import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function Cfvbs({ onFactureSubmit, selectedFacture }) {
  const [inputs, setInputs] = useState([{ refAr: '', quantité: '', price: 0, remise: 0 }]);
  const [references, setReferences] = useState([]);

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
      setInputs(selectedFacture.articles ? [selectedFacture.articles] : [{ refAr: '', quantité: '', price: 0, remise: 0 }]);
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
    const isEmpty = inputs.some(input => input.refAr === '' || input.quantité === '' );
    if (isEmpty) {
      alert("Veuillez remplir tous les champs de la ligne précédente avant d'ajouter une nouvelle ligne.");
      return;
    }
    setInputs([...inputs, { refAr: '', price: 0, quantité: '', remise: 0 }]);
  };

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:7777/ssortievente', { articles: inputs });
      alert("Les articles ont été ajoutés avec succès!");
      onFactureSubmit(inputs);
      window.location.reload();
    } catch (error) {
      console.error('Error posting to ssortievente:', error);
      alert("Une erreur s'est produite lors de l'ajout des articles.");
    }
  }

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

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleAddInput();
    }
  };

  const handleClear = () => {
    setInputs([{ refAr: '', quantité: '', price: 0, remise: 0 }]);
  };

  const calculateTotal = () => {
    return inputs.reduce((total, input) => {
      const quantity = parseFloat(input.quantité) || 0;
      const price = parseFloat(input.price) || 0;
      const remise = parseFloat(input.remise) || 0;
      const lineTotal = (quantity * price) * (1 - remise / 100);
      return total + lineTotal;
    }, 0).toFixed(2);
  };

  const handleClick = async () => {
    await handleAddInput();
    updateStock(inputs);
  };

  return (
    <div style={{ margin: '20px', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flex: '1' }}>
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

export default Cfvbs;



// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';

// function Cfvbs({ onFactureSubmit, selectedFacture }) {
//   const [inputs, setInputs] = useState([{ refAr: '', quantité: '', price: 0, remise: 0 }]);
//   const [references, setReferences] = useState([]);

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
//       const articles = Array.isArray(selectedFacture.articles) ? selectedFacture.articles : [{ refAr: '', quantité: '', price: 0, remise: 0 }];
//       setInputs(articles);
//     }
//   }, [selectedFacture]);

//   const fetchPriceByReference = (reference, index) => {
//     axios.get(`http://localhost:7777/cfvbs/${reference}`)
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
//             newInputs[index].quantité = availableQuantity; 
//           }

//           setInputs(newInputs);
//         })
//         .catch(err => console.error('Error fetching quantity:', err));
//     } else {
//       alert('Veuillez entrer une quantité valide.');
//     }
//   };

//   const handleAddInput = async () => {
//     const isEmpty = inputs.some(input => input.refAr === '' || input.quantité === '' );
//     if (isEmpty) {
//       alert("Veuillez remplir tous les champs de la ligne précédente avant d'ajouter une nouvelle ligne.");
//       return;
//     }
//     setInputs([...inputs, { refAr: '', price: 0, quantité: '', remise: 0 }]);
//   };

//   const handleSubmit = async () => {
//     try {
//       await axios.post('http://localhost:7777/ssortievente', { articles: inputs });
//       alert("Les articles ont été ajoutés avec succès!");
//       window.location.reload()
//     } catch (error) {
//       console.error('Error posting to ssortievente:', error);
//       alert("Une erreur s'est produite lors de l'ajout des articles.");
//     }
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

//   const handleKeyPress = (event) => {
//     if (event.key === 'Enter') {
//       handleAddInput();
//     }
//   };

//   const handleClear = () => {
//     setInputs([{ refAr: '', quantité: '', price: 0, remise: 0 }]);
//   };

//   const calculateTotal = () => {
//     return inputs.reduce((total, input) => {
//       const quantity = parseFloat(input.quantité) || 0;
//       const price = parseFloat(input.price) || 0;
//       const remise = parseFloat(input.remise) || 0;
//       const lineTotal = (quantity * price) * (1 - remise / 100);
//       return total + lineTotal;
//     }, 0).toFixed(2);
//   };

//   const handleClick = async () => {
//     await handleAddInput();
//     updateStock(inputs);
//   };

//   return (
//     <div style={{ margin: '20px', justifyContent: 'center' }}>
//       <div style={{ display: 'flex', flex: '1' }}>
//         <div>
//           {inputs.map((input, index) => (
//             <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
//               <div style={{ flex: '1', marginRight: '10px' }}>
//                 <label>Référence d'article</label>
//                 <input
//                   list="references"
//                   style={{ width: '100%' }}
//                   value={input.refAr}
//                   onChange={(e) => handleReferenceChange(e, index)}
//                 />
//                 <datalist id="references">
//                   {references.map((reference, idx) => (
//                     <option key={idx} value={reference} />
//                   ))}
//                 </datalist>
//               </div>
//               <div style={{ flex: '1', marginRight: '10px' }}>
//                 <label>Prix vente TTC</label>
//                 <input
//                   type="number"
//                   style={{ width: '100%' }}
//                   value={input.price}
//                   readOnly
//                 />
//               </div>
//               <div style={{ flex: '1', marginRight: '10px' }}>
//                 <label>Quantité</label>
//                 <input
//                   type="number"
//                   style={{ width: '100%' }}
//                   value={input.quantité}
//                   onChange={(e) => handleQuantityChange(e, index)}
//                 />
//               </div>
//               <div style={{ display: 'flex', alignItems: 'center' }}>
//                 <div style={{ flex: '1' }}>
//                   <label>Remise</label>
//                   <input
//                     type="number"
//                     style={{ width: '100%' }}
//                     value={input.remise}
//                     onChange={(e) => handleRemiseChange(e, index)}
//                     onKeyDown={handleKeyPress}
//                     ref={remiseInputRef}
//                   />
//                 </div>
//                 <div style={{ marginLeft: '10px' }}>
//                   <button type="button" onClick={handleAddInput}>+</button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//         <div>
//           <div style={{ display: "inline-block", marginBottom: '20px', textAlign: 'center' }}>
//             <button
//               style={{ width: '200px', marginBottom: '10px' }}
//               type="button"
//               onClick={handleSubmit}
//             >
//               Ajouter
//             </button>
//             <button
//               style={{ width: '200px', marginBottom: '10px' }}
//               type="button"
//               onClick={handleClear}
//             >
//               Vider les champs
//             </button>
//           </div>
//         </div>
//       </div>
//       <div style={{ marginBottom: '20px' }}>
//         <label>Total</label>
//         <input
//           style={{ width: '100%' }}
//           value={calculateTotal()}
//           readOnly
//         />
//       </div>
//     </div>
//   );
// }

// export default Cfvbs;
// // import React, { useState, useEffect, useRef } from 'react';
// // import axios from 'axios';

// // function Cfvbs({ onFactureSubmit, selectedFacture }) {
// //   const [inputs, setInputs] = useState([{ refAr: '', quantité: '', price: 0, remise: 0 }]);
// //   const [references, setReferences] = useState([]);

// //   const remiseInputRef = useRef(null);

// //   useEffect(() => {
// //     axios.get('http://localhost:7777/article')
// //       .then(res => {
// //         setReferences(res.data.map(article => article.ref));
// //       })
// //       .catch(err => console.log('Error fetching articles:', err));
// //   }, []);

// //   useEffect(() => {
// //     if (selectedFacture) {
// //       console.log('Selected Facture in CreateFactureVente:', selectedFacture);
// //       setInputs(selectedFacture.articles ? [selectedFacture.articles] : [{ refAr: '', quantité: '', price: 0, remise: 0 }]);
// //     }
// //   }, [selectedFacture]);

// //   const fetchPriceByReference = (reference, index) => {
// //     axios.get(`http://localhost:7777/cfvbs/${reference}`)
// //       .then(res => {
// //         const price = res.data.price;
// //         const newInputs = [...inputs];
// //         newInputs[index].price = price;
// //         setInputs(newInputs);
// //       })
// //       .catch(err => console.log('Error fetching price:', err));
// //   };

// //   const handleReferenceChange = (event, index) => {
// //     const { value } = event.target;
// //     const newInputs = [...inputs];
// //     newInputs[index].refAr = value;
// //     setInputs(newInputs);
// //     fetchPriceByReference(value, index);
// //   };

// //   const handleRemiseChange = (event, index) => {
// //     const { value } = event.target;
// //     const newInputs = [...inputs];
// //     newInputs[index].remise = value;
// //     setInputs(newInputs);
// //   };

// //   const handleQuantityChange = (event, index) => {
// //     const { value } = event.target;
// //     const newInputs = [...inputs];
// //     newInputs[index].quantité = value;

// //     if (!isNaN(value) && value !== '') {
// //       axios.get(`http://localhost:7777/article/${newInputs[index].refAr}/quantity`)
// //         .then(res => {
// //           const availableQuantity = res.data.quantity;
// //           const remainingQuantity = availableQuantity - parseInt(value);

// //           if (remainingQuantity < 0) {
// //             alert(`La quantité souhaitée n'est pas suffisante, vous n'avez que ${availableQuantity} pièces de cet article`);
// //             newInputs[index].quantité = availableQuantity; 
// //           }

// //           setInputs(newInputs);
// //         })
// //         .catch(err => console.error('Error fetching quantity:', err));
// //     } else {
// //       alert('Veuillez entrer une quantité valide.');
// //     }
// //   };

// //   const handleAddInput = () => {
// //     const isEmpty = inputs.some(input => input.refAr === '' || input.quantité === '' );
// //     if (isEmpty) {
// //       alert("Veuillez remplir tous les champs de la ligne précédente avant d'ajouter une nouvelle ligne.");
// //       return;
// //     }
// //     setInputs([...inputs, { refAr: '', price: 0, quantité: '', remise: 0 }]);
// //   };

// //   const handleSubmit = async () => {
// //     try {
// //       await axios.post('http://localhost:7777/ssortievente', { articles: inputs });
// //       alert("Les articles ont été ajoutés avec succès!");
// //       onFactureSubmit(inputs);
// //       window.location.reload();
// //     } catch (error) {
// //       console.error('Error posting to ssortievente:', error);
// //       alert("Une erreur s'est produite lors de l'ajout des articles.");
// //     }
// //   }

// //   const updateStock = async (inputs) => {
// //     try {
// //       for (const input of inputs) {
// //         if (!isNaN(input.quantité) && input.quantité !== '') {
// //           const response = await axios.put(`http://localhost:7777/article/${input.refAr}/updateStock`, { quantity: input.quantité });
// //           console.log(`Stock updated for ${input.refAr}:`, response.data);
// //         }
// //       }
// //     } catch (error) {
// //       console.error('Error updating stock:', error);
// //     }
// //   };

// //   const handleKeyPress = (event) => {
// //     if (event.key === 'Enter') {
// //       handleAddInput();
// //     }
// //   };

// //   const handleClear = () => {
// //     setInputs([{ refAr: '', quantité: '', price: 0, remise: 0 }]);
// //   };

// //   const calculateTotal = () => {
// //     return inputs.reduce((total, input) => {
// //       const quantity = parseFloat(input.quantité) || 0;
// //       const price = parseFloat(input.price) || 0;
// //       const remise = parseFloat(input.remise) || 0;
// //       const lineTotal = (quantity * price) * (1 - remise / 100);
// //       return total + lineTotal;
// //     }, 0).toFixed(2);
// //   };

// //   const handleClick = async () => {
// //     await handleAddInput();
// //     updateStock(inputs);
// //   };

// //   return (
// //     <div style={{ margin: '20px', justifyContent: 'center' }}>
// //       <div style={{ display: 'flex', flex: '1' }}>
// //         <div>
// //           {inputs.map((input, index) => (
// //             <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
// //               <div style={{ flex: '1', marginRight: '10px' }}>
// //                 <label>Référence d'article</label>
// //                 <input
// //                   list="references"
// //                   style={{ width: '100%' }}
// //                   value={input.refAr}
// //                   onChange={(e) => handleReferenceChange(e, index)}
// //                 />
// //                 <datalist id="references">
// //                   {references.map((reference, idx) => (
// //                     <option key={idx} value={reference} />
// //                   ))}
// //                 </datalist>
// //               </div>
// //               <div style={{ flex: '1', marginRight: '10px' }}>
// //                 <label>Prix vente TTC</label>
// //                 <input
// //                   type="number"
// //                   style={{ width: '100%' }}
// //                   value={input.price}
// //                   readOnly
// //                 />
// //               </div>
// //               <div style={{ flex: '1', marginRight: '10px' }}>
// //                 <label>Quantité</label>
// //                 <input
// //                   type="number"
// //                   style={{ width: '100%' }}
// //                   value={input.quantité}
// //                   onChange={(e) => handleQuantityChange(e, index)}
// //                 />
// //               </div>
// //               <div style={{ display: 'flex', alignItems: 'center' }}>
// //                 <div style={{ flex: '1' }}>
// //                   <label>Remise</label>
// //                   <input
// //                     type="number"
// //                     style={{ width: '100%' }}
// //                     value={input.remise}
// //                     onChange={(e) => handleRemiseChange(e, index)}
// //                     onKeyDown={handleKeyPress}
// //                     ref={remiseInputRef}
// //                   />
// //                 </div>
// //                 <div style={{ marginLeft: '10px' }}>
// //                   <button type="button" onClick={handleAddInput}>+</button>
// //                 </div>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //         <div>
// //           <div style={{ display: "inline-block", marginBottom: '20px', textAlign: 'center' }}>
// //             <button
// //               style={{ width: '200px', marginBottom: '10px' }}
// //               type="button"
// //               onClick={handleSubmit}
// //             >
// //               Ajouter
// //             </button>
// //             <button
// //               style={{ width: '200px', marginBottom: '10px' }}
// //               type="button"
// //               onClick={handleClear}
// //             >
// //               Vider les champs
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //       <div style={{ marginBottom: '20px' }}>
// //         <label>Total</label>
// //         <input
// //           style={{ width: '100%' }}
// //           value={calculateTotal()}
// //           readOnly
// //         />
// //       </div>
// //     </div>
// //   );
// // }

// // export default Cfvbs;
