import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  researcher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  note: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const drugContributionSchema = new mongoose.Schema({
  smiles: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  contributor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notes: [noteSchema],
  isPublic: {
    type: Boolean,
    default: false
  },
  source: {
    type: String,
    enum: ['contributed', 'pubchem'],
    default: 'contributed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const DrugContribution = mongoose.model('DrugContribution', drugContributionSchema);

export default DrugContribution;
