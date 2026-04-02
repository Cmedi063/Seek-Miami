import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  MapPin, Beer, Tv, Music, Navigation, 
  Search, Heart, X, Star, Clock, Users,
  Crosshair, Layers, Check, List, Map, Plus,
  Compass, Wine
} from 'lucide-react';

// --- DATA ENRICHMENT ---
const NEIGHBORHOODS = {
  "Little Havana": {x: 42, y: 60}, "South Beach": {x: 80, y: 58}, "Surfside": {x: 75, y: 15},
  "Brickell": {x: 55, y: 65}, "Downtown": {x: 55, y: 55}, "Little River": {x: 52, y: 35},
  "Midtown": {x: 55, y: 45}, "Wynwood": {x: 55, y: 48}, "Mid Beach": {x: 78, y: 45},
  "North Beach": {x: 78, y: 30}, "Hialeah": {x: 30, y: 42}, "Coconut Grove": {x: 40, y: 78},
  "Coral Gables": {x: 35, y: 75}, "Homestead": {x: 20, y: 92}, "Little Haiti": {x: 53, y: 40},
  "North Miami": {x: 60, y: 25}, "South Miami": {x: 35, y: 85}, "Doral": {x: 25, y: 55}
};

const VIDEOS = [
  "https://assets.mixkit.co/videos/preview/mixkit-crowd-of-people-dancing-in-a-nightclub-4315-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-bartender-pouring-a-drink-into-a-glass-4309-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-people-toasting-with-cocktails-at-a-bar-4314-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-dj-playing-music-at-a-nightclub-4312-large.mp4"
];

const IMAGES = {
  "Next-Level Cocktails": [
    "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80", 
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
    "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=600&q=80"
  ],
  "Old School Legends": [
    "https://images.unsplash.com/photo-1575037614876-c3852d790d16?w=600&q=80", 
    "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=600&q=80",
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&q=80"
  ],
  "Yell at the TV": [
    "https://images.unsplash.com/photo-1615887023516-9bfa6591880e?w=600&q=80", 
    "https://images.unsplash.com/photo-1582152629442-4a864303fb80?w=600&q=80",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80"
  ],
  "Lounges & Breweries": [
    "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=600&q=80", 
    "https://images.unsplash.com/photo-1470229722913-7c090ba2f0a4?w=600&q=80",
    "https://images.unsplash.com/photo-1574682711059-8354c0e69cb4?w=600&q=80"
  ]
};

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80";

// Simulated Expanded Data Points
const SIGNATURE_DRINKS = ["The Neon Mojito", "Smoked Old Fashioned", "Spicy Passionfruit Margarita", "Lychee Martini", "Barrel-Aged Negroni", "Local IPA Draft", "Guava Sour"];
const DRESS_CODES = ["Casual", "Smart Casual", "Dress to Impress", "Beachwear OK"];
const HAPPY_HOURS = ["Mon-Fri 4PM-7PM", "Everyday 5PM-8PM", "Tues-Thurs 3PM-6PM", "None"];

