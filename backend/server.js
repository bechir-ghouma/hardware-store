const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");


const app = express () ;

app.use(express.json())


app.use(cors())

const db = mysql.createConnection({
    host: "localhost",
    user : "",
    password : "",
    database : "quincaillerie"
})


app.get("/fournisseur", (req,res)=> {
    const sql = "SELECT * FROM fournisseur";
    db.query(sql,(err,data) => {
    if(err) return res.json(err);
    return res.json(data)
}
)
})

app.get("/client/", (req,res)=> {
    const sql = "SELECT * FROM client";
    db.query(sql,(err,data) => {
    if(err) return res.json(err);
    return res.json(data)
}
)
})


app.get("/article/", (req,res)=> {
    const sql = "SELECT * FROM article";
    db.query(sql,(err,data) => {
    if(err) return res.json(err);
    return res.json(data)
}
)
})



app.get("/factureAchat/", (req,res)=> {
    const sql = "SELECT * FROM fachat";
    db.query(sql,(err,data) => {
    if(err) return res.json(err);
    return res.json(data)
}
)
})


app.get("/factureVente/", (req, res) => {
  const sql = "SELECT * FROM facturevente";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);

    // Parse the articles field
    const parsedData = data.map(facture => {
      return {
        ...facture,
        articles: JSON.parse(facture.articles || '[]')
      };
    });

    return res.json(parsedData);
  });
});

app.get("/fvbs/", (req, res) => {
  const sql = "SELECT * FROM ssortievente";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);

    const parsedData = data.map(facture => {
      return {
        ...facture,
        articles: JSON.parse(facture.articles || '[]')
      };
    });

    console.log(parsedData);
    return res.json(parsedData);
  });
});

app.get("/fvbscf/", (req, res) => {
  const sql = "SELECT * FROM bscfvente";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);

    const parsedData = data.map(facture => {
      return {
        ...facture,
        articles: JSON.parse(facture.articles || '[]')
      };
    });

    console.log(parsedData);
    return res.json(parsedData);
  });
});

app.get("/fvbscf/", (req, res) => {
  const sql = "SELECT * FROM bscfvente";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);

    // Parse the articles field
    const parsedData = data.map(facture => {
      return {
        ...facture,
        articles: JSON.parse(facture.articles || '[]')
      };
    });

    return res.json(parsedData);
  });
});


app.get("/references", (req, res) => {
  const sql = "SELECT refAr FROM facturevente";
  db.query(sql, (err, data) => {
    if (err) {
      console.error("Error fetching references:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(data);
  });
});

app.get('/factureVente/:reference', (req, res) => {
  const { reference } = req.params; 
  const sql = 'SELECT prventettc FROM article WHERE ref = ?';
  db.query(sql, [reference], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error fetching data from database' });
    } else {
      if (result.length > 0) {
        res.json({ price: result[0].prventettc });
      } else {
        res.status(404).json({ error: 'Article not found' });
      }
    }
  });
});
app.get('/cfvbs/:reference', (req, res) => {
  const { reference } = req.params; 
  const sql = 'SELECT prventettc FROM article WHERE ref = ?';
  db.query(sql, [reference], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error fetching data from database' });
    } else {
      if (result.length > 0) {
        res.json({ price: result[0].prventettc });
      } else {
        res.status(404).json({ error: 'Article not found' });
      }
    }
  });
});

app.get('/article/search', (req, res) => {
  const { arName, ref } = req.query;

  if (!arName && !ref) {
    return res.status(400).send('Please provide either arName or ref as a query parameter.');
  }

  let query = '';
  let queryParams = [];
  if (arName) {
    query = 'SELECT * FROM article WHERE arName = ?';
    queryParams.push(arName);
  } else if (ref) {
    query = 'SELECT * FROM article WHERE ref = ?';
    queryParams.push(ref);
  }

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).send('Server error.');
    }
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).send('Article not found.');
    }
  });
});


