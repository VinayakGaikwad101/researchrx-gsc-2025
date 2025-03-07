import { useState, useEffect } from 'react';
import useDrugStore from '../store/useDrugStore';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const DrugSearch = () => {
  const { drugs, loading, error, searchTerm, selectedDrug, setSearchTerm, searchDrugs, setSelectedDrug } = useDrugStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const debounceSearch = setTimeout(() => {
      if (searchTerm.trim()) {
        searchDrugs(searchTerm);
      }
    }, 500);

    return () => clearTimeout(debounceSearch);
  }, [searchTerm]);

  const handleDrugClick = (drug) => {
    setSelectedDrug(drug);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Drug Search</h2>
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Search for drugs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />

          {loading && <p className="text-gray-500">Loading...</p>}
          {error && <p className="text-red-500">Error: {error}</p>}

          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {drugs.map((drug) => (
                <Card
                  key={drug.product_id}
                  onClick={() => handleDrugClick(drug)}
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-semibold">{drug.brand_name}</h3>
                  <p className="text-sm text-gray-600">{drug.generic_name}</p>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        {selectedDrug && (
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedDrug.brand_name}</DialogTitle>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              <div>
                <h4 className="font-semibold">Generic Name</h4>
                <p>{selectedDrug.generic_name}</p>
              </div>
              <div>
                <h4 className="font-semibold">Manufacturer</h4>
                <p>{selectedDrug.labeler_name}</p>
              </div>
              <div>
                <h4 className="font-semibold">Product Type</h4>
                <p>{selectedDrug.product_type}</p>
              </div>
              <div>
                <h4 className="font-semibold">Route</h4>
                <p>{selectedDrug.route?.join(', ')}</p>
              </div>
              {selectedDrug.active_ingredients && (
                <div>
                  <h4 className="font-semibold">Active Ingredients</h4>
                  <ul className="list-disc pl-5">
                    {selectedDrug.active_ingredients.map((ingredient, index) => (
                      <li key={index}>
                        {ingredient.name} - {ingredient.strength}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {selectedDrug.pharm_class && (
                <div>
                  <h4 className="font-semibold">Pharmaceutical Class</h4>
                  <ul className="list-disc pl-5">
                    {selectedDrug.pharm_class.map((className, index) => (
                      <li key={index}>{className}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default DrugSearch;