const RAW_BAR_LIST = [
  { n: "Cafe La Trova", c: "Next-Level Cocktails", loc: "Little Havana" },
  { n: "Sweet Liberty", c: "Next-Level Cocktails", loc: "South Beach" },
  { n: "Champagne Bar", c: "Next-Level Cocktails", loc: "Surfside" },
  { n: "Bar Kaiju", c: "Next-Level Cocktails", loc: "Little River" },
  { n: "Panamericano", c: "Next-Level Cocktails", loc: "Brickell" },
  { n: "Swizzle Rum Bar", c: "Next-Level Cocktails", loc: "South Beach" },
  { n: "ViceVersa", c: "Next-Level Cocktails", loc: "Downtown" },
  { n: "Mac's Club Deuce", c: "Old School Legends", loc: "South Beach" },
  { n: "The Abbey Brewing Co", c: "Old School Legends", loc: "South Beach" },
  { n: "The Bend Liquor", c: "Old School Legends", loc: "Hialeah" },
  { n: "Bob's Your Uncle", c: "Old School Legends", loc: "North Beach" },
  { n: "Barracuda Taphouse", c: "Old School Legends", loc: "Coconut Grove" },
  { n: "Monty's Raw Bar", c: "Old School Legends", loc: "Coconut Grove" },
  { n: "Batch Gastropub", c: "Yell at the TV", loc: "Brickell" },
  { n: "Black Market", c: "Yell at the TV", loc: "Downtown" },
  { n: "Flanigan's", c: "Yell at the TV", loc: "Coconut Grove" },
  { n: "Grails", c: "Yell at the TV", loc: "Wynwood" },
  { n: "Jolene Sound Room", c: "Lounges & Breweries", loc: "Downtown" },
  { n: "Level 6", c: "Lounges & Breweries", loc: "Coconut Grove" },
  { n: "Mae's Room", c: "Lounges & Breweries", loc: "Coconut Grove" },
  { n: "Mama Tried", c: "Lounges & Breweries", loc: "Downtown" },
  { n: "The Tank Brewing Co", c: "Lounges & Breweries", loc: "Hialeah" },
  { n: "Miami Brewing Co", c: "Lounges & Breweries", loc: "Homestead" },
  { n: "ZeyZey", c: "Lounges & Breweries", loc: "Little Haiti" },
  { n: "Magie", c: "Lounges & Breweries", loc: "Little River" },
];

const BARS = RAW_BAR_LIST.map((b, i) => {
  const base = NEIGHBORHOODS[b.loc] || {x: 50, y: 50};
  const imgList = IMAGES[b.c] || IMAGES["Lounges & Breweries"];
  
  return {
    id: `bar-${i}`,
    name: b.n,
    cat: b.c,
    nabe: b.loc,
    price: ["$$", "$$$", "$$$$"][i % 3], // Deterministic
    rating: (4.1 + (i % 10) * 0.1).toFixed(1), // Deterministic
    desc: `Experience the ultimate Miami nightlife at ${b.n}. A staple of the ${b.loc} scene, delivering unforgettable vibes and top-tier service.`,
    signatureDrink: SIGNATURE_DRINKS[i % SIGNATURE_DRINKS.length], // Deterministic
    dressCode: DRESS_CODES[i % DRESS_CODES.length], // Deterministic
    happyHour: HAPPY_HOURS[i % HAPPY_HOURS.length], // Deterministic
    // Small deterministic offset
    coords: { x: base.x + ((i % 5) - 2), y: base.y + ((i * 3 % 5) - 2) },
    img: imgList[i % imgList.length],
    video: VIDEOS[i % VIDEOS.length]
  };
});

const CATEGORIES = [
  { id: "All", label: "All Bars", icon: Compass, color: "text-white", glow: "shadow-white/20" },
  { id: "Next-Level Cocktails", label: "Cocktails", icon: Wine, color: "text-[#ff007f]", glow: "shadow-[0_0_20px_rgba(255,0,127,0.8)]" },
  { id: "Old School Legends", label: "Legends", icon: Beer, color: "text-[#ff9900]", glow: "shadow-[0_0_20px_rgba(255,153,0,0.8)]" },
  { id: "Yell at the TV", label: "Sports", icon: Tv, color: "text-[#00ffcc]", glow: "shadow-[0_0_20px_rgba(0,255,204,0.8)]" },
  { id: "Lounges & Breweries", label: "Lounges", icon: Music, color: "text-[#b026ff]", glow: "shadow-[0_0_20px_rgba(176,38,255,0.8)]" }
];

