import React, { useState } from 'react';
import { Type, Upload, Loader } from 'lucide-react';

interface TextInputProps {
  onAnalyze: (text: string) => void;
  onBatchAnalyze: (texts: string[]) => void;
  isLoading: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({ onAnalyze, onBatchAnalyze, isLoading }) => {
  const [inputText, setInputText] = useState('');
  const [activeTab, setActiveTab] = useState<'single' | 'batch'>('single');
  const [batchTexts, setBatchTexts] = useState<string[]>([]);

  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onAnalyze(inputText.trim());
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        const lines = content.split('\n').filter(line => line.trim().length > 0);
        setBatchTexts(lines);
      };
      reader.readAsText(file);
    }
  };

  const handleBatchSubmit = () => {
    if (batchTexts.length > 0) {
      onBatchAnalyze(batchTexts);
    }
  };

  const addBatchText = () => {
    if (inputText.trim()) {
      setBatchTexts([...batchTexts, inputText.trim()]);
      setInputText('');
    }
  };

  const removeBatchText = (index: number) => {
    setBatchTexts(batchTexts.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-100 rounded-lg">
          <Type className="text-green-600" size={20} />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Text Analysis</h2>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
        <button
          onClick={() => setActiveTab('single')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
            activeTab === 'single'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Single Text
        </button>
        <button
          onClick={() => setActiveTab('batch')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
            activeTab === 'batch'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Batch Analysis
        </button>
      </div>

      {activeTab === 'single' ? (
        <form onSubmit={handleSingleSubmit} className="space-y-4">
          <div>
            <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 mb-2">
              Enter text to analyze
            </label>
            <textarea
              id="text-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type or paste your text here..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader className="animate-spin\" size={20} />
                Analyzing...
              </>
            ) : (
              'Analyze Sentiment'
            )}
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload text file or add texts manually
            </label>
            <div className="flex gap-2 mb-4">
              <input
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                disabled={isLoading}
              />
              <label
                htmlFor="file-upload"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors duration-200"
              >
                <Upload size={16} />
                Upload File
              </label>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Add text manually..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              disabled={isLoading}
            />
            <button
              onClick={addBatchText}
              disabled={!inputText.trim() || isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors duration-200"
            >
              Add
            </button>
          </div>

          {batchTexts.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">Texts to analyze ({batchTexts.length})</h4>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {batchTexts.map((text, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <span className="flex-1 text-sm text-gray-700 truncate">{text}</span>
                    <button
                      onClick={() => removeBatchText(index)}
                      className="text-red-500 hover:text-red-700 transition-colors duration-200"
                      disabled={isLoading}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={handleBatchSubmit}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader className="animate-spin\" size={20} />
                    Analyzing Batch...
                  </>
                ) : (
                  `Analyze ${batchTexts.length} Texts`
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};