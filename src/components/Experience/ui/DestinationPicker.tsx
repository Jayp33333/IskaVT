import { useState, useMemo } from "react";
import useWorld from "../../../hooks/useWorld";
import { DESTINATIONS } from "../../../sampleData";
import { IoChevronDown } from "react-icons/io5";

export const DestinationPicker = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const setPinPosition = useWorld((s: any) => s.setPinPosition);
  const setIsPinConfirmed = useWorld((s: any) => s.setIsPinConfirmed);
  const setSelectPin = useWorld((s: any) => s.setSelectPin);
  const setIsPinTeleported = useWorld((s: any) => s.setIsPinTeleported);

  const filteredDestinations = useMemo(
    () =>
      DESTINATIONS.filter((d) =>
        d.name.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  const handleSelect = (destination: any) => {
    setPinPosition(destination.position.clone());
    setIsPinConfirmed(true);
    setSelectPin(false);
    setIsPinTeleported(false);
    setOpen(false);
    setQuery("");
  };

  return (
    <div className="fixed top-[2vh] left-1/2 z-300 w-[260px] -translate-x-1/2 rounded-lg bg-black/45 backdrop-blur-md text-white">
      {/* Combo Box Header */}
      <div
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between cursor-pointer px-4 py-3 text-sm"
      >
        <span>Select Destination</span>
        <IoChevronDown
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="border-t border-white/15 max-h-60 overflow-hidden">
          {/* Search Input */}
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search location..."
            className="w-full px-3 py-2 text-sm bg-black/60 text-white outline-none"
          />

          {/* Results */}
          <div className="max-h-[180px] overflow-y-auto">
            {filteredDestinations.length === 0 && (
              <div className="px-3 py-2 text-xs text-center opacity-70">
                No destination found
              </div>
            )}

            {filteredDestinations.map((d) => (
              <div
                key={d.id}
                onClick={() => handleSelect(d)}
                className="px-3 py-2 text-sm cursor-pointer border-b border-white/10 hover:bg-white/10 transition-colors"
              >
                {d.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
