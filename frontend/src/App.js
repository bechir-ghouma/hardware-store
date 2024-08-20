import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Fournisseur from './Fournisseur';
import CreateFournisseur from './CreateFournisseur';
import Client from './Client';
import CreateClient from './CreateClient';
import Article from './Article';
import CreateArticle from './CreateArticle.js';
import Dashboard from './Dashboard';
import FactureAchat from './FactureAchat.js';
import CreateFactureAchat from './CreateFactureAchat.js';
import FactureVente from './FactureVente.js';
import CreateFactureVente from './CreateFactureVente.js';
import Fvbs from './Fvbs.js';
import Cfvbs from './Cfvbs.js';
import Cfvbsa from './Cfvbsa.js';
import Fvbscf from './Fvbscf.js'
import Cfvbscf from './Cfvbscf.js';
import Cfvbscfa from './Cfvbscfa.js'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Dashboard />}></Route>
          <Route path='/fournisseur' element={<Fournisseur />}></Route>
          <Route path='/create' element={<CreateFournisseur />}></Route>
          <Route path='/client' element={<Client />}></Route>
          <Route path='/client/createCl' element={<CreateClient />}></Route>
          <Route path='/article' element={<Article />}></Route>
          <Route path='/article/createAr/' element={<CreateArticle />}></Route>
          <Route path='/factureAchat' element={<FactureAchat />}></Route>
          <Route path='/factureAchat/createFac/' element={<CreateFactureAchat />}></Route>
          <Route path='/factureVente' element={<FactureVente />}></Route>
          <Route path='/factureVente/createFac/' element={<CreateFactureVente />}></Route>
          <Route path='/fvbs/' element={<Fvbs />}></Route>
          <Route path='/fvbs/cfvbs' element={<Cfvbs />}></Route>
          <Route path="/cfvbsa" element={<Cfvbsa />} />
          <Route path='/fvbscf/' element={<Fvbscf />}></Route>
          <Route path='/fvbscf/cfvbscf' element={<Cfvbscf />}></Route>
          <Route path='/cfvbscfa' element={<Cfvbscfa />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
