// import axios from 'axios';
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';


// function CreateFournisseur() {
//     const [name,setName] = useState('')
//     const [adresse,setAdress] = useState('')
//     const [tel,setTel] = useState('')
//     const [MF,setMF] = useState('')
//     const [RC,setRC] = useState('')
//     const [responsable,setResponsable] = useState('')
//     const [resTel,setResTel] = useState('')    
//     const navigate = useNavigate();


// function handleSubmit(event) {
//     event.preventDefault();
//     axios.post('http://localhost:7777/create/',{ fssName: name,
//     fssAdr: adresse,
//     fssTel: tel,
//     fssMF: MF,
//     fssRC: RC,
//     fssRES: responsable,
//     fssRTEL : resTel
//   })
//     .then(res => {
//         console.log(res);
//         window.location.reload();

//     }).catch(err => console.log(err))
// } 
    
//   return (
//     <div className="container mt-5">
//       <h2 className="mb-4">Ajouter un fournisseur</h2>
//       <form onSubmit={handleSubmit}>
//       <div className="row mb-3">
//       <div className='col'>
//         <label htmlFor="">Nom</label>
//         <input
//           type='text'
//           placeholder='entrez le nom du fournisseur' className='form-control'
//           onChange={e => setName(e.target.value)}
//         ></input>
//       </div>
//       <div className='col'>
//         <label htmlFor="">Adresse</label>
//         <input
//           type='text'
//           placeholder="entrez l'adresse du fournisseur"
//           className='form-control'
//           onChange={e => setAdress(e.target.value)}
//         ></input>
//       </div>
//       </div>
//       <div className="row mb-3">
//       <div className='col'>
//         <label htmlFor="">Telephone</label>
//         <input
//           type='text'
//           placeholder='entrez le telephone du fournisseur' className='form-control'
//           onChange={e => setTel(e.target.value)}
//         ></input>
//       </div>
//       <div className='col'>
//         <label htmlFor="">Matricule Fiscale</label>
//         <input
//           type='text'
//           placeholder="entrez la MF du fournisseur"
//           className='form-control'
//           onChange={e => setMF(e.target.value)}
//         ></input>
//       </div>
//       </div>
//       <div className="row mb-3">
//       <div className='col'>
//         <label htmlFor="">Registre Commerciale</label>
//         <input
//           type='text'
//           placeholder='entrez le RC du fournisseur' className='form-control'
//           onChange={e => setRC(e.target.value)}
//         ></input>
//       </div>
//       <div className='col'>
//         <label htmlFor="">Responsable</label>
//         <input
//           type='text'
//           className='form-control'
//           onChange={e => setResponsable(e.target.value)}
//         ></input>
//       </div>
//       <div className='col'>
//         <label htmlFor="">Telephone du Responsable</label>
//         <input
//           type='text'
//           className='form-control'
//           onChange={e => setResTel(e.target.value)}
//         ></input>
//       </div>
//       </div>
//       <button type="submit" className="btn btn-success">Ajouter</button>
//       </form>
//     </div>
//   )
// }

// export default CreateFournisseur
import axios from 'axios';
import React, { useState, useEffect } from 'react';

function CreateFournisseur({ onAddFournisseur, onDelete, selectedFournisseur }) {
  const [fournisseurId, setFournisseurId] = useState('');
  const [name, setName] = useState('');
  const [adresse, setAdresse] = useState('');
  const [tel, setTel] = useState('');
  const [MF, setMF] = useState('');
  const [RC, setRC] = useState('');
  const [responsable, setResponsable] = useState('');
  const [resTel, setResTel] = useState('');

  useEffect(() => {
    if (selectedFournisseur) {
      setFournisseurId(selectedFournisseur.fssID || '');
      setName(selectedFournisseur.fssName || '');
      setAdresse(selectedFournisseur.fssAdr || '');
      setTel(selectedFournisseur.fssTel || '');
      setMF(selectedFournisseur.fssMF || '');
      setRC(selectedFournisseur.fssRC || '');
      setResponsable(selectedFournisseur.fssRES || '');
      setResTel(selectedFournisseur.fssRTEL || '');
    }
  }, [selectedFournisseur]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:7777/fournisseur/create/', {
        fssName: name,
        fssAdr: adresse,
        fssTel: tel,
        fssMF: MF,
        fssRC: RC,
        fssRES: responsable,
        fssRTEL: resTel
      });
      onAddFournisseur({ fssName: name, fssAdr: adresse, fssTel: tel, fssMF: MF, fssRC: RC, fssRES: responsable, fssRTEL: resTel });
      clearInputs();
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    if (selectedFournisseur) {
      try {
        await axios.put(`http://localhost:7777/fournisseur/update/${selectedFournisseur.fssID}`, {
          fssName: name,
          fssAdr: adresse,
          fssTel: tel,
          fssMF: MF,
          fssRC: RC,
          fssRES: responsable,
          fssRTEL: resTel
        });
        window.location.reload();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const clearInputs = () => {
    setFournisseurId('');
    setName('');
    setAdresse('');
    setTel('');
    setMF('');
    setRC('');
    setResponsable('');
    setResTel('');
  };

  const handleInputChange = async (event) => {
    const { id, value } = event.target;

    if (id === 'name') {
      setName(value);
    } else if (id === 'fournisseurId') {
      setFournisseurId(value);
    }

    if (id === 'name' || id === 'fournisseurId') {
      if (value) {
        try {
          const response = await axios.get(`http://localhost:7777/fournisseur/search?${id === 'name' ? 'name' : 'id'}=${value}`);
          if (response.data) {
            const fournisseur = response.data;
            setName(fournisseur.fssName || '');
            setFournisseurId(fournisseur.fssID || '');
            setAdresse(fournisseur.fssAdr || '');
            setTel(fournisseur.fssTel || '');
            setMF(fournisseur.fssMF || '');
            setRC(fournisseur.fssRC || '');
            setResponsable(fournisseur.fssRES || '');
            setResTel(fournisseur.fssRTEL || '');
          } else {
            clearInputs();
            setName(id === 'name' ? value : '');
            setFournisseurId(id === 'fournisseurId' ? value : '');
          }
        } catch (err) {
          console.log(err);
          clearInputs();
          setName(id === 'name' ? value : '');
          setFournisseurId(id === 'fournisseurId' ? value : '');
        }
      } else {
        clearInputs();
      }
    }
  };

  return (
    <div style={{ margin: '20px', display: 'flex', justifyContent: 'flex-end' }}>
      <div style={{ flex: '0.7', marginRight: '10px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ width: '120px' }} htmlFor="fournisseurId">Code Fournisseur</label>
          <input
            style={{ width: '200px' }}
            type="text"
            id="fournisseurId"
            value={fournisseurId}
            onChange={handleInputChange}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ width: '120px' }} htmlFor="name">Nom</label>
          <input
            style={{ width: '200px' }}
            type="text"
            id="name"
            value={name}
            onChange={handleInputChange}
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
            if (selectedFournisseur) {
              const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer ce fournisseur ?");
              if (confirmed) {
                onDelete(selectedFournisseur.fssID);
                clearInputs();
              }
            } else {
              console.log("No fournisseur selected for deletion");
            }
          }}
        >
          Supprimer
        </button>
        <button style={{ width: '200px', marginBottom: '10px' }} type="button" onClick={handleUpdate}>Enregistrer</button>
        <button style={{ width: '200px', marginTop: '10px' }} type="button" onClick={clearInputs}>Vider les champs</button>
      </div>
    </div>
  );
}

export default CreateFournisseur;