app.get('/clients/search', (req, res) => {
  const name = req.query.name;
  const id = req.query.id;

  if (!name && !id) {
      return res.status(400).json({ error: 'Name or ID parameter is required' });
  }

  let query;
  let queryParams;

  if (name) {
      query = 'SELECT clName, clID FROM client WHERE clName LIKE ? LIMIT 10';
      queryParams = [`%${name}%`];
  } else {
      query = 'SELECT clName, clID FROM client WHERE clID = ? LIMIT 1';
      queryParams = [id];
  }

  db.query(query, queryParams, (err, results) => {
      if (err) {
          console.error('Error executing query:', err);
          return res.status(500).json({ error: 'Internal server error' });
      }

      if (results.length > 0) {
          res.json(results);
      } else {
          res.status(404).json({ error: 'Client not found' });
      }
  });
});


app.get('/clients/search', (req, res) => {
  const name = req.query.name;
  const id = req.query.id;

  if (!name && !id) {
      return res.status(400).json({ error: 'Name or ID parameter is required' });
  }

  let query;
  let queryParams;

  if (name) {
      query = 'SELECT clName, clID FROM client WHERE clName LIKE ? LIMIT 10';
      queryParams = [`%${name}%`];
  } else {
      query = 'SELECT clName, clID FROM client WHERE clID = ? LIMIT 1';
      queryParams = [id];
  }

  db.query(query, queryParams, (err, results) => {
      if (err) {
          console.error('Error executing query:', err);
          return res.status(500).json({ error: 'Internal server error' });
      }

      if (results.length > 0) {
          res.json(results);
      } else {
          res.status(404).json({ error: 'Client not found' });
      }
  });
});

// el get mta3 search fac achat loula (ordre croissant)





app.get('/fss/search', (req, res) => {
  const name = req.query.name;
  const id = req.query.id;

  if (!name && !id) {
      return res.status(400).json({ error: 'Name or ID parameter is required' });
  }

  let query;
  let queryParams;

  if (name) {
      query = 'SELECT fssName, fssID FROM fournisseur WHERE fssName LIKE ? LIMIT 10';
      queryParams = [`%${name}%`];
  } else {
      query = 'SELECT fssName, fssID FROM fournisseur WHERE fssID = ? LIMIT 1';
      queryParams = [id];
  }

  db.query(query, queryParams, (err, results) => {
      if (err) {
          console.error('Error executing query:', err);
          return res.status(500).json({ error: 'Internal server error' });
      }

      if (results.length > 0) {
          res.json(results);
      } else {
          res.status(404).json({ error: 'fss not found' });
      }
  });
});

app.get('/fss/search', (req, res) => {
  const name = req.query.name;
  const id = req.query.id;

  if (!name && !id) {
      return res.status(400).json({ error: 'Name or ID parameter is required' });
  }

  let query;
  let queryParams;

  if (name) {
      query = 'SELECT fssName, fssID FROM fournisseur WHERE fssName LIKE ? LIMIT 10';
      queryParams = [`%${name}%`];
  } else {
      query = 'SELECT fssName, fssID FROM fournisseur WHERE fssID = ? LIMIT 1';
      queryParams = [id];
  }

  db.query(query, queryParams, (err, results) => {
      if (err) {
          console.error('Error executing query:', err);
          return res.status(500).json({ error: 'Internal server error' });
      }

      if (results.length > 0) {
          res.json(results);
      } else {
          res.status(404).json({ error: 'Fournisseur not found' });
      }
  });
});







//

app.get('/fournisseur/search', (req, res) => {
  const name = req.query.name;
  const id = req.query.id;

  if (!name && !id) {
    return res.status(400).json({ error: 'Name or ID parameter is required' });
  }

  let query;
  let queryParams;
  
  if (name) {
    query = 'SELECT * FROM fournisseur WHERE fssName LIKE ? LIMIT 1';
    queryParams = [name];
  } else {
    query = 'SELECT * FROM fournisseur WHERE fssID = ? LIMIT 1';
    queryParams = [id];
  }

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ error: 'Client not found' });
    }
  });
});


app.get('/article/:reference/quantity', (req, res) => {
  const { reference } = req.params;
  const sql = 'SELECT quantite FROM article WHERE ref = ?';
  db.query(sql, [reference], (err, result) => {
      if (err) {
          res.status(500).json({ error: 'Error fetching data from database' });
      } else {
          if (result.length > 0) {
              res.json({ quantity: result[0].quantite });
          } else {
              res.status(404).json({ error: 'Article not found' });
          }
      }
  });
});

