
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { ClockIcon, ArrowRightIcon, DocumentIcon, PhotoIcon } from '@heroicons/react/24/outline';

export interface Creation {
  id: string;
  name: string;
  html: string;
  originalImage?: string; 
  timestamp: Date;
}

interface CreationHistoryProps {
  history: Creation[];
  onSelect: (creation: Creation) => void;
}

export const CreationHistory: React.FC<CreationHistoryProps> = ({ history, onSelect }) => {
  if (history.length === 0) return null;

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center space-x-4 mb-4 px-2">
        <ClockIcon className="w-5 h-5 text-blue-500" />
        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-blue-500">Log_Archive</h2>
        <div className="h-[2px] flex-1 bg-blue-900/40"></div>
      </div>
      
      <div className="flex overflow-x-auto space-x-6 pb-4 px-2 scrollbar-hide">
        {history.map((item) => {
          const isPdf = item.originalImage?.startsWith('data:application/pdf');
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className="group flex-shrink-0 relative flex flex-col text-left w-52 h-32 bg-zinc-950 border-2 border-blue-900/50 hover:border-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.2)] transition-all duration-300 overflow-hidden"
            >
              {/* Technical Scanline effect on card hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 pointer-events-none scanline-effect"></div>
              
              <div className="p-4 flex flex-col h-full relative z-10">
                <div className="flex items-start justify-between mb-2">
                  <div className="p-2 border border-blue-500/30 group-hover:border-blue-500 transition-colors">
                      {isPdf ? (
                          <DocumentIcon className="w-5 h-5 text-blue-400" />
                      ) : item.originalImage ? (
                          <PhotoIcon className="w-5 h-5 text-blue-400" />
                      ) : (
                          <DocumentIcon className="w-5 h-5 text-blue-400" />
                      )}
                  </div>
                  <span className="text-[10px] font-mono font-bold text-blue-900 group-hover:text-blue-500 transition-colors uppercase">
                    {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                <div className="mt-auto">
                  <h3 className="text-xs font-bold text-zinc-400 group-hover:text-white uppercase tracking-widest truncate">
                    {item.name}
                  </h3>
                  <div className="flex items-center space-x-2 mt-2 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                    <span className="text-[10px] font-mono text-blue-400 font-black uppercase tracking-tighter">Initialize_Project</span>
                    <ArrowRightIcon className="w-3 h-3 text-blue-400" />
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};
