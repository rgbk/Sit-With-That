export interface PageData {
  id: number;
  frontImage: string | null;
  backContent: string | null; // Text placeholder for back of page
}

export type ViewMode = 'spread' | 'front' | 'back' | 'stacked' | 'circular' | 'chair';

export interface CatalogueSettings {
  viewMode: ViewMode;
  currentPage: number;
  pageWidth: number;
  pageHeight: number;
  imageMarginTop: number;
  imageMarginBottom: number;
  imageMarginLeft: number;
  imageMarginRight: number;
  showSpotUV: boolean;
  spotUVIntensity: number;
  animationSpeed: number;
  showPerforations: boolean;
  pageGap: number;
  circleRadius: number;
  stackSpacing: number;
}

export const DEFAULT_SETTINGS: CatalogueSettings = {
  viewMode: 'spread',
  currentPage: 0,
  pageWidth: 8,
  pageHeight: 11,
  imageMarginTop: 0.5,
  imageMarginBottom: 0.5,
  imageMarginLeft: 0.5,
  imageMarginRight: 0.5,
  showSpotUV: false,
  spotUVIntensity: 0.5,
  animationSpeed: 1,
  showPerforations: true,
  pageGap: 0.02,
  circleRadius: 3,
  stackSpacing: 0.05,
};

// Image order for the 10 interior pages
export const PAGE_IMAGES = [
  'alessandro-furchino-capria.jpg',
  'brian-griffin.jpg',
  'dorothea-sing-zhang.jpg',
  'hannah-starkey.jpg',
  'joanna-piotrowska.jpg',
  'larry-sultan.jpg',
  'scheltens-abbenes.jpg',
  'soa2015008g0001-237.jpg',
  'takashi-homma.jpg',
  'yushi-li.jpg',
];
