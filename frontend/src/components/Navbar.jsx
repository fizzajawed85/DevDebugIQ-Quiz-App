import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import ProfileMenu from "./ProfileMenu";
import { AppContext } from "../AppContext";
import { Bot } from "lucide-react";

export default function Navbar() {
  const { user } = useContext(AppContext);
  const nav = useNavigate();

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-6xl z-50 flex items-center justify-between px-6 py-3 bg-gradient-to-r from-white/5 to-white/3 backdrop-blur-lg rounded-2xl border border-white/10 shadow-lg">
      {/* 🔹 Logo */}
      <div
        onClick={() => nav("/")}
        className="flex items-center gap-3 cursor-pointer"
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#7c3aed] flex items-center justify-center">
          <Bot color="white" size={20} />
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-800 dark:text-white">
            DevDebugIQ
          </div>
          <div className="text-xs text-slate-500 dark:text-white/80">
            Smash Bugs · Learn Fast
          </div>
        </div>
      </div>

      {/* 🔹 Right Section (Always visible on all screens) */}
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <ProfileMenu />
      </div>
    </nav>
  );
}
