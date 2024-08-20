import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './styles.css'

function Sidebar() {
  const [showVenteLinks, setShowVenteLinks] = useState(false);

  const toggleVenteLinks = () => {
    setShowVenteLinks(!showVenteLinks);
  };

  return (
    <div className='bg-white'>
      <div className='m-2'>
        <i className='bi bi-bootstrap-fill me-2 fs-4'></i>
        <span className='brand-name fs-4'>Quincaillerie</span>
      </div>
      <hr className='text-dark' />
      <div className='list-group list-group-flush'>
        <a className='list-group-item py-2' style={{ textDecoration: 'none' }}>
          <i className='bi bi-speedometer2 fs-5 me-2'></i>
          <Link to="/fournisseur" className="text-decoration-none" style={{ textDecoration: 'none', color: 'black' }}>Fournisseurs</Link>
        </a>
        <a className='list-group-item py-2' style={{ textDecoration: 'none' }}>
          <i className='bi bi-house fs-4 me-2'></i>
          <Link to="/client" className="text-decoration-none" style={{ textDecoration: 'none', color: 'black' }}>Clients</Link>
        </a>
        <a className='list-group-item py-2' style={{ textDecoration: 'none' }}>
          <i className='bi bi-house fs-4 me-2'></i>
          <Link to="/article" className="text-decoration-none" style={{ textDecoration: 'none', color: 'black' }}>Articles</Link>
        </a>
        <a className='list-group-item py-2' style={{ textDecoration: 'none' }}>
          <i className='bi bi-house fs-4 me-2'></i>
          <Link to="/factureAchat" className="text-decoration-none" style={{ textDecoration: 'none', color: 'black' }}>Facture d'achat</Link>
        </a>
        <a className='list-group-item py-2' onClick={toggleVenteLinks} style={{ textDecoration: 'none' }}>
          <i className='bi bi-house fs-4 me-2'></i>
          Vente
        </a>
        {showVenteLinks && (
          <>
            <a className='list-group-item py-2' style={{ paddingLeft: '2rem', textDecoration: 'none' }}>
              <i className='bi bi-house fs-4 me-2'></i>
              <Link to="/factureVente" className="text-decoration-none" style={{ textDecoration: 'none', color: 'black' }}>Bon de livraison facture</Link>
            </a>
            <a className='list-group-item py-2' style={{ paddingLeft: '2rem', textDecoration: 'none' }}>
              <i className='bi bi-house fs-4 me-2'></i>
              <Link to="/fvbs" className="text-decoration-none" style={{ textDecoration: 'none' , color: 'black'}}>Bon de sortie</Link>
            </a>
            <a className='list-group-item py-2' style={{ paddingLeft: '2rem', textDecoration: 'none' }}>
              <i className='bi bi-house fs-4 me-2'></i>
              <Link to="/fvbscf" className="text-decoration-none" style={{ textDecoration: 'none', color: 'black' }}>Bon de livraison CF</Link>
            </a>
          </>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
