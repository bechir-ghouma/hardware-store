import React, { useState, useEffect } from "react";
import axios from "axios";

function CreateArticle({ onAddArticle, onDelete, selectedArticle }) {
  const [name, setName] = useState("");
  const [ref, setRef] = useState("");
  const [achatbrut, setAchatbrut] = useState("");
  const [remise1, setRemise1] = useState("");
  const [remise2, setRemise2] = useState("0");
  const [achatttc, setAchatttc] = useState("");
  const [achatc, setAchatc] = useState("");
  const [mbenif, setMbenif] = useState("");
  const [venteht, setVenteht] = useState("");
  const [ventettc, setVentettc] = useState("");
  const [autofillar1, setAutofillar1] = useState("");
  const [autofillar2, setAutofillar2] = useState("0");
  const [selectedTva, setSelectedTva] = useState("0");
  const [quantite, setQuantite] = useState("");

  useEffect(() => {
    if (selectedArticle) {
      setName(selectedArticle.arName || "");
      setRef(selectedArticle.ref || "");
      setAchatbrut(selectedArticle.prachat || "");
      setRemise1(selectedArticle.remise1 || "");
      setRemise2(selectedArticle.remise2 || "0");
      setAchatttc(selectedArticle.achatttc || "");
      setAchatc(selectedArticle.achatc || "");
      setMbenif(selectedArticle.margeben || "");
      setVenteht(selectedArticle.prventeht || "");
      setVentettc(selectedArticle.prventettc || "");
      setAutofillar1(selectedArticle.prar1 || "");
      setAutofillar2(selectedArticle.prar2 || "0");
      setSelectedTva(selectedArticle.tva?.toString() || "0");
      setQuantite(selectedArticle.quantite || "");
    }
  }, [selectedArticle]);

  const fetchArticleData = async (searchTerm, searchBy) => {
    try {
      const response = await axios.get(`http://localhost:7777/article/search`, {
        params: { [searchBy]: searchTerm }
      });
      const article = response.data;
      if (article) {
        setName(article.arName || "");
        setRef(article.ref || "");
        setAchatbrut(article.prachat || "");
        setRemise1(article.remise1 || "");
        setRemise2(article.remise2 || "0");
        setAchatttc(article.achatttc || "");
        setAchatc(article.achatc || "");
        setMbenif(article.margeben || "");
        setVenteht(article.prventeht || "");
        setVentettc(article.prventettc || "");
        setAutofillar1(article.prar1 || "");
        setAutofillar2(article.prar2 || "0");
        setSelectedTva(article.tva?.toString() || "0");
        setQuantite(article.quantite || "");
      }
    } catch (error) {
      console.error("Error fetching article data:", error);
    }
  };

  useEffect(() => {
    if (name) {
      fetchArticleData(name, "arName");
    }
  }, [name]);

  useEffect(() => {
    if (ref) {
      fetchArticleData(ref, "ref");
    }
  }, [ref]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedTva !== null && selectedTva !== undefined) {
      axios
        .post("http://localhost:7777/article/createAr/", {
          arName: name,
          ref: ref,
          prachat: achatbrut,
          remise1: remise1,
          prar1: autofillar1,
          remise2: remise2,
          prar2: autofillar2,
          tva: parseInt(selectedTva),
          achatttc: achatttc,
          achatc: achatc,
          margeben: mbenif,
          prventeht: venteht,
          prventettc: ventettc,
          quantite: quantite  
        })
        .then((res) => {
          window.location.reload();
        })
        .catch((err) => console.log(err));
    } else {
      console.log("Invalid value of tva");
    }
  };

  const handleUpdate = (event) => {
    event.preventDefault();
    if (selectedArticle) {
      axios
        .put(`http://localhost:7777/article/updateAr/${selectedArticle.arID}`, {
          arName: name,
          ref: ref,
          prachat: achatbrut,
          remise1: remise1,
          prar1: autofillar1,
          remise2: remise2,
          prar2: autofillar2,
          tva: parseInt(selectedTva),
          achatttc: achatttc,
          achatc: achatc,
          margeben: mbenif,
          prventeht: venteht,
          prventettc: ventettc,
          quantite: quantite  
        })
        .then((res) => {
          console.log("Article updated successfully");
          window.location.reload();
        })
        .catch((err) => console.log(err));
    } else {
      console.log("No article selected for update");
    }
  };

  useEffect(() => {
    if (achatbrut && remise1) {
      const prixAR1 = parseFloat(achatbrut) * (1 - parseFloat(remise1) / 100);
      setAutofillar1(prixAR1.toFixed(3));
    } else {
      setAutofillar1("");
    }
  }, [achatbrut, remise1]);

  useEffect(() => {
    if (autofillar1 && remise2) {
      const prixAR2 = parseFloat(autofillar1) * (1 - parseFloat(remise2) / 100);
      setAutofillar2(prixAR2.toFixed(3));
    } else {
      setAutofillar2("");
    }
  }, [autofillar1, remise2]);

  useEffect(() => {
    if (autofillar1 && remise2) {
      setAchatttc(autofillar2);
    } else {
      setAchatttc(autofillar1);
    }
  }, [autofillar1, autofillar2, remise2]);

  useEffect(() => {
    if (achatttc && mbenif) {
      const sum = (parseFloat(achatttc) / 100 * parseFloat(mbenif)) + parseFloat(achatttc);
      setVenteht(sum.toFixed(3));
    } else {
      setVenteht("");
    }
  }, [achatttc, mbenif]);

  useEffect(() => {
    if (venteht && selectedTva) {
      const sum = parseFloat(venteht) + (parseFloat(venteht) * parseFloat(selectedTva) / 100);
      setVentettc(sum.toFixed(3));
    } else {
      setVentettc("");
    }
  }, [venteht, selectedTva]);

  useEffect(() => {
    if (achatttc && selectedTva) {
      const sum = parseFloat(achatttc) + (parseFloat(achatttc) * parseFloat(selectedTva) / 100);
      setAchatc(sum.toFixed(3));
    } else {
      setAchatc("");
    }
  }, [achatttc, selectedTva]);

  const handleClearInputs = () => {
    setName("");
    setRef("");
    setAchatbrut("");
    setRemise1("");
    setRemise2("0");
    setAchatttc("");
    setAchatc("");
    setMbenif("");
    setVenteht("");
    setVentettc("");
    setAutofillar1("");
    setAutofillar2("0");
    setSelectedTva("0");
    setQuantite("");
  };

  return (
    <div style={{ margin: "20px", display: "flex", justifyContent: "flex-end" }}>
      <div style={{ flex: "0.7", marginRight: "10px" }}>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ width: "120px" }} htmlFor="ref">Référence</label>
          <input
            style={{ width: "200px" }}
            type="text"
            id="ref"
            value={ref}
            onChange={(e) => setRef(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ width: "120px" }} htmlFor="name">Nom d'article</label>
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
        <div style={{ marginBottom: "10px" }}>
          <label style={{ width: "120px" }} htmlFor="quantite">Quantité</label>
          <input
            style={{ width: "200px" }}
            type="number"
            id="quantite"
            value={quantite}
            onChange={(e) => setQuantite(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ width: "120px" }} htmlFor="achatbrut">Prix d'achat brut</label>
          <input
            style={{ width: "200px" }}
            type="number"
            id="achatbrut"
            value={achatbrut}
            onChange={(e) => setAchatbrut(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ width: "120px" }} htmlFor="remise1">Remise 1</label>
          <input
            style={{ width: "200px" }}
            type="number"
            id="remise1"
            value={remise1}
            onChange={(e) => setRemise1(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ width: "120px" }} htmlFor="remise2">Remise 2</label>
          <input
            style={{ width: "200px" }}
            type="text"
            id="remise2"
            value={remise2}
            onChange={(e) => setRemise2(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ width: "120px" }} htmlFor="achatttc">Prix d'achat HT</label>
          <input
            style={{ width: "200px" }}
            type="text"
            id="achatttc"
            value={achatttc}
            onChange={(e) => setAchatttc(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ width: "120px" }} htmlFor="tva">TVA</label>
          <select
            style={{ width: "200px" }}
            id="tva"
            value={selectedTva}
            onChange={(e) => setSelectedTva(e.target.value)}
          >
            <option value="0">0%</option>
            <option value="7">7%</option>
            <option value="13">13%</option>
            <option value="19">19%</option>
          </select>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ width: "120px" }} htmlFor="achatc">Prix d'achatc TTC</label>
          <input style={{ width: "200px" }} type="text" id="achatc" readOnly value={achatc} />
        </div>
      </div>

      <div style={{ flex: "1", marginRight: "10px" }}>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ width: "120px" }} htmlFor="mbenif">Marge bénéficiaire</label>
          <input
            style={{ width: "200px" }}
            type="text"
            id="mbenif"
            value={mbenif}
            onChange={(e) => setMbenif(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ width: "120px" }} htmlFor="venteht">Prix de vente HT</label>
          <input style={{ width: "200px" }} type="text" id="venteht" readOnly value={venteht} />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ width: "120px" }} htmlFor="ventettc">Prix de vente TTC</label>
          <input style={{ width: "200px" }} type="text" id="ventettc" readOnly value={ventettc} />
        </div>
      </div>

      <div style={{ flex: "1", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <button style={{ width: "200px", marginBottom: "10px" }} type="button" onClick={handleSubmit}>Ajouter</button>
        <button
          style={{ width: "200px", marginBottom: "10px" }}
          type="button"
          onClick={() => {
            if (selectedArticle) {
              const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer cette colonne ?");
              if (confirmed) {
                onDelete(selectedArticle.arID);
                handleClearInputs();
              }
            } else {
              console.log("No article selected for deletion");
            }
          }}
        >
          Supprimer
        </button>
        <button style={{ width: "200px", marginBottom: "10px" }} type="button" onClick={handleUpdate}>Enregistrer</button>
        <button style={{ width: "200px", marginTop: "10px" }} type="button" onClick={handleClearInputs}>Videz les champs</button>
      </div>
    </div>
  );
}

export default CreateArticle;
