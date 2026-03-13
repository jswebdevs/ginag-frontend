"use client";

import { useState, useMemo } from "react";
import { X, Search } from "lucide-react"; // Keeping Lucide just for Modal UI

// --- THE MASSIVE IMPORT BLOCK ---
import * as AiIcons from "react-icons/ai"; // Ant Design
import * as BsIcons from "react-icons/bs"; // Bootstrap
import * as BiIcons from "react-icons/bi"; // BoxIcons
import * as CgIcons from "react-icons/cg"; // Circum Icons
import * as DiIcons from "react-icons/di"; // Devicons
import * as FiIcons from "react-icons/fi"; // Feather
import * as FcIcons from "react-icons/fc"; // Flat Color Icons
import * as FaIcons from "react-icons/fa"; // FontAwesome 5
import * as Fa6Icons from "react-icons/fa6"; // FontAwesome 6
import * as GiIcons from "react-icons/gi"; // Game Icons
import * as GoIcons from "react-icons/go"; // Github Octicons
import * as GrIcons from "react-icons/gr"; // Grommet
import * as HiIcons from "react-icons/hi"; // Heroicons
import * as Hi2Icons from "react-icons/hi2"; // Heroicons 2
import * as ImIcons from "react-icons/im"; // IcoMoon
import * as IoIcons from "react-icons/io"; // Ionicons 4
import * as Io5Icons from "react-icons/io5"; // Ionicons 5
import * as LuIcons from "react-icons/lu"; // Lucide (Included!)
import * as MdIcons from "react-icons/md"; // Material Design
import * as PiIcons from "react-icons/pi"; // Phosphor
import * as RxIcons from "react-icons/rx"; // Radix
import * as RiIcons from "react-icons/ri"; // Remix
import * as SiIcons from "react-icons/si"; // Simple Icons
import * as SlIcons from "react-icons/sl"; // Simple Line Icons
import * as TbIcons from "react-icons/tb"; // Tabler Icons
import * as TfiIcons from "react-icons/tfi"; // Themify
import * as TiIcons from "react-icons/ti"; // Typicons
import * as VscIcons from "react-icons/vsc"; // VS Code
import * as WiIcons from "react-icons/wi"; // Weather Icons

interface IconPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (iconName: string) => void;
}

// Combine all libraries into one massive lookup object
const IconLibrary: Record<string, React.ElementType> = {
  ...AiIcons, ...BsIcons, ...BiIcons, ...CgIcons, ...DiIcons, ...FiIcons, ...FcIcons,
  ...FaIcons, ...Fa6Icons, ...GiIcons, ...GoIcons, ...GrIcons, ...HiIcons, ...Hi2Icons,
  ...ImIcons, ...IoIcons, ...Io5Icons, ...LuIcons, ...MdIcons, ...PiIcons, ...RxIcons,
  ...RiIcons, ...SiIcons, ...SlIcons, ...TbIcons, ...TfiIcons, ...TiIcons, ...VscIcons, ...WiIcons
};

// Extract keys and filter out non-components
const allIconNames = Object.keys(IconLibrary).filter(
  (key) => /^[A-Z]/.test(key) && key !== "DefaultContext" // Ensure it's a React component
);

export default function IconPickerModal({ isOpen, onClose, onSelect }: IconPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Optimize filtering to prevent lag when searching 30,000+ icons
  const filteredIcons = useMemo(() => {
    if (!searchQuery.trim()) return allIconNames.slice(0, 150); // Default to first 150

    return allIconNames
      .filter((name) => name.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 150); // Cap at 150 to keep the DOM light and snappy
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 bg-background/90 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-4xl border border-border rounded-3xl shadow-theme-2xl flex flex-col h-[85vh] overflow-hidden">

        {/* Header & Search */}
        <div className="p-4 sm:p-6 border-b border-border bg-muted/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-foreground tracking-tight">Ultimate Icon Library</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Searching across all React-Icons packs ({allIconNames.length.toLocaleString()} total)
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 bg-background border border-border rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search icons (e.g., FaStar, MdMonitor, TbBrandNextjs)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full bg-background border border-border rounded-xl pl-12 pr-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
            />
            <Search className="absolute left-4 top-3.5 text-muted-foreground w-5 h-5" />
          </div>
        </div>

        {/* Icon Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-muted/5 custom-scrollbar">
          {filteredIcons.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {filteredIcons.map((iconName) => {
                const IconComponent = IconLibrary[iconName];

                return (
                  <button
                    key={iconName}
                    onClick={() => onSelect(iconName)}
                    className="flex flex-col items-center justify-center gap-2 p-3 aspect-square bg-background border border-border rounded-xl hover:border-primary hover:bg-primary/5 hover:text-primary transition-all group"
                    title={iconName}
                  >
                    <IconComponent className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors group-hover:scale-110" />
                    <span className="text-[10px] font-medium text-muted-foreground group-hover:text-primary truncate w-full text-center">
                      {iconName}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p className="text-lg font-bold text-foreground">No icons found</p>
              <p className="text-sm text-muted-foreground">Try a different search term.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}