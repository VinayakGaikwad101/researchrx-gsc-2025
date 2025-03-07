import { useState, useEffect } from 'react';
import useDrugStore from '../store/useDrugStore';
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";

const DrugSearch = () => {
  const {
    contributedDrugs,
    publicDrugs,
    loading,
    error,
    selectedDrug,
    searchDrugs,
    addDrugContribution,
    getContributedDrugs,
    addNote,
    setSelectedDrug,
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    toggleVisibility
  } = useDrugStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [smilesInput, setSmilesInput] = useState('');
  const [newDrugName, setNewDrugName] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    if (activeTab === 'contributed') {
      getContributedDrugs();
    }
  }, [activeTab]);

  useEffect(() => {
    const debounceSearch = setTimeout(() => {
      if (searchTerm.trim()) {
        searchDrugs(searchTerm);
      }
    }, 500);

    return () => clearTimeout(debounceSearch);
  }, [searchTerm, activeTab]);

  const handleDrugClick = (drug) => {
    setSelectedDrug(drug);
    setIsModalOpen(true);
  };

  const handleAddDrug = async () => {
    if (smilesInput.trim() && newDrugName.trim()) {
      try {
        await addDrugContribution(smilesInput, newDrugName, isPublic);
        setSmilesInput('');
        setNewDrugName('');
        setIsPublic(false);
      } catch (error) {
        console.error('Failed to add drug:', error);
      }
    }
  };

  const handleToggleVisibility = async (drugId) => {
    try {
      await toggleVisibility(drugId);
    } catch (error) {
      console.error('Failed to toggle visibility:', error);
    }
  };

  const handleAddNote = async () => {
    if (noteInput.trim() && selectedDrug?._id) {
      try {
        await addNote(selectedDrug._id, noteInput);
        setNoteInput('');
      } catch (error) {
        console.error('Failed to add note:', error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="contributed">Contributed Drugs</TabsTrigger>
          <TabsTrigger value="public">Public Drugs</TabsTrigger>
          <TabsTrigger value="contribute">Contribute Drug</TabsTrigger>
        </TabsList>

        <TabsContent value="contributed">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Contributed Drugs</h2>
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Search contributed drugs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />

              {loading && <p className="text-gray-500">Loading...</p>}
              {error && <p className="text-red-500">Error: {error}</p>}

              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {contributedDrugs.map((drug) => (
                    <Card
                      key={drug._id}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div 
                          className="flex-grow cursor-pointer"
                          onClick={() => handleDrugClick(drug)}
                        >
                          <h3 className="font-semibold">{drug.name}</h3>
                          <p className="text-sm text-gray-600">SMILES: {drug.smiles}</p>
                          <p className="text-xs text-gray-500">
                            Contributed by: {drug.contributor?.name || 'Unknown'}
                          </p>
                        </div>
                        {drug.contributor?._id === localStorage.getItem('userId') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleVisibility(drug._id)}
                          >
                            {drug.isPublic ? 'Make Private' : 'Make Public'}
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="public">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Public Drugs</h2>
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Search public drugs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />

              {loading && <p className="text-gray-500">Loading...</p>}
              {error && <p className="text-red-500">Error: {error}</p>}

              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {publicDrugs.map((drug, index) => (
                    <Card
                      key={index}
                      onClick={() => handleDrugClick(drug)}
                      className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <h3 className="font-semibold">{drug.name}</h3>
                      <p className="text-sm text-gray-600">SMILES: {drug.smiles}</p>
                      <p className="text-xs text-gray-500">
                        Source: {drug.source}
                      </p>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="contribute">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Contribute New Drug</h2>
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Drug name..."
                value={newDrugName}
                onChange={(e) => setNewDrugName(e.target.value)}
              />
              <Input
                type="text"
                placeholder="SMILES notation..."
                value={smilesInput}
                onChange={(e) => setSmilesInput(e.target.value)}
              />
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="isPublic" className="text-sm text-gray-700">
                  Make this drug public
                </label>
              </div>
              <Button onClick={handleAddDrug} disabled={!smilesInput.trim() || !newDrugName.trim()}>
                Add Drug
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        {selectedDrug && (
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {selectedDrug.name}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              <div>
                <h4 className="font-semibold">SMILES</h4>
                <p className="font-mono text-sm">{selectedDrug.smiles}</p>
              </div>
              {selectedDrug.notes && selectedDrug.notes.length > 0 && (
                <div>
                  <h4 className="font-semibold">Research Notes</h4>
                  <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                    {selectedDrug.notes.map((note, index) => (
                      <div key={index} className="mb-4 last:mb-0">
                        <p className="text-sm text-gray-600">{note.note}</p>
                        <p className="text-xs text-gray-500">
                          By {note.researcher?.name || 'Unknown'} on{' '}
                          {new Date(note.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </ScrollArea>
                </div>
              )}
              <div className="space-y-2">
                <h4 className="font-semibold">Add Note</h4>
                <Textarea
                  placeholder="Add your research notes..."
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddNote} disabled={!noteInput.trim()}>
                Add Note
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default DrugSearch;
