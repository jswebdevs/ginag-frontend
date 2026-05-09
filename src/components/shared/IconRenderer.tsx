"use client";

import React from 'react';

// --- MASSIVE ICON PACK IMPORTS ---
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
import * as HiIcons from "react-icons/hi2"; // Using hi2 for better modern compatibility
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

// Combine into a single lookup object
const IconLibrary: Record<string, any> = {
    ...AiIcons, ...BsIcons, ...BiIcons, ...CgIcons, ...DiIcons, ...FiIcons, ...FcIcons,
    ...FaIcons, ...Fa6Icons, ...GiIcons, ...GoIcons, ...GrIcons, ...HiIcons,
    ...ImIcons, ...IoIcons, ...Io5Icons, ...LuIcons, ...MdIcons, ...PiIcons, ...RxIcons,
    ...RiIcons, ...SiIcons, ...SlIcons, ...TbIcons, ...TfiIcons, ...TiIcons, ...VscIcons, ...WiIcons
};

interface IconRendererProps {
    name?: string;
    icon?: string; // 🔥 Added to resolve persistent TS build error
    className?: string;
    fallback?: React.ComponentType<any>;
}

export default function IconRenderer({
    name,
    icon,
    className = "w-5 h-5",
    fallback: Fallback = LuIcons.LuPackage
}: IconRendererProps) {

    // Use either name or icon prop
    const resolvedIconName = name || icon;

    // 1. Handle Empty Names
    if (!resolvedIconName) return <Fallback className={className} />;

    // 2. Handle Image URLs
    if (resolvedIconName.startsWith('http') || resolvedIconName.startsWith('/')) {
        return <img src={resolvedIconName} alt="icon" className={`object-contain ${className}`} />;
    }

    // 3. Handle known Lucide v4 renames
    let resolvedName = resolvedIconName;
    if (resolvedName === "LuHome") resolvedName = "LuHouse";
    if (resolvedName === "LuLoader2") resolvedName = "LuLoader";
    if (resolvedName === "LuSettings2") resolvedName = "LuSettings";

    const IconComponent = IconLibrary[resolvedName];

    // 4. Safe Render Check (Prevents "Element type is invalid" crash)
    if (!IconComponent || typeof IconComponent !== 'function') {
        return <Fallback className={className} />;
    }

    return <IconComponent className={className} />;
}

export const allIconNames = Object.keys(IconLibrary).filter(
    (key) => /^[A-Z]/.test(key) && key !== "DefaultContext"
);