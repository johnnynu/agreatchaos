import type React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "../hooks/useAuth";
import { Logo } from "@/components/Logo";
import { User, Settings, FileText, LogOut, Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-blue-800 dark:text-blue-300 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-stone-200 dark:from-blue-900/30 dark:to-stone-800/30 rounded-full flex items-center justify-center border border-blue-300 dark:border-blue-700">
            <User className="h-4 w-4 text-blue-800 dark:text-blue-400" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
      >
        <div className="px-2 py-1.5 text-sm font-medium text-stone-900 dark:text-stone-100">
          {user?.email?.split("@")[0]}
        </div>
        <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
        <DropdownMenuItem
          onClick={() => navigate("/files")}
          className="text-blue-800 dark:text-blue-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
        >
          <FileText className="h-4 w-4 mr-2" />
          File Manager
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled
          onClick={() => navigate("/settings")}
          className="text-blue-800 dark:text-blue-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
        >
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
        <DropdownMenuItem
          onClick={signOut}
          className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <nav className="flex justify-between items-center mb-8 px-4 py-3 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
      {/* Left side - Logo */}
      <div className="flex items-center">
        <div onClick={() => navigate("/dashboard")} className="cursor-pointer">
          <Logo variant="sidebar" />
        </div>
      </div>

      {/* Center - Search (hidden on mobile) */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-600 dark:text-blue-400" />
          <Input
            type="search"
            placeholder="Search files..."
            className="w-full pl-10 border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-slate-900"
          />
        </div>
      </div>

      {/* Right side - Actions and User Menu */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-blue-800 dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notifications</span>
        </Button>

        {/* Upload Button */}
        <Button
          size="sm"
          onClick={() => navigate("/upload")}
          className="bg-gradient-to-r from-blue-600 to-stone-700 hover:from-blue-700 hover:to-stone-800 text-white shadow-lg"
          disabled={true}
        >
          <span className="hidden sm:inline mr-2">Upload</span>
          <FileText className="h-4 w-4" />
        </Button>

        {/* User Menu */}
        <UserMenu />
      </div>
    </nav>
  );
};

export default Navbar;