// app.get('/ssortievente', (req, res) => {
//   const query = 'SELECT * FROM ssortievente';
  
//   db.query(query, (err, results) => {
//     if (err) {
//       console.error('Error fetching data:', err);
//       return res.status(500).send('Error fetching data');
//     }
//     res.status(200).json(results);
//   });
// });
app.get('/ssortievente', (req, res) => {
  const query = 'SELECT * FROM ssortievente';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).send('Error fetching data');
    }
    console.log('Fetched data:', results); // Log fetched data
    res.status(200).json(results);
  });
});

app.get('/ssortieventecf', (req, res) => {
  const query = 'SELECT * FROM bscfvente';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).send('Error fetching data');
    }
    res.status(200).json(results);
  });
});
app.get('/articlesbsv', (req, res) => {
  const sql = 'SELECT articles FROM ssortievente';
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }

    const articles = result.flatMap(row => JSON.parse(row.articles));
    res.json(articles);
  });
});

// app.get('/articlesbsvcf', (req, res) => {
//   const sql = 'SELECT articles FROM bscfvente';
//   db.query(sql, (err, result) => {
//     if (err) {
//       return res.status(500).send(err);
//     }

//     const articles = result.flatMap(row => JSON.parse(row.articles));
//     res.json(articles);
//   });
// });
app.get('/articlesbsvcf', (req, res) => {
  const { clientName, clientCode } = req.query;
  let sql = 'SELECT articles, clName, client_id FROM bscfvente';
  let params = [];

  if (clientName || clientCode) {
    sql += ' WHERE';
    if (clientName) {
      sql += ' clName LIKE ?';
      params.push(`%${clientName}%`);
    }
    if (clientCode) {
      if (clientName) sql += ' AND';
      sql += ' client_id = ?';
      params.push(clientCode);
    }
  }

  db.query(sql, params, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }

    const articles = result.flatMap(row => {
      const parsedArticles = JSON.parse(row.articles);
      return parsedArticles.map(article => ({
        ...article,
        clName: row.clName,
        client_id: row.client_id
      }));
    });
    res.json(articles);
  });
});






app.post('/fournisseur/create', (req, res) => {
    const { fssName, fssAdr, fssTel, fssMF, fssRC, fssRES, fssRTEL } = req.body;  
    if (!fssName) {
      return res.status(400).json({ error: "fssName cannot be null or empty" });
    }

    const sql = 'INSERT INTO fournisseur (fssName, fssAdr, fssTel, fssMF, fssRC,fssRES, fssRTEL) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [fssName, fssAdr, fssTel, fssMF, fssRC,fssRES, fssRTEL];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error executing SQL query:', err);
        return res.status(500).json({ error: "Error inserting data into database" });
      }
      console.log('Data inserted successfully');
      res.status(200).json({ message: "Data inserted successfully" });
    });
  });
  
  app.post('/client/createCl', (req, res) => {
    const { clName, clAdr, clTel, clMF, clRC, responsable, resTel } = req.body;
  
    // Check if 'clName' is null or empty
    if (!clName) {
      return res.status(400).json({ error: "clName cannot be null or empty" });
    }
  
    // SQL query to insert data into database
    const sql = 'INSERT INTO client (clName, clAdr, clTel, clMF, clRC, responsable, resTel) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [clName, clAdr, clTel, clMF, clRC, responsable,resTel];
  
    // Execute the SQL query
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error executing SQL query:', err);
        return res.status(500).json({ error: "Error inserting data into database" });
      }
      console.log('Data inserted successfully');
      res.status(200).json({ message: "Data inserted successfully" });
    });
  });


  app.post('/article/createAr', (req, res) => {
    const { arName, prachat, prar1, remise1, prar2, remise2, tva, margeben, prventeht, prventettc, ref, achatttc, achatc, quantite } = req.body;
  
    if (!arName) {
      return res.status(400).json({ error: "arName cannot be null or empty" });
    }
  
    const sql = 'INSERT INTO article (arName, prachat, prar1, remise1, prar2, remise2, tva, margeben, prventeht, prventettc, ref, achatttc, achatc, quantite) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [arName, prachat, prar1, remise1, prar2, remise2, tva, margeben, prventeht, prventettc, ref, achatttc, achatc,quantite];
  
    // Execute the SQL query
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error executing SQL query:', err);
        return res.status(500).json({ error: "Error inserting data into database" });
      }
      console.log('Data inserted successfully');
      res.status(200).json({ message: "Data inserted successfully" });
    });
  });
  

  app.post('/factureAchat/createFac/', (req, res) => {
    const { fss,date,code,refArticle,quantité } = req.body;
  
    const sql = 'INSERT INTO factureachat (fss,date,code,refArticle,quantité) VALUES (?, ?, ?, ?, ?)';
    const values = [fss,date,code,refArticle,quantité];
  
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error executing SQL query:', err);
        return res.status(500).json({ error: "Error inserting data into database" });
      }
      console.log('Data inserted successfully');
      res.status(200).json({ message: "Data inserted successfully" });
    });
  });



