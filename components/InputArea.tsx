
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useCallback, useState, useEffect } from 'react';
import { ArrowUpTrayIcon, CpuChipIcon } from '@heroicons/react/24/outline';

interface InputAreaProps {
  onGenerate: (prompt: string, file?: File) => void;
  isGenerating: boolean;
  disabled?: boolean;
}

const CyclingText = () => {
    const words = [
        "a floor plan",
        "a patent diagram",
        "an architectural sketch",
        "a technical schematic",
        "a machine blueprint",
        "a UI wireframe"
    ];
    const [index, setIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false); 
            setTimeout(() => {
                setIndex(prev => (prev + 1) % words.length);
                setFade(true); 
            }, 500); 
        }, 3000); 
        return () => clearInterval(interval);
    }, [words.length]);

    return (
        <span className={`inline-block whitespace-nowrap transition-all duration-500 transform ${fade ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-2 blur-sm'} text-blue-400 font-bold uppercase tracking-widest`}>
            {words[index]}
        </span>
    );
};

export const InputArea: React.FC<InputAreaProps> = ({ onGenerate, isGenerating, disabled = false }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/') || file.type === 'application/pdf') {
      onGenerate("", file);
    } else {
      alert("Please upload an image or PDF.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || isGenerating) return;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [disabled, isGenerating]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    if (!disabled && !isGenerating) {
        setIsDragging(true);
    }
  }, [disabled, isGenerating]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className={`relative transition-all duration-300 ${isDragging ? 'scale-[1.02]' : ''}`}>
        <label
          className={`
            relative flex flex-col items-center justify-center
            h-64 sm:h-80 md:h-[26rem]
            bg-zinc-950/50 
            backdrop-blur-md
            cursor-pointer overflow-hidden
            transition-all duration-500
            ${isDragging 
              ? 'border-[4px] border-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.3)]' 
              : 'border-[3px] border-blue-900/40 hover:border-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]'
            }
            ${isGenerating ? 'pointer-events-none' : ''}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
            <div className="absolute inset-0 opacity-[0.1] pointer-events-none" 
                 style={{backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)', backgroundSize: '40px 40px'}}>
            </div>
            
            <div className={`absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 transition-colors duration-300 ${isDragging ? 'border-blue-400' : 'border-blue-600'}`}></div>
            <div className={`absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 transition-colors duration-300 ${isDragging ? 'border-blue-400' : 'border-blue-600'}`}></div>
            <div className={`absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 transition-colors duration-300 ${isDragging ? 'border-blue-400' : 'border-blue-600'}`}></div>
            <div className={`absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 transition-colors duration-300 ${isDragging ? 'border-blue-400' : 'border-blue-600'}`}></div>

            <div className="relative z-10 flex flex-col items-center text-center space-y-8 p-8 w-full">
                <div className={`relative w-24 h-24 rounded-none flex items-center justify-center transition-all duration-500 ${isDragging ? 'scale-110 rotate-90' : 'group-hover:-translate-y-2'}`}>
                    <div className={`absolute inset-0 bg-blue-600/10 border-2 border-blue-500 flex items-center justify-center ${isGenerating ? 'animate-pulse' : ''}`}>
                        {isGenerating ? (
                            <CpuChipIcon className="w-12 h-12 text-blue-400 animate-spin-slow" />
                        ) : (
                            <ArrowUpTrayIcon className={`w-12 h-12 text-blue-400 transition-all duration-300 ${isDragging ? 'scale-125' : ''}`} />
                        )}
                    </div>
                </div>

                <div className="space-y-4 w-full max-w-3xl">
                    <h3 className="flex flex-col items-center justify-center text-2xl sm:text-4xl md:text-5xl text-white font-black tracking-tight uppercase gap-4">
                        <span>Deploy</span>
                        <div className="h-10 sm:h-12 md:h-16 flex items-center justify-center w-full">
                           <CyclingText />
                        </div>
                    </h3>
                    <p className="text-blue-500/80 text-sm md:text-lg font-mono tracking-widest uppercase">
                        [ Drop file to begin synthesis ]
                    </p>
                </div>
            </div>

            <input
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={handleFileChange}
                disabled={isGenerating || disabled}
            />
        </label>
      </div>
    </div>
  );
};
