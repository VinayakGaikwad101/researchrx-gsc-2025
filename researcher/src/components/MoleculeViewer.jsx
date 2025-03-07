import React, { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

const commonMolecules = [
  {
    name: "Aspirin",
    smiles: "CC(=O)OC1=CC=CC=C1C(=O)O",
    description: "Pain reliever and anti-inflammatory drug",
  },
  {
    name: "Caffeine",
    smiles: "CN1C=NC2=C1C(=O)N(C(=O)N2C)C",
    description: "Stimulant found in coffee and tea",
  },
  {
    name: "Paracetamol (Acetaminophen)",
    smiles: "CC(=O)NC1=CC=C(O)C=C1",
    description: "Pain reliever and fever reducer",
  },
  {
    name: "Ibuprofen",
    smiles: "CC(C)CC1=CC=C(C=C1)[C@H](C)C(=O)O",
    description: "Non-steroidal anti-inflammatory drug",
  },
  {
    name: "Glucose",
    smiles: "C([C@@H]1[C@H]([C@@H]([C@H](C(O1)O)O)O)O)O",
    description: "Simple sugar, primary energy source",
  },
  {
    name: "Penicillin G",
    smiles: "CC1(C(N2C(S1)C(C2=O)NC(=O)CC3=CC=CC=C3)C(=O)O)C",
    description: "First mass-produced antibiotic",
  },
  {
    name: "Ethanol",
    smiles: "CCO",
    description: "Simple alcohol",
  },
];

const MoleculeViewer = () => {
  const [smiles, setSmiles] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMolecule, setSelectedMolecule] = useState(null);

  const fetchMoleculeStructure = async (smilesInput) => {
    setLoading(true);
    setError(null);
    try {
      // First, convert SMILES to PubChem CID
      const searchUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/${encodeURIComponent(
        smilesInput
      )}/cids/JSON`;
      const response = await fetch(searchUrl);
      const data = await response.json();

      if (data.IdentifierList?.CID?.[0]) {
        const cid = data.IdentifierList.CID[0];
        // Get 2D image from PubChem
        setImageUrl(
          `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/${cid}/PNG`
        );
      } else {
        setError("Could not find molecule structure for given SMILES");
      }
    } catch (err) {
      setError("Error fetching molecule structure");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetchMoleculeStructure(smiles);
  };

  const handleExampleClick = async (molecule) => {
    setSmiles(molecule.smiles);
    setSelectedMolecule(molecule);
    await fetchMoleculeStructure(molecule.smiles);
  };

  // Initial load of the first molecule
  useEffect(() => {
    if (commonMolecules.length > 0) {
      const firstMolecule = commonMolecules[0];
      setSmiles(firstMolecule.smiles);
      setSelectedMolecule(firstMolecule);
      fetchMoleculeStructure(firstMolecule.smiles);
    }
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Molecule Viewer</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              value={smiles}
              onChange={(e) => setSmiles(e.target.value)}
              placeholder="Enter SMILES notation"
              className="w-full"
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Loading..." : "View Molecule"}
          </Button>
        </form>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {imageUrl && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">
              {selectedMolecule
                ? selectedMolecule.name
                : "Molecular Structure:"}
            </h3>
            <img
              src={imageUrl}
              alt="Molecular structure"
              className="max-w-full h-auto border rounded-lg"
            />
            {selectedMolecule && (
              <p className="text-sm text-gray-600 mt-2">
                {selectedMolecule.description}
              </p>
            )}
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Example Molecules</h2>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            {commonMolecules.map((molecule, index) => (
              <Card
                key={index}
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleExampleClick(molecule)}
              >
                <h3 className="font-semibold text-blue-600">{molecule.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {molecule.description}
                </p>
                <p className="text-xs font-mono text-gray-500 mt-2 break-all">
                  SMILES: {molecule.smiles}
                </p>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default MoleculeViewer;