app.post('/factureVente/createFac/', (req, res) => {
  const { clName, date, DT, refAr, totalPrice } = req.body;
  if (!clName) {
    return res.status(400).json({ error: "clName is required" });
  }
  const clientQuery = 'SELECT * FROM client WHERE clName = ?';
  db.query(clientQuery, [clName], (clientErr, clientResults) => {
    if (clientErr) {
      console.error('Error fetching client:', clientErr);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (clientResults.length === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }

    const client_id = clientResults[0].clID;
    const articles = refAr.map(({ refAr, price, quantité, remise }) => ({
      refAr,
      price,
      quantité,
      remise
    }));
    const articlesJson = JSON.stringify(articles);

    const sql = 'INSERT INTO facturevente (clName, date, DT, articles, totalPrice, client_id) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [clName, date, DT, articlesJson, totalPrice, client_id], (err, result) => {
      if (err) {
        console.error('Error inserting facture vente:', err);
        return res.status(500).json({ error: 'Error inserting facture vente into database' });
      }
      console.log('Facture vente inserted successfully');
      res.status(200).json({ message: 'Facture vente inserted successfully' });
    });
  });
});

app.post('/cfvbs/', (req, res) => {
  const { clName, date, DT, refAr, totalPrice } = req.body;

  if (!clName) {
    return res.status(400).json({ error: "clName is required" });
  }

  const clientQuery = 'SELECT * FROM client WHERE clName = ?';
  db.query(clientQuery, [clName], (clientErr, clientResults) => {
    if (clientErr) {
      console.error('Error fetching client:', clientErr);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (clientResults.length === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }

    const client_id = clientResults[0].clID;
    const articles = refAr.map(({ refAr, price, quantité, remise }) => ({
      refAr,
      price,
      quantité,
      remise
    }));
    const articlesJson = JSON.stringify(articles);

    const insertFactureQuery = 'INSERT INTO facturevente (clName, date, DT, articles, totalPrice, client_id) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(insertFactureQuery, [clName, date, DT, articlesJson, totalPrice, client_id], (err, result) => {
      if (err) {
        console.error('Error inserting facture vente:', err);
        return res.status(500).json({ error: 'Error inserting facture vente into database' });
      }

      console.log('Facture vente inserted successfully');

      const clearArticlesQuery = 'DELETE FROM ssortievente';
      db.query(clearArticlesQuery, (clearErr, clearResult) => {
        if (clearErr) {
          console.error('Error clearing articles:', clearErr);
          return res.status(500).json({ error: 'Error clearing articles table' });
        }

        console.log('Articles table cleared successfully');
        res.status(200).json({ message: 'Facture vente inserted and articles table cleared successfully' });
      });
    });
  });
});

// app.post('/cfvbscf/', (req, res) => {
//   const { clName, date, DT, refAr, totalPrice } = req.body;

//   if (!clName) {
//     return res.status(400).json({ error: "clName is required" });
//   }

//   const clientQuery = 'SELECT * FROM client WHERE clName = ?';
//   db.query(clientQuery, [clName], (clientErr, clientResults) => {
//     if (clientErr) {
//       console.error('Error fetching client:', clientErr);
//       return res.status(500).json({ error: 'Internal Server Error' });
//     }
//     if (clientResults.length === 0) {
//       return res.status(404).json({ error: 'Client not found' });
//     }

//     const client_id = clientResults[0].clID;
//     const articles = refAr.map(({ refAr, price, quantité, remise }) => ({
//       refAr,
//       price,
//       quantité,
//       remise
//     }));
//     const articlesJson = JSON.stringify(articles);

