/** 站点内容目录：已上线有 url，规划中 status 为 soon */
export const CATEGORIES = [
  {
    id: 'tools',
    items: ['math', 'geography', 'physics'],
  },
  {
    id: 'spatial',
    items: ['cesium', 'arcgis', 'threejs'],
  },
  {
    id: 'scenarios',
    items: ['weather', 'museum'],
  },
]

export const ITEMS = {
  math: {
    category: 'tools',
    status: 'live',
    url: 'https://xiaoluo0110.github.io/math-visualization/',
    accent: '#5eb7b7',
    icon: 'M4 18V6M4 18h16M8 14l3-4 3 2 4-6',
  },
  geography: {
    category: 'tools',
    status: 'soon',
    url: null,
    accent: '#7d9cdb',
    icon: 'M12 21s-6-5.5-6-10a6 6 0 1 1 12 0c0 4.5-6 10-6 10zM12 8.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z',
  },
  physics: {
    category: 'tools',
    status: 'soon',
    url: null,
    accent: '#e8a87c',
    icon: 'M12 3v4M12 17v4M3 12h4M17 12h4M6.2 6.2l2.8 2.8M15 15l2.8 2.8M6.2 17.8L9 15M15 9l2.8-2.8',
  },
  weather: {
    category: 'scenarios',
    status: 'live',
    url: 'http://117.72.77.155:18971/',
    accent: '#85c1e9',
    icon: 'M6 16h12M8 12h8M10 8h4M5 20h14',
  },
  cesium: {
    category: 'spatial',
    status: 'soon',
    url: null,
    accent: '#6ec6a8',
    icon: 'M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zm0 4.2L7 10v4l5 2.8 5-2.8v-4l-5-2.8z',
  },
  arcgis: {
    category: 'spatial',
    status: 'live',
    url: 'https://xiaoluo0110.github.io/ArcGIS-3D-visualization/',
    accent: '#f5c26b',
    icon: 'M3 19l6-6 4 3 8-9M14 7h5v5',
  },
  threejs: {
    category: 'spatial',
    status: 'soon',
    url: null,
    accent: '#e07a5f',
    icon: 'M12 3l9 5v8l-9 5-9-5V8l9-5zm0 3.2L6 9.5v5l6 3.3 6-3.3v-5L12 6.2z',
  },
  museum: {
    category: 'scenarios',
    status: 'soon',
    url: null,
    accent: '#c9a0a0',
    icon: 'M3 10l9-6 9 6M5 10v9h14v-9M9 19v-5h6v5',
  },
}

export function getItemsByCategory(categoryId) {
  return CATEGORIES.find((c) => c.id === categoryId)?.items ?? []
}

export const CATALOG_NAV_IDS = CATEGORIES.map((c) => c.id)
