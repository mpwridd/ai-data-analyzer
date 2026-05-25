'use client';

import { useCallback, useState, useRef } from 'react';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';
import Papa from 'papaparse';
import { DataRow } from '@/types';

interface FileUploadProps {
  onDataLoaded: (data: DataRow[], fileName: string) => void;
}

export default function FileUpload({ onDataLoaded }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    (file: File) => {
      setIsLoading(true);
      setError(null);
      setFileName(file.name);

      const extension = file.name.split('.').pop()?.toLowerCase();

      if (extension === 'json') {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const json = JSON.parse(e.target?.result as string);
            const data = Array.isArray(json) ? json : [json];
            if (data.length === 0) {
              setError('JSON file is empty');
              setIsLoading(false);
              return;
            }
            onDataLoaded(data, file.name);
            setIsLoading(false);
          } catch {
            setError('Invalid JSON format');
            setIsLoading(false);
          }
        };
        reader.readAsText(file);
      } else if (extension === 'csv') {
        Papa.parse(file, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.errors.length > 0) {
              setError(`CSV parsing error: ${results.errors[0].message}`);
              setIsLoading(false);
              return;
            }
            const data = results.data as DataRow[];
            if (data.length === 0) {
              setError('CSV file is empty');
              setIsLoading(false);
              return;
            }
            onDataLoaded(data, file.name);
            setIsLoading(false);
          },
          error: (err) => {
            setError(`Failed to parse CSV: ${err.message}`);
            setIsLoading(false);
          },
        });
      } else {
        setError('Unsupported file format. Please use CSV or JSON files.');
        setIsLoading(false);
      }
    },
    [onDataLoaded]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    setFileName(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.json"
        onChange={handleFileSelect}
        className="hidden"
      />

      {!fileName ? (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative cursor-pointer rounded-2xl border-2 border-dashed p-8 sm:p-12
            transition-all duration-300 ease-in-out
            ${
              isDragging
                ? 'border-indigo-400 bg-indigo-50/50 scale-[1.02]'
                : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30'
            }
          `}
        >
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div
              className={`
              w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300
              ${isDragging ? 'bg-indigo-100 scale-110' : 'bg-gray-100'}
            `}
            >
              <Upload
                className={`w-7 h-7 transition-colors duration-300 ${
                  isDragging ? 'text-indigo-500' : 'text-gray-400'
                }`}
              />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-700">
                {isDragging ? 'Drop your file here' : 'Upload your data file'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Drag and drop or click to select a CSV or JSON file
              </p>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-medium border border-emerald-100">
                .CSV
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium border border-blue-100">
                .JSON
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isLoading ? (
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : error ? (
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                  <X className="w-5 h-5 text-red-500" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900 text-sm">{fileName}</p>
                <p className="text-xs text-gray-500">
                  {isLoading
                    ? 'Processing...'
                    : error
                    ? error
                    : 'File loaded successfully'}
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
