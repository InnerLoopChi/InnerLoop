import React, { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import {
  Map,
  MapPin,
  Users,
  Clock,
  Zap,
  Building2,
  Heart,
  Loader2,
  X,
  Search,
} from 'lucide-react';

// Chicago neighborhoods with approximate center coordinates
const NEIGHBORHOODS = [
  { name: 'Pilsen', lat: 41.8525, lng: -87.6614, color: '#8B6897' },
  { name: 'Logan Square', lat: 41.9234, lng: -87.7082, color: '#f18989' },
  { name: 'Humboldt Park', lat: 41.9020, lng: -87.7224, color: '#aFD2E9' },
  { name: 'Garfield Park', lat: 41.8806, lng: -87.7197, color: '#0a3200' },
  { name: 'Back of the Yards', lat: 41.8100, lng: -87.6567, color: '#8B6897' },
  { name: 'Little Village', lat: 41.8437, lng: -87.7133, color: '#f18989' },
  { name: 'Bronzeville', lat: 41.8230, lng: -87.6172, color: '#aFD2E9' },
  { name: 'Austin', lat: 41.8969, lng: -87.7650, color: '#0a3200' },
  { name: 'Englewood', lat: 41.7800, lng: -87.6460, color: '#8B6897' },
  { name: 'Lawndale', lat: 41.8600, lng: -87.7190, color: '#f18989' },
  { name: 'Bridgeport', lat: 41.8369, lng: -87.6505, color: '#aFD2E9' },
  { name: 'Hyde Park', lat: 41.7943, lng: -87.5907, color: '#0a3200' },
];

export default function MapPage() {
  const { profile } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHood, setSelectedHood] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Load posts
  useEffect(() => {
    const q = query(
      collection(db, 'posts'),
      where('isInnerOnly', '==', false),
      orderBy('postTime', 'desc')
    );

    const unsub = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, () => setLoading(false));

    return unsub;
  }, []);

  // Match posts to neighborhoods by tag
  function getPostsForHood(hoodName) {
    const hoodTag = hoodName.toLowerCase().replace(/\s+/g, '-');
    const hoodWords = hoodName.toLowerCase().split(' ');
    return posts.filter(p => {
      const tags = p.tags?.map(t => t.toLowerCase()) || [];
      const content = p.content?.toLowerCase() || '';
      return tags.some(t => t.includes(hoodTag) || hoodWords.some(w => t.includes(w)))
        || hoodWords.some(w => w.length > 4 && content.includes(w));
    });
  }

  // Filter neighborhoods by search
  const filteredHoods = searchTerm
    ? NEIGHBORHOODS.filter(h => h.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : NEIGHBORHOODS;

  const selectedPosts = selectedHood ? getPostsForHood(selectedHood.name) : [];

  // Map bounds (Chicago)
  const mapMinLat = 41.74, mapMaxLat = 41.95;
  const mapMinLng = -87.80, mapMaxLng = -87.56;

  function latToY(lat) {
    return ((mapMaxLat - lat) / (mapMaxLat - mapMinLat)) * 100;
  }
  function lngToX(lng) {
    return ((lng - mapMinLng) / (mapMaxLng - mapMinLng)) * 100;
  }

  return (
    <div className="min-h-screen bg-loop-gray">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-loop-gray/50">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <h1 className="font-display text-lg font-extrabold flex items-center gap-2">
            <Map size={18} className="text-loop-red" />
            Neighborhood Map
          </h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-loop-green/30" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search neighborhoods..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-loop-gray bg-white text-sm placeholder:text-loop-green/30 focus:outline-none focus:ring-2 focus:ring-loop-purple/20"
          />
        </div>

        {/* Visual Map */}
        <div className="bg-white rounded-2xl border border-loop-gray/50 p-4 relative overflow-hidden" style={{ minHeight: 320 }}>
          {/* Map background */}
          <div className="absolute inset-4 rounded-xl bg-gradient-to-br from-loop-blue/5 to-loop-green/5 border border-loop-gray/30">
            {/* Lake Michigan hint */}
            <div className="absolute right-0 top-0 bottom-0 w-1/6 bg-loop-blue/10 rounded-r-xl" />
            <p className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] text-loop-blue/40 font-medium" style={{ writingMode: 'vertical-rl' }}>Lake Michigan</p>
          </div>

          {/* Neighborhood pins */}
          {filteredHoods.map(hood => {
            const hoodPosts = getPostsForHood(hood.name);
            const count = hoodPosts.length;
            const isSelected = selectedHood?.name === hood.name;
            const x = lngToX(hood.lng);
            const y = latToY(hood.lat);

            return (
              <button
                key={hood.name}
                onClick={() => setSelectedHood(isSelected ? null : hood)}
                className={`absolute z-10 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300
                  ${isSelected ? 'scale-125 z-20' : 'hover:scale-110'}`}
                style={{ left: `${x}%`, top: `${y}%` }}
                title={`${hood.name} (${count} posts)`}
              >
                <div className={`relative flex flex-col items-center`}>
                  {/* Pin */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all
                    ${isSelected ? 'ring-2 ring-offset-1' : ''}
                    ${count > 0 ? '' : 'opacity-40'}`}
                    style={{
                      background: hood.color,
                      ringColor: hood.color,
                    }}
                  >
                    {count > 0 ? (
                      <span className="text-white text-[10px] font-bold">{count}</span>
                    ) : (
                      <MapPin size={12} className="text-white/70" />
                    )}
                  </div>
                  {/* Label */}
                  <span className={`mt-0.5 text-[8px] font-semibold whitespace-nowrap px-1 rounded
                    ${isSelected ? 'bg-white shadow-sm text-loop-green' : 'text-loop-green/50'}`}>
                    {hood.name}
                  </span>
                </div>
              </button>
            );
          })}

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-xl">
              <Loader2 size={24} className="animate-spin text-loop-purple" />
            </div>
          )}
        </div>

        {/* Selected neighborhood posts */}
        {selectedHood && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-bold flex items-center gap-2">
                <MapPin size={14} style={{ color: selectedHood.color }} />
                {selectedHood.name}
                <span className="text-loop-green/40 font-normal">({selectedPosts.length} posts)</span>
              </h3>
              <button onClick={() => setSelectedHood(null)} className="w-7 h-7 rounded-full bg-loop-gray flex items-center justify-center">
                <X size={14} />
              </button>
            </div>

            {selectedPosts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-loop-gray/50 p-6 text-center">
                <p className="text-sm text-loop-green/40">No posts tagged with this neighborhood yet</p>
              </div>
            ) : (
              selectedPosts.map(post => (
                <div key={post.id} className="bg-white rounded-2xl border border-loop-gray/50 p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                      post.authorRole === 'Inner' ? 'bg-loop-purple/15' : 'bg-loop-red/15'
                    }`}>
                      {post.authorRole === 'Inner'
                        ? <Building2 size={12} className="text-loop-purple" />
                        : <Heart size={12} className="text-loop-red" />
                      }
                    </div>
                    <span className="text-xs font-semibold">{post.authorName}</span>
                    {post.taskCapacity > 0 && (
                      <span className="ml-auto text-[10px] text-loop-green/40 flex items-center gap-1">
                        <Users size={9} /> {post.taskFilled || 0}/{post.taskCapacity}
                        {post.hoursReward && <><Clock size={9} className="ml-1" /> +{post.hoursReward}h</>}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-loop-green/70 leading-relaxed">{post.content}</p>
                  {post.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {post.tags.map(t => (
                        <span key={t} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-loop-blue/15">#{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Neighborhood grid — when nothing selected */}
        {!selectedHood && (
          <div className="space-y-3">
            <h3 className="font-display text-sm font-bold text-loop-green/60">Neighborhoods</h3>
            <div className="grid grid-cols-2 gap-2">
              {filteredHoods.map(hood => {
                const count = getPostsForHood(hood.name).length;
                return (
                  <button
                    key={hood.name}
                    onClick={() => setSelectedHood(hood)}
                    className="bg-white rounded-xl border border-loop-gray/50 p-3 text-left hover:shadow-sm transition-all flex items-center gap-2.5"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: hood.color + '20' }}>
                      <MapPin size={14} style={{ color: hood.color }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate">{hood.name}</p>
                      <p className="text-[10px] text-loop-green/40">{count} post{count !== 1 ? 's' : ''}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
