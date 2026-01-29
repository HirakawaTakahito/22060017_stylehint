export enum Category {
  T_SHIRT = 'Tシャツ/カットソー',
  SHIRT = 'シャツ/ブラウス',
  KNIT = 'ニット/セーター',
  HOODIE = 'パーカー/スウェット',
  DENIM = 'デニム/ジーンズ',
  SLACKS = 'スラックス/トラウザー',
  PANTS = 'チノパン/カーゴパンツ',
  SKIRT = 'スカート',
  SHORTS = 'ショートパンツ',
  JACKET = 'テーラードジャケット',
  BLOUSON = 'ブルゾン/MA-1',
  COAT = 'コート',
  ONE_PIECE = 'ワンピース',
  SNEAKERS = 'スニーカー',
  LEATHER_SHOES = '革靴/ブーツ',
  PUMPS = 'パンプス/サンダル',
  BAG = 'バッグ',
  CAP = '帽子/アクセサリー'
}

export enum Tone {
  MONOTONE = '無彩色 (白・黒・グレー)',
  VIVID = '原色 (ビビッド)',
  PASTEL = '明星色 (パステル/淡い)',
  GRAYISH = '脱色 (くすみ/グレイッシュ)',
  DARK = '安静色 (ダーク/深み)'
}

export enum StyleAttribute {
  CASUAL = 'カジュアル',
  FORMAL = 'フォーマル/きれいめ',
  STREET = 'ストリート',
  MODE = 'モード'
}

export enum Silhouette {
  TIGHT = 'タイト/細身',
  REGULAR = 'レギュラー/標準',
  OVERSIZE = 'オーバーサイズ/ビッグシルエット',
  FLARE = 'フレア/広がり'
}

export interface UserItem {
  category: Category;
  color: string;
  tone: Tone; // New field
  attribute: StyleAttribute;
  design: string;
  material: string;
  width: string; // 身幅
  length: string; // 着丈
  silhouette: Silhouette;
}

export interface SuggestedCoordinate {
  title: string;
  description: string;
  silhouetteTheory: string;
  colorTheory: string;
  items: string[];
  visualPrompt: string;
}
