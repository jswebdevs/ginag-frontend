"use client";


import * as AiIcons from "react-icons/ai";
import * as BsIcons from "react-icons/bs";
import * as BiIcons from "react-icons/bi";
import * as CgIcons from "react-icons/cg";
import * as DiIcons from "react-icons/di";
import * as FiIcons from "react-icons/fi";
import * as FcIcons from "react-icons/fc";
import * as FaIcons from "react-icons/fa";
import * as Fa6Icons from "react-icons/fa6";
import * as GiIcons from "react-icons/gi";
import * as GoIcons from "react-icons/go";
import * as GrIcons from "react-icons/gr";
import * as HiIcons from "react-icons/hi";
import * as Hi2Icons from "react-icons/hi2";
import * as ImIcons from "react-icons/im";
import * as IoIcons from "react-icons/io";
import * as Io5Icons from "react-icons/io5";
import * as LuIcons from "react-icons/lu";
import * as MdIcons from "react-icons/md";
import * as PiIcons from "react-icons/pi";
import * as RxIcons from "react-icons/rx";
import * as RiIcons from "react-icons/ri";
import * as SiIcons from "react-icons/si";
import * as SlIcons from "react-icons/sl";
import * as TbIcons from "react-icons/tb";
import * as TfiIcons from "react-icons/tfi";
import * as TiIcons from "react-icons/ti";
import * as VscIcons from "react-icons/vsc";
import * as WiIcons from "react-icons/wi";

const IconLibrary: Record<string, any> = {
  ...AiIcons, ...BsIcons, ...BiIcons, ...CgIcons, ...DiIcons, ...FiIcons, ...FcIcons,
  ...FaIcons, ...Fa6Icons, ...GiIcons, ...GoIcons, ...GrIcons, ...HiIcons, ...Hi2Icons,
  ...ImIcons, ...IoIcons, ...Io5Icons, ...LuIcons, ...MdIcons, ...PiIcons, ...RxIcons,
  ...RiIcons, ...SiIcons, ...SlIcons, ...TbIcons, ...TfiIcons, ...TiIcons, ...VscIcons, ...WiIcons
};

interface ViewCategoryModalProps {
  category: any;
  categories: any[];
  onClose: () => void;
  onEdit: () => void;
}

export default function ViewCategoryModal({ category, categories, onClose, onEdit }: ViewCategoryModalProps) {

  const parentName = category.parentId
    ? categories.find(c => c.id === category.parentId)?.name || "Unknown"
    : "None (Top Level)";

  // --- HYBRID ICON RESOLVER ---
  const renderIcon = () => {
    if (!category.icon) return <Folder className="w-10 h-10 text-muted-foreground/30" />;

    // 1. Try React-Icons (e.g., FaApple)
    const ReactIconComponent = IconLibrary[category.icon];
    if (ReactIconComponent) return <ReactIconComponent className="w-10 h-10 text-muted-foreground" />;

    // 2. Try Legacy Lucide strings (e.g., "Monitor")
    const LucideIconComponent = (LucideIcons as any)[category.icon];
    if (LucideIconComponent) return <LucideIconComponent className="w-10 h-10 text-muted-foreground" />;

    // 3. Fallback
    return <Folder className="w-10 h-10 text-muted-foreground/30" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-lg border border-border rounded-3xl shadow-theme-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/10">
          <h2 className="text-xl font-black text-foreground">Category Details</h2>
          <div className="flex items-center gap-2">
            <button onClick={onEdit} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-lg text-sm font-bold transition-colors">
              <Edit className="w-4 h-4" /> Edit
            </button>
            <button onClick={onClose} className="p-1.5 text-muted-foreground hover:text-destructive bg-background border border-border rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">

          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-muted border border-border rounded-2xl flex items-center justify-center shadow-inner shrink-0 overflow-hidden">
              {category.featuredImage?.originalUrl ? (
                <img src={category.featuredImage.originalUrl} alt={category.name} className="w-full h-full object-cover" />
              ) : (
                renderIcon()
              )}
            </div>
            <div>
              <h3 className="text-2xl font-black text-foreground">{category.name}</h3>
              <p className="text-sm font-mono text-muted-foreground bg-muted px-2 py-1 rounded inline-block mt-1">/{category.slug}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-background border border-border rounded-xl p-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Parent Category</p>
              <p className="font-semibold text-foreground">{parentName}</p>
            </div>
            <div className="bg-background border border-border rounded-xl p-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Total Products</p>
              <p className="font-black text-primary text-lg leading-none">{category._count?.products || 0}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Description</p>
            <div className="text-sm text-foreground bg-muted/30 p-4 rounded-xl border border-border/50 leading-relaxed">
              {category.description || <span className="italic text-muted-foreground text-xs font-medium">No description provided.</span>}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium pt-4 border-t border-border/50">
            <Calendar className="w-4 h-4" />
            Created on {new Date(category.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

      </div>
    </div>
  );
}