//     const insertFactureQuery = 'INSERT INTO facturevente (clName, date, DT, articles, totalPrice, client_id) VALUES (?, ?, ?, ?, ?, ?)';
//     db.query(insertFactureQuery, [clName, date, DT, articlesJson, totalPrice, client_id], (err, result) => {
//       if (err) {
//         console.error('Error inserting facture vente:', err);
//         return res.status(500).json({ error: 'Error inserting facture vente into database' });
//       }

//       console.log('Facture vente inserted successfully');

//       const clearArticlesQuery = 'DELETE FROM bscfvente';
//       db.query(clearArticlesQuery, (clearErr, clearResult) => {
//         if (clearErr) {
//           console.error('Error clearing articles:', clearErr);
//           return res.status(500).json({ error: 'Error clearing articles table' });
//         }

//         console.log('Articles table cleared successfully');
//         res.status(200).json({ message: 'Facture vente inserted and articles table cleared successfully' });
//       });
//     });
//   });
// });
app.post('/cfvbscf/', (req, res) => {
  const { clName, client_id, date, DT, refAr, totalPrice } = req.body;

  if (!clName) {
    return res.status(400).json({ error: "clName is required" });
  }

  const articles = refAr.map(({ refAr, price, quantité, remise }) => ({
    refAr,
    price,
    quantité,
    remise
  }));
  const articlesJson = JSON.stringify(articles);

  const insertFactureQuery = 'INSERT INTO facturevente (clName, date, DT, articles, totalPrice, client_id) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(insertFactureQuery, [clName, date, DT, articlesJson, totalPrice, client_id], (err, result) => {
    if (err) {
      console.error('Error inserting facture vente:', err);
      return res.status(500).json({ error: 'Error inserting facture vente into database' });
    }

    console.log('Facture vente inserted successfully');

    // Delete the posted data from bscfvente
    const deleteQuery = 'DELETE FROM bscfvente WHERE client_id = ? AND clName = ?';
    db.query(deleteQuery, [client_id, clName], (deleteErr, deleteResult) => {
      if (deleteErr) {
        console.error('Error deleting from bscfvente:', deleteErr);
        return res.status(500).json({ error: 'Error deleting from bscfvente' });
      }

      console.log('Data deleted from bscfvente successfully');
      res.status(200).json({ message: 'Facture vente inserted and data deleted from bscfvente successfully' });
    });
  });
});



app.post('/factureAchat/createFacAchat/', (req, res) => {
  console.log("Received payload:", req.body);
  const { fssName, date, DT, refAr, totalPrice } = req.body;

  console.log("Received payload:", req.body); 

  if (!fssName) {
    return res.status(400).json({ error: "fssName is required" });
  }

  const fssQuery = 'SELECT * FROM fournisseur WHERE fssName = ?';
  db.query(fssQuery, [fssName], (fssErr, fssResults) => {
    if (fssErr) {
      console.error('Error fetching fss:', fssErr);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (fssResults.length === 0) {
      return res.status(404).json({ error: 'fss not found' });
    }

    const fssID = fssResults[0].fssID; 

    const articles = refAr.map(({ refAr, price, quantité, remise }) => ({
      refAr,
      price, 
      quantité,
      remise
    }));
    const articlesJson = JSON.stringify(articles);

    // Insert the facture into the database
    const sql = 'INSERT INTO fAchat (fssName, date, DT, articles, totalPrice, fssID) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [fssName, date, DT, articlesJson, totalPrice, fssID], (err, result) => {
      if (err) {
        console.error('Error inserting facture achat:', err);
        return res.status(500).json({ error: 'Error inserting facture achat into database' });
      }
      console.log('Facture achat inserted successfully');
      res.status(200).json({ message: 'Facture achat inserted successfully' });
    });
  });
});


// app.post('/ssortievente', (req, res) => {
//   const { articles } = req.body;

//   if (!articles || !Array.isArray(articles)) {
//     return res.status(400).send('Invalid data format');
//   }

//   const articlesString = JSON.stringify(articles);

//   const query = 'INSERT INTO ssortievente (articles) VALUES (?)';

