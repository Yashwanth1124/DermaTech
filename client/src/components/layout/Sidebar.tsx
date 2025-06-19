import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { NavigationItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Home, 
  User, 
  Calendar, 
  FileText, 
  Stethoscope, 
  Pill, 
  Headphones, 
  BarChart3, 
  HelpCircle, 
  LogOut,
  Microscope,
  Download,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'Home',
    path: '/',
    roles: ['patient', 'doctor', 'admin'],
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: 'User',
    path: '/profile',
    roles: ['patient', 'doctor', 'admin'],
  },
  {
    id: 'appointments',
    label: 'Appointments',
    icon: 'Calendar',
    path: '/appointments',
    roles: ['patient', 'doctor', 'admin'],
  },
  {
    id: 'health-records',
    label: 'Health Records',
    icon: 'FileText',
    path: '/health-records',
    roles: ['patient'],
  },
  {
    id: 'emr',
    label: 'EMR System',
    icon: 'Stethoscope',
    path: '/emr',
    roles: ['doctor'],
  },
  {
    id: 'pharmacy',
    label: 'Pharmacy',
    icon: 'Pill',
    path: '/pharmacy',
    roles: ['patient', 'doctor'],
  },
  {
    id: 'ai-diagnostics',
    label: 'AI Diagnostics',
    icon: 'Microscope',
    path: '/ai-diagnostics',
    roles: ['patient', 'doctor'],
  },
  {
    id: 'telemedicine',
    label: 'AR/VR Consults',
    icon: 'Headphones',
    path: '/telemedicine',
    roles: ['patient', 'doctor'],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: 'BarChart3',
    path: '/analytics',
    roles: ['doctor', 'admin'],
  },
  {
    id: 'support',
    label: 'Help & Support',
    icon: 'HelpCircle',
    path: '/support',
    roles: ['patient', 'doctor', 'admin'],
  },
];

const iconMap = {
  Home,
  User,
  Calendar,
  FileText,
  Stethoscope,
  Pill,
  Microscope,
  Headphones,
  BarChart3,
  HelpCircle,
  LogOut,
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [language, setLanguage] = useState('en');

  const filteredItems = navigationItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-50 w-64 h-screen bg-white shadow-xl transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0"
      )}>
        {/* Logo Section */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <Microscope className="text-blue-600 w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">DermaTech</h1>
              <p className="text-blue-100 text-sm">Advanced Care Platform</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-2 flex-1">
          {filteredItems.map((item) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap];
            const isActive = location === item.path || 
              (item.path !== '/' && location.startsWith(item.path));

            return (
              <Link key={item.id} href={item.path}>
                <div
                  className={cn(
                    "flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer",
                    isActive
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-slate-600 hover:bg-slate-100"
                  )}
                  onClick={onClose}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3 border-t border-slate-200">
          {/* Language Dropdown */}
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">🇮🇳 English</SelectItem>
              <SelectItem value="hi">🇮🇳 हिंदी</SelectItem>
              <SelectItem value="ta">🇮🇳 தமிழ்</SelectItem>
              <SelectItem value="bn">🇮🇳 বাংলা</SelectItem>
              <SelectItem value="te">🇮🇳 తెలుగు</SelectItem>
            </SelectContent>
          </Select>

          {/* Logout Button */}
          <Button 
            onClick={handleLogout}
            variant="destructive"
            className="w-full"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>
    </>
  );
}