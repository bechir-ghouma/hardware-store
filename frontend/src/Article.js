// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import CreateArticle from './CreateArticle';

// function Article() {
//     const [articles, setArticles] = useState([]);

//     useEffect(() => {
//         axios.get('http://localhost:7777/article/')
//             .then(res => setArticles(res.data))
//             .catch(err => console.log(err));
//     }, []);

//     const handleDelete = async (id) => {
//         try {
//             await axios.delete(`http://localhost:7777/article/${id}`);
//             setArticles(articles.filter(article => article.arID !== id));
//         } catch (err) {
//             console.log(err);
//         }
//     }

//     const handleAddArticle = (newArticle) => {
//         setArticles([...articles, newArticle]);
//     }

//     return (
//         <div className='article-container'>
//             <CreateArticle onAddArticle={handleAddArticle} /><br />
//             <h2>Liste des Articles</h2>
//             <div className='table-responsive'>
//                 <table className='table table-striped'>
//                     <thead>
//                         <tr>
//                             <th>Id</th> 
//                             <th>Nom</th>
//                             <th>Référence</th>
//                             <th>Achat brut</th>
//                             <th>Remise1</th>
//                             <th>Prix d'achat AR1</th>
//                             <th>Remise2</th>
//                             <th>Achat AR2 HT</th>
//                             <th>TVA</th>
//                             <th>Prix TTC</th>
//                             <th>Marge bénéficiaire</th>
//                             <th>Vente HT</th>
//                             <th>Vente TTC</th>
//                             {/* <th>Modifier</th>
//                             <th>Supprimer</th> */}
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {articles.map(article => (
//                             <tr key={article.arID}>
//                                 <td>{article.arID}</td>
//                                 <td>{article.arName}</td>
//                                 <td>{article.ref}</td>
//                                 <td>{article.prachat}</td>
//                                 <td>{article.remise1}</td>
//                                 <td>{article.prar1}</td>
//                                 <td>{article.remise2}</td>
//                                 <td>{article.prar2}</td>
//                                 <td>{article.tva}%</td>
//                                 <td>{article.achatc}</td>
//                                 <td>{article.margeben}</td>
//                                 <td>{article.prventeht}</td>
//                                 <td>{article.prventettc}</td>
//                                 {/* <td>
//                                     <Link to={`updateAr/${article.arID}`} className='btn btn-primary'>Modifier</Link>
//                                 </td>
//                                 <td>
//                                     <button className='btn btn-danger ms-2' onClick={() => handleDelete(article.arID)}>Supprimer</button>
//                                 </td> */}
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }

// export default Article;
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { FaPlus } from 'react-icons/fa';
// import { Modal } from 'react-bootstrap';
// import './Article.css';
// import CreateArticle from './CreateArticle';

// function Article() {
//     const defaultColumns = ['arID', 'arName', 'ref', 'achatc', 'tva', 'prventettc'];
//     const [articles, setArticles] = useState([]);
//     const [selectedColumns, setSelectedColumns] = useState(defaultColumns);
//     const [showPopup, setShowPopup] = useState(false);
//     const [selectedArticle, setSelectedArticle] = useState(null);
//     const [selectedRow, setSelectedRow] = useState(null);

//     const additionalColumns = [
//         { name: "Prix d'achat AR1", key: "prar1" },
//         { name: "Remise2", key: "remise2" },
//         { name: "Achat AR2 HT", key: "prar2" },
//         { name: "Marge bénéficiaire", key: "margeben" },
//         { name: "Vente HT", key: "prventeht" }
//     ];

//     useEffect(() => {
//         const savedColumns = JSON.parse(localStorage.getItem('selectedColumns'));
//         if (savedColumns) {
//             setSelectedColumns(savedColumns);
//         }
//     }, []);

//     useEffect(() => {
//         axios.get('http://localhost:7777/article/')
//             .then(res => setArticles(res.data))
//             .catch(err => console.log(err));
//     }, []);

//     useEffect(() => {
//         localStorage.setItem('selectedColumns', JSON.stringify(selectedColumns));
//     }, [selectedColumns]);

//     const handleDelete = async (id) => {
//         try {
//             await axios.delete(`http://localhost:7777/article/${id}`);
//             setArticles(articles.filter(article => article.arID !== id));
//             setSelectedArticle(null);
//             setSelectedRow(null); // Clear selected row after deletion
//         } catch (err) {
//             console.log(err);
//         }
//     };

//     const handleAddArticle = (newArticle) => {
//         setArticles([...articles, newArticle]);
//     };

//     const handleColumnSelect = (colKey) => {
//         if (!selectedColumns.includes(colKey)) {
//             setSelectedColumns([...selectedColumns, colKey]);
//         }
//     };

//     const handleRemoveColumn = (colKey) => {
//         setSelectedColumns(selectedColumns.filter(col => col !== colKey));
//     };

//     return (
//         <div className='article-container'>
//             <CreateArticle onAddArticle={handleAddArticle} onDelete={handleDelete} selectedArticle={selectedArticle} />
//             <div className='table-responsive'>
//                 <table className='table table-striped'>
//                     <thead>
//                         <tr>
//                             {selectedColumns.map((colKey) => (
//                                 <th key={colKey}>
//                                     {colKey === 'arID' ? 'Id' :
//                                         colKey === 'ref' ? 'Référence' :
//                                             colKey === 'arName' ? 'Nom' :
//                                                 colKey === 'achatc' ? 'Prix TTC' :
//                                                     colKey === 'tva' ? 'TVA' :
//                                                         colKey === 'prventettc' ? 'Vente TTC' :
//                                                             additionalColumns.find(col => col.key === colKey).name}
//                                     {additionalColumns.some(col => col.key === colKey) && (
//                                         <button className="btn btn-link btn-sm" onClick={() => handleRemoveColumn(colKey)}>×</button>
//                                     )}
//                                 </th>
//                             ))}
//                             <th>
//                                 <div className='column-selector-container'>
//                                     <button
//                                         className='btn btn-secondary column-selector-btn'
//                                         onClick={() => setShowPopup(true)}
//                                     >
//                                         <FaPlus />
//                                     </button>
//                                     <Modal show={showPopup} onHide={() => setShowPopup(false)}>
//                                         <Modal.Header closeButton>
//                                             <Modal.Title>Ajouter des Colonnes</Modal.Title>
//                                         </Modal.Header>
//                                         <Modal.Body>
//                                             <ul>
//                                                 {additionalColumns.map((col) => (
//                                                     <li key={col.key}>
//                                                         <button
//                                                             className='btn btn-link'
//                                                             onClick={() => handleColumnSelect(col.key)}
//                                                             disabled={selectedColumns.includes(col.key)}
//                                                         >
//                                                             {col.name}
//                                                         </button>
//                                                     </li>
//                                                 ))}
//                                             </ul>
//                                         </Modal.Body>
//                                     </Modal>
//                                 </div>
//                             </th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {articles.map((article, index) => (
//                             // <tr
//                             //     key={article.arID}
//                             //     onClick={() => {
//                             //         setSelectedArticle(article);
//                             //         setSelectedRow(index);
//                             //     }}
//                             //     style={{
//                             //         backgroundColor: selectedRow === index ? "lightblue" : "white",
//                             //         cursor: "pointer"
//                             //     }}
//                             // >
//                             //     {selectedColumns.map((colKey) => (
//                             //         <td key={colKey}>{article[colKey]}</td>
//                             //     ))}
//                             // </tr>
// <tr
//   key={article.arID}
//   onClick={() => {
//     console.log("Row clicked");
//     console.log("selectedRow:", selectedRow);
//     console.log("index:", index);
//     setSelectedArticle(article);
//     setSelectedRow(index);
//   }}
//   className={selectedRow === index ? 'selected-row' : ''}
//   style={{ cursor: 'pointer' }}
// >
//   {selectedColumns.map((colKey) => (
//     <td key={colKey}>{article[colKey]}</td>
//   ))}
// </tr>


//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }

// export default Article;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';
import { Modal } from 'react-bootstrap';
import './Article.css'; 
import CreateArticle from './CreateArticle';


function Article() {
    const defaultColumns = ['arID', 'arName', 'quantite', 'ref', 'achatc', 'tva', 'prventettc'];
    const [articles, setArticles] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState(defaultColumns);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);

    const additionalColumns = [
        { name: "Prix d'achat AR1", key: "prar1" },
        { name: "Remise2", key: "remise2" },
        { name: "Achat AR2 HT", key: "prar2" },
        { name: "Marge bénéficiaire", key: "margeben" },
        { name: "Vente HT", key: "prventeht" }
    ];

    useEffect(() => {
        const savedColumns = JSON.parse(localStorage.getItem('selectedColumns'));
        if (savedColumns) {
            setSelectedColumns(savedColumns);
        }
    }, []);

    useEffect(() => {
        axios.get('http://localhost:7777/article/')
            .then(res => setArticles(res.data))
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        localStorage.setItem('selectedColumns', JSON.stringify(selectedColumns));
    }, [selectedColumns]);

    useEffect(() => {
        console.log("Selected row updated:", selectedRow);
    }, [selectedRow]);

    // const handleDelete = async (id) => {
    //     try {
    //         await axios.delete(`http://localhost:7777/article/${id}`);
    //         setArticles(articles.filter(article => article.arID !== id));
    //         setSelectedArticle(null);
    //         setSelectedRow(null); // Clear selected row after deletion
    //     } catch (err) {
    //         console.log(err);
    //     }
    // };
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:7777/article/${id}`);
            setArticles(articles.filter(article => article.arID !== id));
            setSelectedArticle(null);
            setSelectedRow(null); // Clear selected row after deletion
        } catch (err) {
            console.log(err);
        }
    };
    

    const handleAddArticle = (newArticle) => {
        setArticles([...articles, newArticle]);
    };

    const handleColumnSelect = (colKey) => {
        if (!selectedColumns.includes(colKey)) {
            setSelectedColumns([...selectedColumns, colKey]);
        }
    };

    const handleRemoveColumn = (colKey) => {
        setSelectedColumns(selectedColumns.filter(col => col !== colKey));
    };

    return (
        <div className='article-container'>
            <CreateArticle onAddArticle={handleAddArticle} onDelete={handleDelete} selectedArticle={selectedArticle} />
            <div className='table-responsive'>
                <table className='table table-striped'>
                    <thead>
                        <tr>
                            {selectedColumns.map((colKey) => (
                                <th key={colKey}>
                                    {colKey === 'arID' ? 'Id' :
                                        colKey === 'ref' ? 'Référence' :
                                            colKey === 'arName' ? 'Nom' :
                                                colKey === 'quantite' ? 'Quantité' :
                                                    colKey === 'achatc' ? 'Prix TTC' :
                                                        colKey === 'tva' ? 'TVA' :
                                                            colKey === 'prventettc' ? 'Vente TTC' :
                                                                additionalColumns.find(col => col.key === colKey).name}
                                    {additionalColumns.some(col => col.key === colKey) && (
                                        <button className="btn btn-link btn-sm" onClick={() => handleRemoveColumn(colKey)}>×</button>
                                    )}
                                </th>
                            ))}
                            <th>
                                <div className='column-selector-container'>
                                    <button
                                        className='btn btn-secondary column-selector-btn'
                                        onClick={() => setShowPopup(true)}
                                    >
                                        <FaPlus />
                                    </button>
                                    <Modal show={showPopup} onHide={() => setShowPopup(false)}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Ajouter des Colonnes</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <ul>
                                                {additionalColumns.map((col) => (
                                                    <li key={col.key}>
                                                        <button
                                                            className='btn btn-link'
                                                            onClick={() => handleColumnSelect(col.key)}
                                                            disabled={selectedColumns.includes(col.key)}
                                                        >
                                                            {col.name}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </Modal.Body>
                                    </Modal>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {articles.map((article, index) => (
                            <tr
                                key={article.arID}
                                onClick={() => {
                                    setSelectedArticle(article);
                                    setSelectedRow(index);
                                }}
                                className={selectedRow === index ? 'table-active' : ''}
                                style={{ cursor: 'pointer' }}
                            >
                                {selectedColumns.map((colKey) => (
                                    <td key={colKey}>{article[colKey]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Article;

