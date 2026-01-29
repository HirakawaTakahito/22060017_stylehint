import React, { useState } from 'react';
import { Category, StyleAttribute, Silhouette, Tone, UserItem } from '../types';
import { COLOR_PALETTE } from '../constants';

interface ItemFormProps {
  onSubmit: (item: UserItem) => void;
  isLoading: boolean;
}

const ItemForm: React.FC<ItemFormProps> = ({ onSubmit, isLoading }) => {
  const [item, setItem] = useState<UserItem>({
    category: Category.T_SHIRT,
    color: 'ブラック',
    tone: Tone.MONOTONE,
    attribute: StyleAttribute.CASUAL,
    design: '',
    material: '',
    width: '',
    length: '',
    silhouette: Silhouette.REGULAR
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setItem(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(item);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">アイテム情報を入力</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">カテゴリー</label>
            <select
              name="category"
              value={item.category}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            >
              {Object.values(Category).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">カラー</label>
            <select
              name="color"
              value={item.color}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              {COLOR_PALETTE.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tone (New Field) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">トーン（色調）</label>
            <select
              name="tone"
              value={item.tone}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              {Object.values(Tone).map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

           {/* Attribute */}
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">属性（テイスト）</label>
            <select
              name="attribute"
              value={item.attribute}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              {Object.values(StyleAttribute).map(attr => (
                <option key={attr} value={attr}>{attr}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Silhouette */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">シルエット</label>
            <select
              name="silhouette"
              value={item.silhouette}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              {Object.values(Silhouette).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Material */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">素材感</label>
            <input
              type="text"
              name="material"
              value={item.material}
              onChange={handleChange}
              placeholder="例: コットン、デニム、ナイロン"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Design */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">デザイン・特徴</label>
            <input
              type="text"
              name="design"
              value={item.design}
              onChange={handleChange}
              placeholder="例: ロゴ入り、ストライプ、ポケット付き"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Width */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">身幅 (cm または 感覚)</label>
            <input
              type="text"
              name="width"
              value={item.width}
              onChange={handleChange}
              placeholder="例: 55cm、広め"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Length */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">着丈 (cm または 感覚)</label>
            <input
              type="text"
              name="length"
              value={item.length}
              onChange={handleChange}
              placeholder="例: 70cm、腰下くらい"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg text-white font-bold shadow-lg transition duration-200 
              ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl'}`}
          >
            {isLoading ? 'コーディネートを生成中...' : 'AIスタイリストに相談する'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ItemForm;