//   db.query(query, [articlesString], (err, result) => {
//     if (err) {
//       console.error('Error inserting data:', err);
//       return res.status(500).send('Error inserting data');
//     }
//     res.status(200).send('Data inserted successfully');
//   });
// });
app.post('/ssortievente', (req, res) => {
  const { articles } = req.body;

  if (!Array.isArray(articles)) {
    return res.status(400).send('Invalid data format');
  }

  const queries = articles.map(article => {
    const articleString = JSON.stringify(article);
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO ssortievente (articles) VALUES (?)';
      db.query(query, [articleString], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  });

  Promise.all(queries)
    .then(results => res.status(200).send('Data inserted successfully'))
    .catch(err => {
      console.error('Error inserting data:', err);
      res.status(500).send('Error inserting data');
    });
});


app.post('/factureVente/cfvbscf/', (req, res) => {
  const { clName, date, DT, refAr, totalPrice } = req.body;
  if (!clName) {
    return res.status(400).json({ error: "clName is required" });
  }
  const clientQuery = 'SELECT * FROM client WHERE clName = ?';
  db.query(clientQuery, [clName], (clientErr, clientResults) => {
    if (clientErr) {
      console.error('Error fetching client:', clientErr);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (clientResults.length === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }

    const client_id = clientResults[0].clID;
    const articles = refAr.map(({ refAr, price, quantité, remise }) => ({
      refAr,
      price,
      quantité,
      remise
    }));
    const articlesJson = JSON.stringify(articles);

    const sql = 'INSERT INTO bscfvente (clName, articles, totalPrice, client_id) VALUES (?, ?, ?, ?)';
    db.query(sql, [clName, articlesJson, totalPrice, client_id], (err, result) => {
      if (err) {
        console.error('Error inserting facture vente:', err);
        return res.status(500).json({ error: 'Error inserting facture vente into database' });
      }
      console.log('Facture vente  client fidele inserted successfully');
      res.status(200).json({ message: 'Facture vente inserted successfully' });
    });
  });
});

app.put('/fournisseur/update/:id', (req,res) => {
    const sql = "UPDATE fournisseur SET fssName = ?, fssAdr = ?, fssTel = ?, fssMF = ?, fssRC = ?, fssRES = ?, fssRTEL = ? WHERE fssID = ?";
    const values = [
        req.body.fssName,
        req.body.fssAdr,
        req.body.fssTel,
        req.body.fssMF,
        req.body.fssRC,
        req.body.fssRES,
        req.body.fssRTEL,
        req.params.id // Use req.params.id to get the id from URL parameter
    ];
    db.query(sql, values, (err,data) => {
        if (err) {
            console.error("Error updating data:", err);
            return res.status(500).json("Error updating data in the database");
        }
        return res.json(data);
    });
});


app.put('/client/updateCl/:id', (req,res) => {
    const sql = "UPDATE client SET clName = ?, clAdr = ?, clTel = ?, clMF = ?, clRC = ?, responsable = ?, resTel = ? WHERE clID = ?";
    const values = [
        req.body.clName,
        req.body.clAdr,
        req.body.clTel,
        req.body.clMF,
        req.body.clRC,
        req.body.responsable,
        req.body.resTel,
        req.params.id // Use req.params.id to get the id from URL parameter
    ];
    db.query(sql, values, (err,data) => {
        if (err) {
            console.error("Error updating data:", err);
            return res.status(500).json("Error updating data in the database");
        }
        return res.json(data);
    });
});


app.put('/article/updateAr/:id', (req,res) => {
    const sql = "UPDATE article SET arName = ?, prachat = ?, prar1 = ?, remise1 = ?, prar2 = ?, remise2 = ?, tva = ?, margeben = ?, prventeht = ?, prventettc = ?, ref = ?, achatttc = ?, quantite= ? WHERE arID = ?";
    const values = [
        req.body.arName,
        req.body.prachat,
        req.body.prar1,
        req.body.remise1,
        req.body.prar2,
        req.body.remise2,
        req.body.tva,
        req.body.margeben,
        req.body.prventeht,
        req.body.prventettc,    
        req.body.ref,
        req.body.achatttc,
        req.body.quantite,
        req.params.id
    ];
    db.query(sql, values, (err,data) => {
        if (err) {
            console.error("Error updating data:", err);
            return res.status(500).json("Error updating data in the database");
        }
        return res.json(data);
    });
});


app.put('/article/:reference/updateQuantity', (req, res) => {
  const { reference } = req.params;
  const { updatedQuantity } = req.body;
  
  // Perform the update operation in your database
  const sql = 'UPDATE article SET quantite = quantite - ? WHERE ref = ?';
  db.query(sql, [updatedQuantity, reference], (err, result) => {
      if (err) {
          res.status(500).json({ error: 'Error updating quantity in database' });
      } else {
          res.status(200).json({ message: 'Quantity updated successfully' });
      }
  });
});

app.put('/factureVente/update/:id', (req, res) => {
  const { id } = req.params;
  const { clName, client_id, date, DT, articles, totalPrice } = req.body;

  const articlesJSON = JSON.stringify(articles);

  const updateFactureQuery = `
    UPDATE facturevente 
    SET clName = ?, client_id = ?, date = ?, DT = ?, totalPrice = ?, articles = ?
    WHERE id = ?
  `;

  db.query(updateFactureQuery, [clName, client_id, date, DT, totalPrice, articlesJSON, id], (err, results) => {
    if (err) {
      console.error('Error updating facture: ' + err.stack);
      res.status(500).send('Error updating facture');
      return;
    }

    res.status(200).send('Facture updated successfully');
  });
});
app.put('/cfvbs/update/:id', (req, res) => {
  const { id } = req.params;
  const { clName, client_id, date, DT, articles, totalPrice } = req.body;

  const articlesJSON = JSON.stringify(articles);

  const updateFactureQuery = `
    UPDATE saisiesortie 
    SET clName = ?, client_id = ?, date = ?, DT = ?, totalPrice = ?, articles = ?
    WHERE id = ?
  `;

  db.query(updateFactureQuery, [clName, client_id, date, DT, totalPrice, articlesJSON, id], (err, results) => {
    if (err) {
      console.error('Error updating facture: ' + err.stack);
      res.status(500).send('Error updating facture');
      return;
    }

    res.status(200).send('Facture updated successfully');
  });
});
app.put('/factureAchat/update/:id', (req, res) => {
  const { id } = req.params;
  const { fssName, fssID, date, DT, articles, totalPrice } = req.body;

  const articlesJSON = JSON.stringify(articles);

  const updateFactureQuery = `
    UPDATE fAchat 
    SET fssName = ?, fssID = ?, date = ?, DT = ?, totalPrice = ?, articles = ?
    WHERE id = ?
  `;

  db.query(updateFactureQuery, [fssName, fssID, date, DT, totalPrice, articlesJSON, id], (err, results) => {
    if (err) {
      console.error('Error updating facture: ' + err.stack);
      res.status(500).send('Error updating facture');
      return;
    }

    res.status(200).send('Facture updated successfully');
  });
});

app.put('/article/:ref/updateStock', (req, res) => {
  const { ref } = req.params;
  const { quantity } = req.body;

  console.log(`Received request to update stock for ref: ${ref} with quantity: ${quantity}`);

  db.query('SELECT quantite FROM article WHERE ref = ?', [ref], (err, results) => {
    if (err) {
      console.error('Error fetching article quantity:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (results.length === 0) {
      console.log('Article not found');
      res.status(404).json({ error: 'Article not found' });
      return;
    }

    const currentQuantity = results[0].quantite;
    const newQuantity = currentQuantity - quantity;

    if (newQuantity < 0) {
      console.log('Insufficient stock');
      res.status(400).json({ error: 'Insufficient stock' });
      return;
    }

    db.query('UPDATE article SET quantite = ? WHERE ref = ?', [newQuantity, ref], (updateErr, updateResults) => {
      if (updateErr) {
        console.error('Error updating article quantity:', updateErr);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      console.log('Stock updated successfully');
      res.status(200).json({ message: 'Stock updated successfully' });
    });
  });
});

app.put('/article/:ref/updateStockAchat', (req, res) => {
  const { ref } = req.params;
  const { quantity } = req.body;

  console.log(`Received request to update stock for ref: ${ref} with quantity: ${quantity}`);

  db.query('SELECT quantite FROM article WHERE ref = ?', [ref], (err, results) => {
    if (err) {
      console.error('Error fetching article quantity:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (results.length === 0) {
      console.log('Article not found');
      res.status(404).json({ error: 'Article not found' });
      return;
    }

    const currentQuantity = results[0].quantite;
    const newQuantity = currentQuantity + Number(quantity);

    if (newQuantity < 0) {
      console.log('Insufficient stock');
      res.status(400).json({ error: 'Insufficient stock' });
      return;
    }

    db.query('UPDATE article SET quantite = ? WHERE ref = ?', [newQuantity, ref], (updateErr, updateResults) => {
      if (updateErr) {
        console.error('Error updating article quantity:', updateErr);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      console.log('Stock updated successfully');
      res.status(200).json({ message: 'Stock updated successfully' });
    });
  });
});

app.put('/factureVentecf/update/:id', (req, res) => {
  const { id } = req.params;
  const { clName, client_id, articles, totalPrice } = req.body;

  const articlesJSON = JSON.stringify(articles);

  const updateFactureQuery = `
    UPDATE bscfvente 
    SET clName = ?, client_id = ?, totalPrice = ?, articles = ?
    WHERE id = ?
  `;

  db.query(updateFactureQuery, [clName, client_id, totalPrice, articlesJSON, id], (err, results) => {
    if (err) {
      console.error('Error updating facture: ' + err.stack);
      res.status(500).send('Error updating facture');
      return;
    }

    res.status(200).send('Facture updated successfully');
  });
});



app.delete('/fournisseur/:id', (req, res) => {
    const sql = "DELETE FROM fournisseur WHERE fssID = ?";
    const id = req.params.id;

    db.query(sql, [id], (err, data) => {
        if (err) {
            console.error("Error deleting fournisseur:", err);
            return res.status(500).json("Error deleting fournisseur");
        }
        return res.json(data);
    });
});

app.delete('/client/:id', (req, res) => {
    const sql = "DELETE FROM client WHERE clID = ?";
    const id = req.params.id;

    db.query(sql, [id], (err, data) => {
        if (err) {
            console.error("Error deleting client:", err);
            return res.status(500).json("Error deleting client");
        }
        return res.json(data);
    });
});

app.delete('/article/:id', (req, res) => {
    const sql = "DELETE FROM article WHERE arID = ?";
    const id = req.params.id;

    db.query(sql, [id], (err, data) => {
        if (err) {
            console.error("Error deleting client:", err);
            return res.status(500).json("Error deleting client");
        }
        return res.json(data);
    });
});

app.delete('/factureVente/:id', (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM facturevente WHERE id = ?";

  db.query(sql, [id], (err, result) => {
      if (err) {
          console.error("Error deleting facture vente:", err);
          return res.status(500).json({ error: "Error deleting facture vente" });
      }
      console.log("Facture vente deleted successfully");
      return res.status(200).json({ message: "Facture vente deleted successfully" });
  });
});

app.delete('/factureAchat/:id', (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM fachat WHERE id = ?";

  db.query(sql, [id], (err, result) => {
      if (err) {
          console.error("Error deleting facture achat:", err);
          return res.status(500).json({ error: "Error deleting facture achat" });
      }
      console.log("Facture achat deleted successfully");
      return res.status(200).json({ message: "Facture achat deleted successfully" });
  });
});

app.delete('/fvbs/:id', (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM ssortievente WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting facture vente:", err);
      return res.status(500).json({ error: "Error deleting facture vente" });
    }
    console.log("Facture vente deleted successfully");
    return res.status(200).json({ message: "Facture vente deleted successfully" });
  });
});

app.delete('/factureVentecf/:id', (req, res) => {
  const id = req.params.id;
  console.log(`Received request to delete facture with id: ${id}`);
  const sql = "DELETE FROM bscfvente WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting facture vente cf:", err);
      return res.status(500).json({ error: "Error deleting facture achat" });
    }
    if (result.affectedRows === 0) {
      console.log(`No facture found with id: ${id}`);
      return res.status(404).json({ error: "Facture not found" });
    }
    console.log("Facture vente cf deleted successfully");
    return res.status(200).json({ message: "Facture achat deleted successfully" });
  });
});


// const PORT = process.env.PORT || 7777;


app.listen(7777, () => {
    console.log("listening");
})
