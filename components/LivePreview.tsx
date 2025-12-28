
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useEffect, useState, useRef } from 'react';
// Added missing CpuChipIcon to the import list
import { ArrowDownTrayIcon, PlusIcon, ViewColumnsIcon, DocumentIcon, CodeBracketIcon, XMarkIcon, CpuChipIcon } from '@heroicons/react/24/outline';
import { Creation } from './CreationHistory';

interface LivePreviewProps {
  creation: Creation | null;
  isLoading: boolean;
  isFocused: boolean;
  onReset: () => void;
}

declare global {
  interface Window {
    pdfjsLib: any;
  }
}

const LoadingStep = ({ text, active, completed }: { text: string, active: boolean, completed: boolean }) => (
    <div className={`flex items-center space-x-4 transition-all duration-500 ${active || completed ? 'opacity-100 translate-x-0' : 'opacity-20 translate-x-8'}`}>
        <div className={`w-5 h-5 flex items-center justify-center border ${completed ? 'bg-green-500 border-green-500 text-black' : active ? 'border-blue-500 animate-pulse' : 'border-zinc-800'}`}>
            {completed ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            ) : active ? (
                <div className="w-2 h-2 bg-blue-400"></div>
            ) : null}
        </div>
        <span className={`font-mono text-xs font-bold tracking-[0.2em] uppercase ${active ? 'text-blue-400' : completed ? 'text-zinc-500 line-through' : 'text-zinc-700'}`}>{text}</span>
    </div>
);

