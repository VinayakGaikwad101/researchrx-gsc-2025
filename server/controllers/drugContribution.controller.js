import DrugContribution from "../models/drugContribution.model.js";

// Add a new drug contribution
export const addDrugContribution = async (req, res) => {
  try {
    const { smiles, name, isPublic = false } = req.body;
    const contribution = new DrugContribution({
      smiles,
      name,
      contributor: req.user._id,
      isPublic,
      source: 'contributed'
    });
    await contribution.save();
    res.status(201).json(contribution);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all drug contributions
export const getDrugContributions = async (req, res) => {
  try {
    const { source } = req.query;
    let query = {};
    
    if (source) {
      query.source = source;
    }

    const contributions = await DrugContribution.find(query)
      .populate('contributor', 'name email')
      .populate('notes.researcher', 'name email');
    res.json(contributions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search drugs by name or SMILES
export const searchBySmiles = async (req, res) => {
  try {
    const { name, smiles, source } = req.query;
    let query = {};
    
    if (name) {
      query.name = { $regex: name, $options: 'i' };
    } else if (smiles) {
      query.smiles = { $regex: smiles, $options: 'i' };
    }

    if (source) {
      query.source = source;
    }

    const drugs = await DrugContribution.find(query)
      .populate('contributor', 'name email')
      .populate('notes.researcher', 'name email');
    res.json(drugs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a note to a drug
export const addNote = async (req, res) => {
  try {
    const { drugId } = req.params;
    const { note } = req.body;
    
    const drug = await DrugContribution.findById(drugId);
    if (!drug) {
      return res.status(404).json({ message: "Drug not found" });
    }

    drug.notes.push({
      researcher: req.user._id,
      note
    });

    await drug.save();
    
    const updatedDrug = await DrugContribution.findById(drugId)
      .populate('contributor', 'name email')
      .populate('notes.researcher', 'name email');
      
    res.json(updatedDrug);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle drug visibility
export const toggleVisibility = async (req, res) => {
  try {
    const { drugId } = req.params;
    const drug = await DrugContribution.findById(drugId);
    
    if (!drug) {
      return res.status(404).json({ message: "Drug not found" });
    }

    // Only allow contributor to toggle visibility
    if (drug.contributor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to modify this drug" });
    }

    drug.isPublic = !drug.isPublic;
    await drug.save();

    const updatedDrug = await DrugContribution.findById(drugId)
      .populate('contributor', 'name email')
      .populate('notes.researcher', 'name email');
    
    res.json(updatedDrug);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search public drugs from PubChem
export const searchPublicDrugs = async (req, res) => {
  try {
    const { name } = req.query;
    const response = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(name)}/property/IUPACName,CanonicalSMILES/JSON`);
    
    if (!response.ok) {
      return res.json({ compounds: [] });
    }

    const data = await response.json();
    const compounds = data.PropertyTable.Properties.map(compound => ({
      name: compound.IUPACName,
      smiles: compound.CanonicalSMILES,
      source: 'pubchem',
      isPublic: true
    }));

    res.json({ compounds });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
