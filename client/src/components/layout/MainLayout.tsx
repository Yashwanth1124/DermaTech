import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Menu, 
  X, 
  Home, 
  Brain, 
  Calendar, 
  FileText, 
  Pill, 
  Video, 
  BarChart3, 
  User, 
  HelpCircle, 
  LogOut,
  Heart,
  Bell,
  Settings
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const navigationItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/ai-diagnostics", label: "AI Diagnostics", icon: Brain },
    { path: "/appointments", label: "Appointments", icon: Calendar },
    { path: "/health-records", label: "Health Records", icon: FileText },
    { path: "/pharmacy", label: "Pharmacy", icon: Pill },
    { path: "/telemedicine", label: "Telemedicine", icon: Video },
    { path: "/analytics", label: "Analytics", icon: BarChart3 },
    { path: "/profile", label: "Profile", icon: User },
    { path: "/support", label: "Support", icon: HelpCircle },
  ];

  const isActivePath = (path: string) => {
    if (path === "/") return location === "/";
    return location.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm px-3 sm:px-4 py-3 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between max-w-full">
          {/* Left side - Logo and hamburger menu */}
          <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden flex-shrink-0"
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            <Link href="/" className="flex items-center space-x-2 min-w-0">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Heart className="h-3 w-3 sm:h-5 sm:w-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-900 truncate">DermaTech</span>
            </Link>
          </div>

          {/* Center - Search bar (hidden on mobile) */}
          <div className="hidden md:flex flex-1 max-w-md lg:max-w-lg mx-4 lg:mx-8">
            <div className="w-full relative">
              <input
                type="text"
                placeholder="Search patients, medications..."
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Right side - User info and actions */}
          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
            <Button variant="ghost" size="sm" className="relative flex-shrink-0">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs bg-red-500 text-white rounded-full border-2 border-white">
                3
              </Badge>
            </Button>
            
            <div className="hidden sm:flex items-center space-x-2 lg:space-x-3">
              <div className="text-right hidden lg:block">
                <p className="text-sm font-medium text-gray-900 truncate max-w-24">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-600 capitalize">{user?.role}</p>
              </div>
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs sm:text-sm font-medium text-blue-600">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                  <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-lg rounded-md p-1 min-w-[160px]">
                <DropdownMenuItem onClick={() => {}} className="hover:bg-gray-50 cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="hover:bg-red-50 text-red-600 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="sm" onClick={handleLogout} className="flex-shrink-0 sm:hidden" title="Logout">
              <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 pt-16 overflow-hidden">
        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-40 w-64 sm:w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:relative lg:z-auto lg:shadow-none lg:border-r lg:border-gray-200
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex flex-col h-full pt-16 lg:pt-0">
            {/* Navigation Items */}
            <nav className="flex-1 px-3 sm:px-4 py-4 sm:py-6 space-y-1 sm:space-y-2 overflow-y-auto">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActivePath(item.path);
                
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`
                      flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2.5 sm:py-3 rounded-lg text-sm font-medium transition-all duration-200
                      ${isActive 
                        ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-md border border-blue-200' 
                        : 'text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-md hover:border hover:border-gray-200'
                      }
                    `}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                    {item.path === "/ai-diagnostics" && (
                      <Badge variant="secondary" className="ml-auto text-xs px-1.5 py-0.5">97%</Badge>
                    )}
                    {item.path === "/pharmacy" && (
                      <Badge variant="secondary" className="ml-auto text-xs px-1.5 py-0.5">2K+</Badge>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Bottom section */}
            <div className="p-3 sm:p-4 flex-shrink-0">
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-3 sm:p-4 shadow-sm border border-blue-100">
                <div className="flex items-center space-x-2 mb-1 sm:mb-2">
                  <Brain className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium text-gray-900">AI Powered</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  97% diagnostic accuracy with ML
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <div className="p-3 sm:p-4 lg:p-6 max-w-full">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}