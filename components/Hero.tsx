
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useEffect, useState } from 'react';
import { DocumentTextIcon, CalculatorIcon, PuzzlePieceIcon, ClipboardDocumentCheckIcon, NewspaperIcon } from '@heroicons/react/24/outline';
import { CursorArrowRaysIcon, ChartBarIcon, SparklesIcon } from '@heroicons/react/24/solid';

const DrawingTransformation = ({ 
  initialIcon: InitialIcon, 
  finalIcon: FinalIcon, 
  label,
  delay, 
  x, 
  y,
  rotation = 0
}: { 
  initialIcon: React.ElementType, 
  finalIcon: React.ElementType, 
  label: string,
  delay: number,
  x: string,
  y: string,
  rotation?: number
}) => {
  const [stage, setStage] = useState(0); 

  useEffect(() => {
    const cycle = () => {
      setStage(0);
      setTimeout(() => setStage(1), 500); 
      setTimeout(() => setStage(2), 3500); 
    };

    const startTimeout = setTimeout(() => {
      cycle();
      const interval = setInterval(cycle, 9000);
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [delay]);

  return (
    <div 
      className="absolute transition-all duration-1000 ease-in-out z-0 pointer-events-none"
      style={{ top: y, left: x, transform: `rotate(${rotation}deg)` }}
    >
      <div className={`relative w-24 h-32 md:w-32 md:h-44 transition-all duration-1000 ${
        stage === 2 
          ? 'bg-blue-950/20 border-2 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)] scale-110 -translate-y-4' 
          : 'bg-zinc-900/10 border-2 border-dashed border-zinc-800 scale-100'
      }`}>
        
        <div className={`absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[8px] md:text-[10px] font-mono font-bold px-2 py-0.5 rounded-none transition-all duration-500 ${stage === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            {label}
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`absolute transition-all duration-1000 ${stage === 1 ? 'opacity-100' : 'opacity-0'}`}>
             <InitialIcon className="w-8 h-8 md:w-12 md:h-12 text-zinc-500 stroke-1" />
             <div className="absolute -inset-2 border border-zinc-700/30 opacity-50"></div>
             <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-blue-500"></div>
             <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-blue-500"></div>
             <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-blue-500"></div>
             <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-blue-500"></div>
          </div>

          <div className={`absolute transition-all duration-700 flex flex-col items-center ${stage === 2 ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-75 blur-sm'}`}>
             <FinalIcon className="w-10 h-10 md:w-16 md:h-16 text-blue-400" />
             {stage === 2 && (
               <div className="mt-3 flex items-center gap-2 px-2 py-1 bg-black border border-blue-500">
                 <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                 <div className="w-10 h-1 bg-zinc-800 overflow-hidden">
                    <div className="h-full bg-blue-500 w-2/3 animate-[pulse_1.5s_infinite]"></div>
                 </div>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Hero: React.FC = () => {
  return (
    <>
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="hidden lg:block">
            <DrawingTransformation 
            initialIcon={ClipboardDocumentCheckIcon} 
            finalIcon={SparklesIcon} 
            label="PATENT"
            delay={0} 
            x="6%" 
            y="12%"
            rotation={-3} 
            />
        </div>

        <div className="hidden md:block">
            <DrawingTransformation 
            initialIcon={PuzzlePieceIcon} 
            finalIcon={CursorArrowRaysIcon} 
            label="GAME"
            delay={3000} 
            x="86%" 
            y="70%"
            rotation={2} 
            />
        </div>

        <div className="hidden lg:block">
            <DrawingTransformation 
            initialIcon={NewspaperIcon} 
            finalIcon={ChartBarIcon} 
            label="DATA"
            delay={6000} 
            x="86%" 
            y="15%"
            rotation={1} 
            />
        </div>

        <div className="hidden md:block">
            <DrawingTransformation 
            initialIcon={DocumentTextIcon} 
            finalIcon={CalculatorIcon} 
            label="APP"
            delay={4500} 
            x="8%" 
            y="68%"
            rotation={-2} 
            />
        </div>
      </div>

      <div className="text-center relative z-10 max-w-6xl mx-auto px-4 pt-12">
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white mb-6 leading-[0.9] uppercase">
          Bring <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-blue-600">Blueprints</span> <br/>
          to Life.
        </h1>
        <p className="text-lg sm:text-2xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-light tracking-widest uppercase">
          Technical logic extracted from pure visual form.
        </p>
      </div>
    </>
  );
};
