// import axios from 'axios';
// import React, { useState, useEffect } from 'react';

// function CreateClient({ onAddClient, onDelete, selectedClient }) {
//   const [clientId, setClientId] = useState('');
//   const [name, setName] = useState('');
//   const [adresse, setAdresse] = useState('');
//   const [tel, setTel] = useState('');
//   const [MF, setMF] = useState('');
//   const [RC, setRC] = useState('');
//   const [responsable, setResponsable] = useState('');
//   const [resTel, setResTel] = useState('');

//   useEffect(() => {
//     if (selectedClient) {
//       setClientId(selectedClient.clID || '');
//       setName(selectedClient.clName || '');
//       setAdresse(selectedClient.clAdr || '');
//       setTel(selectedClient.clTel || '');
//       setMF(selectedClient.clMF || '');
//       setRC(selectedClient.clRC || '');
//       setResponsable(selectedClient.responsable || '');
//       setResTel(selectedClient.resTel || '');
//     }
//   }, [selectedClient]);

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       await axios.post('http://localhost:7777/client/createCl/', {
//         clName: name,
//         clAdr: adresse,
//         clTel: tel,
//         clMF: MF,
//         clRC: RC,
//         responsable: responsable,
//         resTel: resTel
//       });
//       onAddClient({ clName: name, clAdr: adresse, clTel: tel, clMF: MF, clRC: RC, responsable: responsable, resTel: resTel });
//       clearInputs();
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const handleUpdate = async (event) => {
//     event.preventDefault();
//     if (selectedClient) {
//       try {
//         await axios.put(`http://localhost:7777/client/updateCl/${selectedClient.clID}`, {
//           clName: name,
//           clAdr: adresse,
//           clTel: tel,
//           clMF: MF,
//           clRC: RC,
//           responsable: responsable,
//           resTel: resTel
//         });
//         window.location.reload();
//       } catch (err) {
//         console.log(err);
//       }
//     }
//   };

//   const clearInputs = () => {
//     setClientId('');
//     setName('');
//     setAdresse('');
//     setTel('');
//     setMF('');
//     setRC('');
//     setResponsable('');
//     setResTel('');
//   };

//   // const handleInputChange = async (event) => {
//   //   const { id, value } = event.target;
  
//   //   if (id === 'name') {
//   //     setName(value);
//   //   } else if (id === 'clientId') {
//   //     setClientId(value);
//   //   }
  
//   //   if (id === 'name' || id === 'clientId') {
//   //     if (value) {
//   //       try {
//   //         const response = await axios.get(`http://localhost:7777/client/search?${id === 'name' ? 'name' : 'id'}=${value}`);
//   //         if (response.data) {
//   //           const client = response.data;
//   //           setName(client.clName || '');
//   //           setClientId(client.clID || '');
//   //           setAdresse(client.clAdr || '');
//   //           setTel(client.clTel || '');
//   //           setMF(client.clMF || '');
//   //           setRC(client.clRC || '');
//   //           setResponsable(client.responsable || '');
//   //           setResTel(client.resTel || '');
//   //         } else {
//   //           clearInputs();
//   //           setName(id === 'name' ? value : ''); 
//   //           setClientId(id === 'clientId' ? value : ''); 
//   //         }
//   //       } catch (err) {
//   //         console.log(err);
//   //         clearInputs();
//   //         setName(id === 'name' ? value : '');
//   //         setClientId(id === 'clientId' ? value : ''); 
//   //       }
//   //     } else {
//   //       clearInputs();
//   //     }
//   //   }
//   // };
//   const handleInputChange = async (event) => {
//     const { id, value } = event.target;
  
//     if (id === 'name') {
//       setName(value);
//     } else if (id === 'clientId') {
//       setClientId(value);
//     }
  
//     if ((id === 'name' || id === 'clientId') && value !== '') {
//       try {
//         const response = await axios.get(`http://localhost:7777/client/search?${id === 'name' ? 'name' : 'id'}=${value}`);
//         if (response.data) {
//           const client = response.data;
//           setName(client.clName || '');
//           setClientId(client.clID || '');
//           setAdresse(client.clAdr || '');
//           setTel(client.clTel || '');
//           setMF(client.clMF || '');
//           setRC(client.clRC || '');
//           setResponsable(client.responsable || '');
//           setResTel(client.resTel || '');
//         } else {
//           clearInputs();
//           setName(id === 'name' ? value : ''); 
//           setClientId(id === 'clientId' ? value : ''); 
//         }
//       } catch (err) {
//         console.log(err);
//         clearInputs();
//         setName(id === 'name' ? value : '');
//         setClientId(id === 'clientId' ? value : ''); 
//       }
//     } else if (value === '') {
//       clearInputs();
//     }
//   };
  
  

//   return (
//     <div style={{ margin: '20px', display: 'flex', justifyContent: 'flex-end' }}>
//       <div style={{ flex: '0.7', marginRight: '10px' }}>
//         <div style={{ marginBottom: '10px' }}>
//           <label style={{ width: '120px' }} htmlFor="clientId">ID Client</label> 
//           <input
//             style={{ width: '200px' }}
//             type="text"
//             id="clientId"
//             value={clientId}
//             onChange={handleInputChange}
//           />
//         </div>
//         <div style={{ marginBottom: '10px' }}>
//           <label style={{ width: '120px' }} htmlFor="name">Nom</label>
//           <input
//             style={{ width: '200px' }}
//             type="text"
//             id="name"
//             value={name}
//             onChange={handleInputChange}
//           />
//         </div>
//         <div style={{ marginBottom: '10px' }}>
//           <label style={{ width: '120px' }} htmlFor="adresse">Adresse</label>
//           <input
//             style={{ width: '200px' }}
//             type="text"
//             id="adresse"
//             value={adresse}
//             onChange={(e) => setAdresse(e.target.value)}
//           />
//         </div>
//         <div style={{ marginBottom: '10px' }}>
//           <label style={{ width: '120px' }} htmlFor="tel">Telephone</label>
//           <input
//             style={{ width: '200px' }}
//             type="number"
//             id="tel"
//             value={tel}
//             onChange={(e) => setTel(e.target.value)}
//           />
//         </div>
//         <div style={{ marginBottom: '10px' }}>
//           <label style={{ width: '120px' }} htmlFor="MF">Matricule Fiscale</label>
//           <input
//             style={{ width: '200px' }}
//             type="text"
//             id="MF"
//             value={MF}
//             onChange={(e) => setMF(e.target.value)}
//           />
//         </div>
//         <div style={{ marginBottom: '10px' }}>
//           <label style={{ width: '120px' }} htmlFor="RC">Registre Commerciale</label>
//           <input
//             style={{ width: '200px' }}
//             type="text"
//             id="RC"
//             value={RC}
//             onChange={(e) => setRC(e.target.value)}
//           />
//         </div>
//       </div>
//       <div style={{ flex: '1', marginRight: '10px' }}>
//         <div style={{ marginBottom: '10px' }}>
//           <label style={{ width: '120px' }} htmlFor="responsable">Nom du responsable</label>
//           <input
//             style={{ width: '200px' }}
//             type="text"
//             id="responsable"
//             value={responsable}
//             onChange={(e) => setResponsable(e.target.value)}
//           />
//         </div>
//         <div style={{ marginBottom: '10px' }}>
//           <label style={{ width: '120px' }} htmlFor="resTel">Telephone du responsable</label>
//           <input
//             style={{ width: '200px' }}
//             type="text"
//             id="resTel"
//             value={resTel}
//             onChange={(e) => setResTel(e.target.value)}
//           />
//         </div>
//       </div>
//       <div style={{ flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//         <button style={{ width: '200px', marginBottom: '10px' }} type="button" onClick={handleSubmit}>Ajouter</button>
//         <button
//           style={{ width: '200px', marginBottom: '10px' }}
//           type="button"
//           onClick={() => {
//             if (selectedClient) {
//               const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?");
//               if (confirmed) {
//                 onDelete(selectedClient.clID);
//                 clearInputs();
//               }
//             } else {
//               console.log("No client selected for deletion");
//             }
//           }}
//         >
//           Supprimer
//         </button>
//         <button style={{ width: '200px', marginBottom: '10px' }} type="button" onClick={handleUpdate}>Enregistrer</button>
//         <button style={{ width: '200px', marginTop: '10px' }} type="button" onClick={clearInputs}>Vider les champs</button>
//       </div>
//     </div>
//   );
// }

// export default CreateClient;
import React, { useState, useEffect } from "react";
import axios from "axios";

function CreateClient({ onAddClient, onDelete, selectedClient }) {
  const [clientId, setClientId] = useState("");
  const [name, setName] = useState("");
  const [adresse, setAdresse] = useState("");
  const [tel, setTel] = useState("");
  const [MF, setMF] = useState("");
  const [RC, setRC] = useState("");
  const [responsable, setResponsable] = useState("");
  const [resTel, setResTel] = useState("");

  useEffect(() => {
    if (selectedClient) {
      setClientId(selectedClient.clID || "");
      setName(selectedClient.clName || "");
      setAdresse(selectedClient.clAdr || "");
      setTel(selectedClient.clTel || "");
      setMF(selectedClient.clMF || "");
      setRC(selectedClient.clRC || "");
      setResponsable(selectedClient.responsable || "");
      setResTel(selectedClient.resTel || "");
    }
  }, [selectedClient]);
  const fetchClientData = async (searchTerm, searchBy) => {
    try {
      const response = await axios.get(`http://localhost:7777/client/search`, {
        params: { [searchBy]: searchTerm }
      });
      const client = response.data;
      if (client)  {
        setClientId(client.clID || "");
        setName(client.clName || "");
        setAdresse(client.clAdr || "");
        setTel(client.clTel || "");
        setMF(client.clMF || "");
        setRC(client.clRC || "");
        setResponsable(client.responsable || "");
        setResTel(client.resTel || "");
      }
    } catch (error) {
      console.error("Error fetching client data:", error);
    }
  };
  
  useEffect(() => {
    if (clientId) {
      fetchClientData(clientId, "id");
    }
  }, [clientId]);
  useEffect(() => {
    if (name) {
      fetchClientData(name, "name");
    }
  }, [name]);



  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      axios.post("http://localhost:7777/client/createCl/", {
        clName: name,
        clAdr: adresse,
        clTel: tel,
        clMF: MF,
        clRC: RC,
        responsable: responsable,
        resTel: resTel
      }).then((res) => {
        onAddClient({
          clName: name,
          clAdr: adresse,
          clTel: tel,
          clMF: MF,
          clRC: RC,
          responsable: responsable,
          resTel: resTel
        });
        clearInputs();
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = (event) => {
    event.preventDefault();
    if (selectedClient) {
      try {
        axios.put(`http://localhost:7777/client/updateCl/${selectedClient.clID}`, {
          clName: name,
          clAdr: adresse,
          clTel: tel,
          clMF: MF,
          clRC: RC,
          responsable: responsable,
          resTel: resTel
        }).then(() => {
          window.location.reload();
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  const clearInputs = () => {
    setClientId("");
    setName("");
    setAdresse("");
    setTel("");
    setMF("");
    setRC("");
    setResponsable("");
    setResTel("");
  };

  return (
    <div style={{ margin: "20px", display: "flex", justifyContent: "flex-end" }}>
      <div style={{ flex: "0.7", marginRight: "10px" }}>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ width: "120px" }} htmlFor="clientId">ID Client</label>
          <input
            style={{ width: "200px" }}
            type="text"
            id="clientId"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
  <label style={{ width: "120px" }} htmlFor="name">Nom</label>
  <input
            style={{ width: "200px" }}
            type="text"
            id="name"
            name="new-unique-name"
            autoComplete="off"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
</div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ width: '120px' }} htmlFor="adresse">Adresse</label>
          <input
            style={{ width: '200px' }}
            type="text"
            id="adresse"
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ width: '120px' }} htmlFor="tel">Telephone</label>
          <input
            style={{ width: '200px' }}
            type="number"
            id="tel"
            value={tel}
            onChange={(e) => setTel(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ width: '120px' }} htmlFor="MF">Matricule Fiscale</label>
          <input
            style={{ width: '200px' }}
            type="text"
            id="MF"
            value={MF}
            onChange={(e) => setMF(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ width: '120px' }} htmlFor="RC">Registre Commerciale</label>
          <input
            style={{ width: '200px' }}
            type="text"
            id="RC"
            value={RC}
            onChange={(e) => setRC(e.target.value)}
          />
        </div>
      </div>
      <div style={{ flex: '1', marginRight: '10px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ width: '120px' }} htmlFor="responsable">Nom du responsable</label>
          <input
            style={{ width: '200px' }}
            type="text"
            id="responsable"
            value={responsable}
            onChange={(e) => setResponsable(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ width: '120px' }} htmlFor="resTel">Telephone du responsable</label>
          <input
            style={{ width: '200px' }}
            type="text"
            id="resTel"
            value={resTel}
            onChange={(e) => setResTel(e.target.value)}
          />
        </div>
      </div>
      <div style={{ flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <button style={{ width: '200px', marginBottom: '10px' }} type="button" onClick={handleSubmit}>Ajouter</button>
        <button
          style={{ width: '200px', marginBottom: '10px' }}
          type="button"
          onClick={() => {
            if (selectedClient) {
              const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?");
              if (confirmed) {
                onDelete(selectedClient.clID);
                clearInputs();
              }
            } else {
              console.log("No client selected for deletion");
            }
          }}
        >
          Supprimer
        </button>
        <button
         style={{ width: '200px', marginBottom: '10px' }} type="button"
         onClick={handleUpdate}>Enregistrer</button>
        <button style={{ width: '200px', marginTop: '10px' }} type="button" onClick={clearInputs}>Vider les champs</button>
      </div>
    </div>
  );
}

export default CreateClient;