export default function App() {
  // --- STATE WITH LOCALSTORAGE PERSISTENCE ---
  const [activeTab, setActiveTab] = useState('list'); 
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBar, setSelectedBar] = useState(null);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [isCrawlMode, setIsCrawlMode] = useState(false);

  // Load Favorites from LocalStorage with fallback validation
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('seek_miami_favs');
      const parsed = saved ? JSON.parse(saved) : [];
      return new Set(Array.isArray(parsed) ? parsed : []);
    } catch { return new Set(); }
  });

  // Load Crawl Route from LocalStorage with fallback validation
  const [crawlRouteIds, setCrawlRouteIds] = useState(() => {
    try {
      const saved = localStorage.getItem('seek_miami_crawl');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  });

  // Derive full objects for the route
  const crawlRoute = useMemo(() => {
    return crawlRouteIds.map(id => BARS.find(b => b.id === id)).filter(Boolean);
  }, [crawlRouteIds]);

  // Save to LocalStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('seek_miami_favs', JSON.stringify([...favorites]));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('seek_miami_crawl', JSON.stringify(crawlRouteIds));
  }, [crawlRouteIds]);

  // 3D Engine State
  const mapRef = useRef(null);
  const [is3D, setIs3D] = useState(false);
  const [mapState, setMapState] = useState({ x: 0, y: 0, scale: 1.2, rotateX: 0, rotateZ: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, mapX: 0, mapY: 0 });

  // --- LOGIC ---
  const filteredBars = useMemo(() => {
    return BARS.filter(bar => {
      const matchCat = activeCategory === "All" || bar.cat === activeCategory;
      const matchSearch = bar.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          bar.nabe.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  const getCatStyle = (catId) => CATEGORIES.find(c => c.id === catId) || CATEGORIES[0];

  const toggleFavorite = (e, barId) => {
    e.stopPropagation();
    setFavorites(prev => {
      const newFavs = new Set(prev);
      if (newFavs.has(barId)) newFavs.delete(barId);
      else newFavs.add(barId);
      return newFavs;
    });
  };

  const toggleCrawl = (e, barId) => {
    e.stopPropagation();
    setCrawlRouteIds(prev => {
      if (prev.includes(barId)) return prev.filter(id => id !== barId);
      if (prev.length >= 6) return prev;
      return [...prev, barId];
    });
  };

  // Map Controls
  const handlePointerDown = (e) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, mapX: mapState.x, mapY: mapState.y };
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const dx = (e.clientX - dragStart.current.x) / mapState.scale;
    const dy = (e.clientY - dragStart.current.y) / mapState.scale;
    const angle = ((is3D ? -15 : 0) * Math.PI) / 180;
    const adjustedDx = dx * Math.cos(-angle) - dy * Math.sin(-angle);
    const adjustedDy = dx * Math.sin(-angle) + dy * Math.cos(-angle);

    setMapState(prev => ({
      ...prev, x: dragStart.current.mapX + adjustedDx, y: dragStart.current.mapY + adjustedDy
    }));
  };

  const handlePointerUp = () => setIsDragging(false);

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    setMapState(prev => ({
      ...prev, scale: Math.min(Math.max(0.5, prev.scale * zoomFactor), 4)
    }));
  };

  const centerOnBar = (bar) => {
    setSelectedBar(bar);
    const targetX = (50 - bar.coords.x) * 10; 
    const targetY = (50 - bar.coords.y) * 10;
    setMapState(prev => ({ ...prev, x: targetX, y: targetY, scale: 1.8 }));
    setActiveTab('map');
  };

  // --- MAP RENDER HELPERS ---
  const renderNeighborhoodZones = () => {
    return Object.entries(NEIGHBORHOODS).map(([name, coords]) => (
      <div 
        key={name}
        className="absolute w-64 h-64 -mt-32 -ml-32 rounded-full pointer-events-none"
        style={{
          left: `${coords.x}%`, top: `${coords.y}%`,
          background: 'radial-gradient(circle, rgba(0,243,255,0.03) 0%, rgba(0,0,0,0) 70%)',
          border: '1px dashed rgba(0,243,255,0.1)'
        }}
      >
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8px] font-black uppercase tracking-[0.2em] text-[#00f3ff]/30">
          {name}
        </span>
      </div>
    ));
  };

  const renderCrawlRoute = () => {
    if (crawlRoute.length < 2) return null;
    const pathData = crawlRoute.map((bar, i) => 
      `${i === 0 ? 'M' : 'L'} ${bar.coords.x} ${bar.coords.y}`
    ).join(' ');

    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ overflow: 'visible' }} preserveAspectRatio="none" viewBox="0 0 100 100">
        {/* Glow underneath */}
        <path d={pathData} fill="none" stroke="#ff007f" strokeWidth="0.8" className="opacity-30 blur-sm" />
        {/* Animated dashed line */}
        <path 
          d={pathData} 
          fill="none" 
          stroke="#ff007f" 
          strokeWidth="0.4" 
          strokeDasharray="2 1"
          className="animate-[dash_15s_linear_infinite]" 
        />
      </svg>
    );
  };

  // --- RENDER ---
  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-[#02040a] text-white font-sans overflow-hidden selection:bg-[#ff007f]/40">
      
      {/* MOBILE NAV TABS */}
      <div className="md:hidden flex bg-[#050914] border-b border-[#1a233a] p-2 z-50 shrink-0">
        <button 
          onClick={() => setActiveTab('list')}
          className={`flex-1 py-2 text-sm font-bold tracking-wider uppercase rounded-l-md ${activeTab === 'list' ? 'bg-[#1a233a] text-[#00f3ff]' : 'text-slate-500'}`}
        >
          <List className="inline-block w-4 h-4 mr-2 mb-0.5"/> Directory
        </button>
        <button 
          onClick={() => setActiveTab('map')}
          className={`flex-1 py-2 text-sm font-bold tracking-wider uppercase rounded-r-md ${activeTab === 'map' ? 'bg-[#1a233a] text-[#ff007f]' : 'text-slate-500'}`}
        >
          <Map className="inline-block w-4 h-4 mr-2 mb-0.5"/> Canvas Map
        </button>
      </div>

      {/* 1. LEFT SIDEBAR */}
      <div className={`${activeTab === 'list' ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-[420px] bg-[#050914]/95 backdrop-blur-2xl border-r border-[#1a233a] z-40 shadow-[10px_0_30px_rgba(0,0,0,0.5)] shrink-0`}>
        
        {/* Header */}
        <div className="p-6 pb-4 border-b border-[#1a233a] bg-gradient-to-b from-[#0a1122] to-transparent">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-[#00f3ff] to-[#ff007f] rounded-xl shadow-[0_0_20px_rgba(255,0,127,0.3)]">
                <Compass size={24} className="text-white" />
              </div>
              <h1 className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#00f3ff] via-[#ff007f] to-[#ff9900]">
                SEEK MIAMI
              </h1>
            </div>
          </div>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#00f3ff] transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search bars, vibes, neighborhoods..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0a1122] border border-[#1a233a] rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#00f3ff] transition-all text-white placeholder-slate-600 shadow-inner"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="px-4 py-4 flex gap-2 overflow-x-auto scrollbar-hide border-b border-[#1a233a]">
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                  isActive 
                    ? `bg-[#1a233a] border border-[#2d3b5e] ${cat.color} ${cat.glow} scale-105` 
                    : 'bg-transparent border border-transparent text-slate-500 hover:text-slate-300 hover:bg-[#0a1122]'
                }`}
              >
                <cat.icon size={14} className={isActive ? "" : "opacity-50"} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Crawl Builder Banner */}
        {isCrawlMode && (
          <div className="mx-4 mt-4 p-3 bg-[#1a0510] border border-[#ff007f]/50 rounded-xl flex items-center justify-between shadow-[0_0_15px_rgba(255,0,127,0.2)]">
            <div className="flex items-center gap-2">
              <Navigation size={16} className="text-[#ff007f]" />
              <span className="text-sm font-bold text-[#ff007f]">Neon Crawl: {crawlRoute.length}/6 Stops</span>
            </div>
            <button onClick={() => { setIsCrawlMode(false); setCrawlRouteIds([]); }} className="text-slate-400 hover:text-white">
              <X size={16} />
            </button>
          </div>
        )}

        {/* Directory List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-[#1a233a] scrollbar-track-transparent">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-widest px-2 pb-2">
            <span>{filteredBars.length} RESULTS</span>
            <button 
              onClick={() => setIsCrawlMode(true)}
              className={`flex items-center gap-1 hover:text-[#ff007f] transition-colors ${isCrawlMode ? 'text-[#ff007f]' : ''}`}
            >
              <Navigation size={14} /> {crawlRouteIds.length > 0 ? 'Edit Crawl' : 'Build Crawl'}
            </button>
          </div>

          {filteredBars.map(bar => {
            const style = getCatStyle(bar.cat);
            const isActive = selectedBar?.id === bar.id || hoveredBar?.id === bar.id;
            const isFav = favorites.has(bar.id);
            const inCrawl = crawlRouteIds.includes(bar.id);
            
            return (
              <div 
                key={bar.id}
                onClick={() => centerOnBar(bar)}
                onMouseEnter={() => setHoveredBar(bar)}
                onMouseLeave={() => setHoveredBar(null)}
                className={`group relative overflow-hidden rounded-2xl p-3 cursor-pointer transition-all duration-300 border ${
                  isActive 
                    ? `bg-[#0a1122] border-[#2d3b5e] ${style.glow} translate-x-1` 
                    : 'bg-[#050914] border-[#1a233a] hover:bg-[#0a1122]/50 hover:border-[#2d3b5e]'
                }`}
              >
                <div className="absolute inset-0 opacity-10 bg-gradient-to-r from-transparent to-[#1a233a] pointer-events-none" />
                <div className="relative z-10 flex gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-[#1a233a] shadow-md">
                    <img 
                      src={bar.img} 
                      alt={bar.name} 
                      onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex justify-between items-start">
                      <h3 className={`font-bold text-base truncate pr-2 transition-colors ${isActive ? 'text-white' : 'text-slate-200'}`}>
                        {bar.name}
                      </h3>
                      <button onClick={(e) => toggleFavorite(e, bar.id)} className="text-slate-500 hover:text-[#ff007f] transition-colors pt-0.5 shrink-0">
                        <Heart size={16} className={isFav ? "fill-[#ff007f] text-[#ff007f]" : ""} />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                      <MapPin size={12} className="shrink-0" />
                      <span className="truncate">{bar.nabe}</span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#050914] border border-[#1a233a] ${style.color}`}>
                        {bar.price} • {bar.rating}★
                      </span>
                      
                      {(isCrawlMode || inCrawl) && (
                        <button 
                          onClick={(e) => toggleCrawl(e, bar.id)}
                          className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                            inCrawl ? 'bg-[#ff007f]/20 text-[#ff007f] border border-[#ff007f]/50' : 'bg-[#1a233a] text-slate-300 hover:bg-[#2d3b5e]'
                          }`}
                        >
                          {inCrawl ? <Check size={12}/> : <Plus size={12}/>} 
                          {inCrawl ? 'Added' : 'Stop'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. THE 3D MAP ENGINE */}
      <div 
        className={`${activeTab === 'map' ? 'block' : 'hidden'} md:block flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing perspective-[1200px]`}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-[radial-gradient(circle_at_center,rgba(0,243,255,0.05)_0%,transparent_70%)] pointer-events-none z-0" />

        <div className="absolute top-6 left-6 z-30 flex gap-2">
          <button 
            onClick={() => setIs3D(!is3D)}
            className="bg-[#050914]/80 backdrop-blur border border-[#1a233a] text-slate-300 hover:text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg"
          >
            <Layers size={14} className={is3D ? "text-[#00f3ff]" : ""} />
            {is3D ? "2.5D View" : "Flat View"}
          </button>
        </div>

        {/* The 3D Surface */}
        <div 
          ref={mapRef}
          className="absolute top-1/2 left-1/2 w-[2000px] h-[2000px] -mt-[1000px] -ml-[1000px] transform-style-preserve-3d transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ transform: `scale(${mapState.scale}) rotateX(${is3D ? 45 : 0}deg) rotateZ(${is3D ? -15 : 0}deg) translate3d(${mapState.x}px, ${mapState.y}px, 0)` }}
        >
          <div className="absolute inset-0 bg-[#02040a] border border-[#1a233a]/30">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a1122_1px,transparent_1px),linear-gradient(to_bottom,#0a1122_1px,transparent_1px)] bg-[size:50px_50px]" />
            <svg className="absolute inset-0 w-full h-full opacity-60 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Ocean / Bay */}
              <path d="M 65 0 C 60 20, 65 40, 58 60 C 50 80, 45 90, 40 100 L 100 100 L 100 0 Z" fill="rgba(0,243,255,0.02)" />
              {/* Mainland Coastline */}
              <path d="M 65 0 C 60 20, 65 40, 58 60 C 50 80, 45 90, 40 100" fill="none" stroke="#00f3ff" strokeWidth="0.3" className="drop-shadow-[0_0_8px_rgba(0,243,255,0.8)]" />
              {/* Miami Beach Barrier Island */}
              <path d="M 80 0 C 85 20, 85 40, 80 65 C 75 70, 70 70, 70 70 L 85 75 L 100 60 L 100 0 Z" fill="rgba(255,0,127,0.02)" />
              <path d="M 80 0 C 85 20, 85 40, 80 65 C 75 70, 70 70, 70 70" fill="none" stroke="#ff007f" strokeWidth="0.3" className="drop-shadow-[0_0_8px_rgba(255,0,127,0.8)]" />
              {/* Key Biscayne */}
              <path d="M 65 75 C 70 80, 72 85, 70 95 C 68 100, 60 100, 65 75" fill="none" stroke="#00f3ff" strokeWidth="0.2" className="drop-shadow-[0_0_8px_rgba(0,243,255,0.5)]" />
              {/* Causeways */}
              <path d="M 62 25 Q 70 23 78 25" fill="none" stroke="#ff9900" strokeWidth="0.2" strokeDasharray="0.5 0.5" className="drop-shadow-[0_0_5px_rgba(255,153,0,0.5)]" />
              <path d="M 60 40 Q 68 38 78 45" fill="none" stroke="#ff9900" strokeWidth="0.2" strokeDasharray="0.5 0.5" className="drop-shadow-[0_0_5px_rgba(255,153,0,0.5)]" />
              <path d="M 58 55 Q 68 52 79 58" fill="none" stroke="#ff9900" strokeWidth="0.2" strokeDasharray="0.5 0.5" className="drop-shadow-[0_0_5px_rgba(255,153,0,0.5)]" />
            </svg>
          </div>

          {/* New Feature: Neighborhood Zones */}
          <div className="absolute inset-0 z-0">
            {renderNeighborhoodZones()}
          </div>

          {renderCrawlRoute()}

          {/* Dynamic 3D Markers */}
          {filteredBars.map(bar => {
            const style = getCatStyle(bar.cat);
            const isSelected = selectedBar?.id === bar.id;
            const isHovered = hoveredBar?.id === bar.id;
            const inCrawlIdx = crawlRouteIds.indexOf(bar.id);
            const active = isSelected || isHovered || inCrawlIdx > -1;

            return (
              <div
                key={bar.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 group ${active ? 'z-20' : 'z-10'}`}
                style={{ 
                  left: `${bar.coords.x}%`, top: `${bar.coords.y}%`,
                  transform: `translate(-50%, -50%) rotateZ(${is3D ? 15 : 0}deg) rotateX(${is3D ? -45 : 0}deg)`
                }}
                onClick={(e) => { e.stopPropagation(); centerOnBar(bar); }}
                onMouseEnter={() => setHoveredBar(bar)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {active && <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-gradient-to-t ${style.bg} opacity-30 blur-md rounded-full transform rotateX-75`} />}
                <div className={`w-0.5 h-12 bg-gradient-to-t from-transparent via-white to-white mx-auto opacity-50 ${active ? 'h-16' : ''} transition-all duration-500`} />
                
                <div className={`relative flex items-center justify-center rounded-2xl transition-all duration-500 border border-[#2d3b5e] bg-[#050914]/90 backdrop-blur-md cursor-pointer
                  ${active ? `scale-125 ${style.glow} border-white/50` : 'scale-100 hover:scale-110'}
                `}
                style={{ width: active ? '48px' : '32px', height: active ? '48px' : '32px' }}
                >
                  {inCrawlIdx > -1 ? (
                    <span className={`font-black ${active ? 'text-lg' : 'text-sm'} text-white`}>{inCrawlIdx + 1}</span>
                  ) : (
                    <style.icon size={active ? 20 : 14} className={style.color} />
                  )}
                  
                  {isHovered && !isSelected && (
                    <div className="absolute top-1/2 left-full ml-4 -translate-y-1/2 whitespace-nowrap bg-[#050914]/95 backdrop-blur-xl border border-[#1a233a] px-4 py-2 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.8)] pointer-events-none z-50">
                      <p className="font-bold text-white">{bar.name}</p>
                      <p className={`text-[10px] uppercase font-black tracking-wider ${style.color}`}>{bar.nabe}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. SLIDE-OUT PANEL (With Rich Data) */}
      <div 
        className={`fixed top-0 right-0 h-full w-full md:w-[450px] bg-[#050914]/95 backdrop-blur-3xl border-l border-[#1a233a] shadow-[-20px_0_50px_rgba(0,0,0,0.8)] z-50 transform transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-y-auto scrollbar-hide ${
          selectedBar ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {selectedBar && (
          <>
            <div className="relative h-[300px] md:h-[350px] w-full bg-black overflow-hidden group">
              <img 
                src={selectedBar.img} 
                alt={selectedBar.name}
                onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              />
              <video 
                src={selectedBar.video} 
                poster={selectedBar.img}
                autoPlay 
                loop 
                muted 
                playsInline 
                onError={(e) => { e.target.style.display = 'none'; }}
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050914] via-[#050914]/40 to-transparent" />
              
              <button onClick={() => setSelectedBar(null)} className="absolute top-6 right-6 p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-[#ff007f] transition-colors z-50">
                <X size={20} />
              </button>

              <div className="absolute bottom-6 left-6 right-6">
                <span className={`inline-block text-[10px] uppercase font-black px-3 py-1 rounded border mb-3 shadow-[0_0_15px_rgba(0,0,0,0.5)] ${getCatStyle(selectedBar.cat).color} border-current bg-black/50 backdrop-blur`}>
                  {selectedBar.cat}
                </span>
                <h2 className="text-4xl font-black text-white tracking-tight drop-shadow-2xl">
                  {selectedBar.name}
                </h2>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Description */}
              <p className="text-slate-300 leading-relaxed text-sm font-medium">
                {selectedBar.desc}
              </p>

              {/* Rich Data Grid */}
              <div className="grid grid-cols-1 gap-3 bg-[#0a1122] rounded-2xl p-5 border border-[#1a233a]">
                <div className="flex items-center gap-3 pb-3 border-b border-[#1a233a]">
                  <Wine size={18} className="text-[#ff007f]" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Signature Drink</p>
                    <p className="text-sm font-bold text-slate-200">{selectedBar.signatureDrink}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 py-3 border-b border-[#1a233a]">
                  <Clock size={18} className="text-[#00f3ff]" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Happy Hour</p>
                    <p className="text-sm font-bold text-slate-200">{selectedBar.happyHour}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-3">
                  <Users size={18} className="text-[#ff9900]" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Dress Code</p>
                    <p className="text-sm font-bold text-slate-200">{selectedBar.dressCode}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 pt-2">
                <button 
                  onClick={(e) => { setIsCrawlMode(true); toggleCrawl(e, selectedBar.id); }}
                  className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(255,0,127,0.2)] ${
                    crawlRouteIds.includes(selectedBar.id) ? 'bg-[#1a233a] text-white border border-[#2d3b5e]' : 'bg-[#ff007f] text-white hover:bg-white hover:text-black'
                  }`}
                >
                  {crawlRouteIds.includes(selectedBar.id) ? <><Check size={18}/> Remove from Crawl</> : <><Navigation size={18} /> Add to Crawl</>}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