const PdfRenderer = ({ dataUrl }: { dataUrl: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const renderPdf = async () => {
      if (!window.pdfjsLib) {
        setError("PDF library not initialized");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const loadingTask = window.pdfjsLib.getDocument(dataUrl);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        const viewport = page.getViewport({ scale: 2.0 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        const renderContext = { canvasContext: context, viewport: viewport };
        await page.render(renderContext).promise;
        setLoading(false);
      } catch (err) {
        setError("Could not render PDF preview.");
        setLoading(false);
      }
    };
    renderPdf();
  }, [dataUrl]);

  if (error) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-zinc-500 p-6 text-center">
            <DocumentIcon className="w-12 h-12 mb-3 opacity-50 text-red-400" />
            <p className="text-sm mb-2 text-red-400/80">{error}</p>
        </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
        {loading && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-8 h-8 border-[3px] border-blue-500/30 border-t-blue-500 animate-spin"></div>
            </div>
        )}
        <canvas 
            ref={canvasRef} 
            className={`max-w-full max-h-full object-contain blueprint-outline transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}
        />
    </div>
  );
};

export const LivePreview: React.FC<LivePreviewProps> = ({ creation, isLoading, isFocused, onReset }) => {
    const [loadingStep, setLoadingStep] = useState(0);
    const [showSplitView, setShowSplitView] = useState(false);

    useEffect(() => {
        if (isLoading) {
            setLoadingStep(0);
            const interval = setInterval(() => {
                setLoadingStep(prev => (prev < 3 ? prev + 1 : prev));
            }, 2000); 
            return () => clearInterval(interval);
        } else {
            setLoadingStep(0);
        }
    }, [isLoading]);

    useEffect(() => {
        if (creation?.originalImage) {
            setShowSplitView(true);
        } else {
            setShowSplitView(false);
        }
    }, [creation]);

    const handleExport = () => {
        if (!creation) return;
        const dataStr = JSON.stringify(creation, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${creation.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_artifact.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

  return (
    <div
      className={`
        fixed z-40 flex flex-col
        bg-zinc-950 shadow-[0_0_100px_rgba(37,99,235,0.2)]
        transition-all duration-700 cubic-bezier(0.2, 0.8, 0.2, 1)
        border-[4px] border-blue-600
        ${isFocused
          ? 'inset-4 md:inset-8 opacity-100 scale-100'
          : 'top-1/2 left-1/2 w-[90%] h-[60%] -translate-x-1/2 -translate-y-1/2 opacity-0 scale-95 pointer-events-none'
        }
      `}
    >
      <div className="bg-blue-600 px-6 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3 w-48">
           <div className="flex space-x-2">
                <button 
                  onClick={onReset}
                  className="w-4 h-4 bg-white hover:bg-red-400 transition-colors flex items-center justify-center focus:outline-none"
                >
                  <XMarkIcon className="w-3 h-3 text-black" />
                </button>
                <div className="w-4 h-4 border-2 border-white/50"></div>
                <div className="w-4 h-4 border-2 border-white/50"></div>
           </div>
        </div>
        
        <div className="flex items-center space-x-3 text-white font-mono font-black italic tracking-widest uppercase">
            <span className="text-xs">
                {isLoading ? '>> SYSTEM_ANALYSIS_IN_PROGRESS' : creation ? `>> PROJECT: ${creation.name.toUpperCase()}` : '>> STDBY_MODE'}
            </span>
        </div>

        <div className="flex items-center justify-end space-x-2 w-48">
            {!isLoading && creation && (
                <>
                    {creation.originalImage && (
                         <button 
                            onClick={() => setShowSplitView(!showSplitView)}
                            className={`p-1 border-2 transition-all ${showSplitView ? 'bg-white text-blue-600 border-white' : 'text-white border-white/50 hover:border-white'}`}
                        >
                            <ViewColumnsIcon className="w-5 h-5" />
                        </button>
                    )}
                    <button 
                        onClick={handleExport}
                        className="text-white border-2 border-white/50 hover:border-white p-1 transition-all"
                    >
                        <ArrowDownTrayIcon className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={onReset}
                        className="ml-2 bg-white text-blue-600 font-black px-4 py-1 uppercase text-xs hover:bg-blue-50 transition-colors"
                    >
                        New
                    </button>
                </>
            )}
        </div>
      </div>

      <div className="relative w-full flex-1 bg-zinc-950 flex overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 w-full scanline-effect">
             <div className="w-full max-w-xl space-y-12">
                <div className="flex flex-col items-center">
                    <div className="w-20 h-20 mb-10 text-blue-500 animate-pulse border-4 border-blue-600 flex items-center justify-center">
                        <CpuChipIcon className="w-12 h-12" />
                    </div>
                    <h3 className="text-blue-500 font-mono text-2xl font-black tracking-[0.4em] uppercase">Constructing Reality</h3>
                </div>

                <div className="w-full h-4 bg-blue-900/20 border-2 border-blue-800 overflow-hidden">
                    <div className="h-full bg-blue-500 animate-[loading_4s_ease-in-out_infinite] w-1/4"></div>
                </div>

                 <div className="bg-black/80 border-2 border-blue-900 p-8 space-y-6">
                     <LoadingStep text="Extracting Geometry" active={loadingStep === 0} completed={loadingStep > 0} />
                     <LoadingStep text="Mapping Components" active={loadingStep === 1} completed={loadingStep > 1} />
                     <LoadingStep text="Injecting Intelligence" active={loadingStep === 2} completed={loadingStep > 2} />
                     <LoadingStep text="Finalizing Structure" active={loadingStep === 3} completed={loadingStep > 3} />
                 </div>
             </div>
          </div>
        ) : creation?.html ? (
          <>
            {showSplitView && creation.originalImage && (
                <div className="w-full md:w-1/2 h-1/2 md:h-full border-b-[3px] md:border-b-0 md:border-r-[3px] border-blue-600 bg-zinc-900 relative flex flex-col shrink-0">
                    <div className="absolute top-4 left-4 z-10 bg-blue-600 text-white text-[10px] font-mono font-black uppercase px-2 py-1">
                        INPUT_SOURCE
                    </div>
                    <div className="w-full h-full p-8 flex items-center justify-center overflow-hidden">
                        {creation.originalImage.startsWith('data:application/pdf') ? (
                            <PdfRenderer dataUrl={creation.originalImage} />
                        ) : (
                            <img 
                                src={creation.originalImage} 
                                alt="Original Input" 
                                className="max-w-full max-h-full object-contain blueprint-outline"
                            />
                        )}
                    </div>
                </div>
            )}

            <div className={`relative h-full bg-white transition-all duration-500 ${showSplitView && creation.originalImage ? 'w-full md:w-1/2 h-1/2 md:h-full' : 'w-full'}`}>
                 <iframe
                    title="Gemini Live Preview"
                    srcDoc={creation.html}
                    className="w-full h-full"
                    sandbox="allow-scripts allow-forms allow-popups allow-modals allow-same-origin"
                />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};
