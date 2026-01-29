import React, { useState } from 'react';
import { UserItem, SuggestedCoordinate } from './types';
import ItemForm from './components/ItemForm';
import ResultDisplay from './components/ResultDisplay';
import { generateCoordinateSuggestion, generateCoordinateImage } from './services/geminiService';

const App: React.FC = () => {
  const [suggestion, setSuggestion] = useState<SuggestedCoordinate | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isImageGenerating, setIsImageGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (item: UserItem) => {
    setIsProcessing(true);
    setSuggestion(null);
    setImageUrl(null);
    setError(null);

    try {
      // 1. Generate Text Suggestion
      const result = await generateCoordinateSuggestion(item);
      setSuggestion(result);
      
      // Stop processing form, start processing image
      setIsProcessing(false);
      setIsImageGenerating(true);

      // 2. Generate Image based on visual prompt
      try {
        const generatedImage = await generateCoordinateImage(result.visualPrompt);
        setImageUrl(generatedImage);
      } catch (imgErr) {
        console.error("Image generation failed:", imgErr);
        // We don't block the UI if only image fails
      } finally {
        setIsImageGenerating(false);
      }

    } catch (err) {
      console.error(err);
      setError("コーディネートの生成に失敗しました。もう一度お試しください。");
      setIsProcessing(false);
      setIsImageGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🧥</span>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">
              AI Personal Stylist <span className="text-xs font-normal text-indigo-500 ml-1">Powered by Gemini</span>
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Intro */}
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">あなたのアイテムを最適にコーディネート</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            お手持ちの服の情報を入力してください。ファッションマニュアル（RAG）を学習したAIが、
            シルエットや配色理論に基づいて最適な組み合わせを提案・画像化します。
          </p>
        </div>

        {/* Input Form */}
        <ItemForm onSubmit={handleFormSubmit} isLoading={isProcessing} />

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">⚠️</div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {suggestion && (
          <ResultDisplay 
            suggestion={suggestion} 
            imageUrl={imageUrl} 
            isImageLoading={isImageGenerating} 
          />
        )}
      </main>
      
      <footer className="bg-white border-t mt-12 py-6 text-center text-gray-500 text-sm">
        <p>© 2025 StyleHint. もりもり筋肉－ず.</p>
      </footer>
    </div>
  );
};

export default App;
