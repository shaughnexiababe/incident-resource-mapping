import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, Map as MapIcon, ChevronRight } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

const ACCESS_CODE = 'MISSION-READY'; // Simple demo access code

const Login = () => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate a brief secure check
    setTimeout(() => {
      if (code.toUpperCase() === ACCESS_CODE) {
        sessionStorage.setItem('is_authenticated', 'true');
        showSuccess('Secure connection established. Welcome, Commander.');
        navigate('/');
      } else {
        showError('Invalid Access Code. Authorization denied.');
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#020617] relative overflow-hidden font-sans">
      {/* Abstract Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-900/10 rounded-full blur-[120px]" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
           style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <Card className="w-full max-w-md bg-slate-900/50 border-slate-800 backdrop-blur-xl shadow-2xl relative z-10">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto bg-red-600 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/20 mb-4 transform hover:scale-105 transition-transform">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-black tracking-tight text-white uppercase">
            GeoTactical Command
          </CardTitle>
          <CardDescription className="text-slate-400 font-medium">
            Incident Resource & Prepositioning Suite
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">
                Security Access Code
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  type="password"
                  placeholder="Enter your authorization code..."
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="pl-10 bg-slate-950/50 border-slate-800 text-white focus-visible:ring-red-600 h-12"
                  autoFocus
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-12 gap-2 shadow-lg shadow-red-600/20 transition-all active:scale-[0.98]"
              disabled={isLoading || !code}
            >
              {isLoading ? 'Verifying...' : 'Initialize Mission Dashboard'}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 pt-2 pb-8">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
          <div className="flex items-center justify-center gap-6 opacity-40">
            <div className="flex items-center gap-1.5 grayscale">
              <MapIcon className="w-3.5 h-3.5 text-slate-300" />
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">Live GIS</span>
            </div>
            <div className="flex items-center gap-1.5 grayscale">
              <Shield className="w-3.5 h-3.5 text-slate-300" />
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">ICS Standards</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-600 font-medium text-center leading-relaxed">
            Authorized Personnel Only. <br />
            © 2026 GeoTactical Systems. All Rights Reserved.
          </p>
        </CardFooter>
      </Card>

      {/* Decorative Brand Text */}
      <div className="absolute bottom-8 left-8 hidden lg:block opacity-20">
        <span className="text-4xl font-black text-slate-800 tracking-tighter uppercase select-none">
          Ready. Responsive. Resilient.
        </span>
      </div>
    </div>
  );
};

export default Login;
