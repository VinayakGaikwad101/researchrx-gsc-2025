import { useEffect, useState } from "react";
import usePubChemStore from "../store/usePubChemStore";
import Modal from "./Modal";

const PeriodicTable = () => {
  const { elements, loading, error, fetchElements, getCompoundIdByName } =
    usePubChemStore();
  const [selectedElement, setSelectedElement] = useState(null);
  const [cid, setCid] = useState(null);

  useEffect(() => {
    fetchElements();
  }, [fetchElements]);

  useEffect(() => {
    async function fetchCid() {
      if (selectedElement) {
        try {
          const symbol = selectedElement.Cell[1]; // Using the symbol to fetch the CID
          const cid = await getCompoundIdByName(symbol);
          setCid(cid);
        } catch (error) {
          console.error("Failed to fetch CID from PubChem API", error);
        }
      }
    }

    fetchCid();
  }, [selectedElement, getCompoundIdByName]);

  if (loading) return <div className="text-center text-2xl">Loading...</div>;
  if (error)
    return (
      <div className="text-center text-2xl text-red-500">Error: {error}</div>
    );

  const getElementColor = (groupBlock) => {
    const colors = {
      "Alkali metal": "#ff6b6b",
      "Alkaline earth metal": "#feca57",
      "Transition metal": "#48dbfb",
      "Post-transition metal": "#ff9ff3",
      Metalloid: "#54a0ff",
      Nonmetal: "#5f27cd",
      Halogen: "#ff6b6b",
      "Noble gas": "#ff9ff3",
      Lanthanide: "#1dd1a1",
      Actinide: "#54a0ff",
    };
    return colors[groupBlock] || "#c8d6e5";
  };

  const renderElement = (element) => {
    const [
      atomicNumber,
      symbol,
      name,
      atomicMass,
      ,
      ,
      ,
      ,
      ,
      ,
      ,
      ,
      ,
      ,
      ,
      groupBlock,
    ] = element.Cell;
    const color = getElementColor(groupBlock);
    return (
      <div
        key={atomicNumber}
        className={`w-16 h-16 p-1 border border-gray-300 flex flex-col items-center justify-center text-xs cursor-pointer transition-transform hover:scale-110`}
        style={{ backgroundColor: color }}
        onClick={() => setSelectedElement(element)}
        title={name}
      >
        <div className="atom-svg"></div>
        <div className="font-bold">{symbol}</div>
        <div>{atomicNumber}</div>
      </div>
    );
  };

  const grid = Array(10)
    .fill(null)
    .map(() => Array(18).fill(null));

  elements.forEach((element) => {
    const atomicNumber = Number.parseInt(element.Cell[0]);
    let row, col;
    if (
      atomicNumber <= 57 ||
      (atomicNumber >= 72 && atomicNumber <= 89) ||
      atomicNumber >= 104
    ) {
      row = Math.ceil(atomicNumber / 18) - 1;
      col = (atomicNumber - 1) % 18;
    } else if (atomicNumber <= 71) {
      row = 8;
      col = atomicNumber - 57;
    } else {
      row = 9;
      col = atomicNumber - 89;
    }
    grid[row][col] = element;
  });

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Periodic Table</h1>
      <div className="overflow-auto">
        <div className="grid gap-1" style={{ minWidth: "900px" }}>
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-1">
              {row.map((element, colIndex) =>
                element ? (
                  renderElement(element)
                ) : (
                  <div key={colIndex} className="w-16 h-16" />
                )
              )}
            </div>
          ))}
        </div>
      </div>
      <Modal
        isOpen={!!selectedElement}
        onClose={() => setSelectedElement(null)}
      >
        {selectedElement && (
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4">
              {selectedElement.Cell[2]}
            </h2>
            <div className="w-64 h-64 mb-4">
              {cid ? (
                <iframe
                  style={{ width: "100%", height: "100%" }}
                  src={`https://embed.molview.org/v1/?mode=vdw&cid=${cid}&bg=white`}
                  title={`${selectedElement.Cell[2]} Atom 3D Model`}
                ></iframe>
              ) : (
                <p>3D model not available for this element.</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>Symbol: {selectedElement.Cell[1]}</div>
              <div>Atomic Number: {selectedElement.Cell[0]}</div>
              <div>Atomic Mass: {selectedElement.Cell[3]}</div>
              <div>Group Block: {selectedElement.Cell[15]}</div>
              <div>Electron Configuration: {selectedElement.Cell[5]}</div>
              <div>Oxidation States: {selectedElement.Cell[10]}</div>
              <div>Standard State: {selectedElement.Cell[11]}</div>
              <div>Melting Point: {selectedElement.Cell[12]} K</div>
              <div>Boiling Point: {selectedElement.Cell[13]} K</div>
              <div>Year Discovered: {selectedElement.Cell[16]}</div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PeriodicTable;
