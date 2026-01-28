import React, { useState, useEffect, useMemo } from 'react';
import {
  Phone,
  Package,
  MapPin,
  MessageSquare,
  Wrench,
  Armchair,
  Search,
  Lock,
  Car,
  Heart,
  Settings
} from 'lucide-react';
import { storage } from './utils/storage';
import { supabase } from './utils/supabaseClient';
import SearchFilter from './components/SearchFilter';
import { ItemCard, ItemRow } from './components/InventoryItems';
import ItemModal from './components/ItemModal';
import FavoritesDrawer from './components/FavoritesDrawer';
import PinAuth from './components/PinAuth';
import AdminDashboard from './components/AdminDashboard';
import ItemForm from './components/ItemForm';
import ContactButton from './components/ContactButton';

// --- Header Component ---
const Header = ({ favoritesCount, onFavoritesClick, onAdminClick, currentView }) => (
  <header className="sticky top-0 z-50 bg-slate-950 border-b-2 border-yellow-400 px-4 py-3 flex items-center shadow-2xl">
    {/* Left: Admin Access */}
    <div className="flex-1 flex items-center">
      {currentView === 'shop' && (
        <button
          onClick={onAdminClick}
          className="p-2 bg-slate-900/50 border border-slate-800 rounded-lg text-slate-600 hover:text-orange-500 hover:border-orange-500/50 transition-all group"
          title="Lagerstyring"
        >
          <Lock className="size-4 md:size-5 transition-transform group-active:scale-110" />
        </button>
      )}
    </div>

    {/* Center: Branding */}
    <div className="flex flex-col items-center justify-center text-center">
      <div className="flex items-center gap-2 md:gap-3">
        <div className="bg-yellow-400 p-1.5 md:p-2 rounded-lg rotate-3 shadow-lg shadow-yellow-400/20">
          <Package className="text-black size-4 md:size-5" />
        </div>
        <h1 className="text-white font-black text-lg md:text-2xl leading-none tracking-tighter italic whitespace-nowrap">
          SAGER<span className="text-yellow-400">TIL</span>SALG
        </h1>
      </div>
      <p className="text-slate-500 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
        Professionel genbrug
      </p>
    </div>

    {/* Right: Public Buttons */}
    <div className="flex-1 flex items-center justify-end gap-2 md:gap-4">
      {currentView === 'shop' && (
        <>
          <button
            onClick={onFavoritesClick}
            className="relative p-2 md:p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-orange-500 hover:border-orange-500/50 transition-all group"
          >
            <Heart className={`size-4 md:size-5 transition-transform group-active:scale-125 ${favoritesCount > 0 ? 'fill-orange-500 text-orange-500' : ''}`} />
            {favoritesCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm ring-2 ring-slate-950 animate-in zoom-in uppercase">
                {favoritesCount}
              </span>
            )}
          </button>
          <ContactButton
            variant="header"
            label="Ring"
            className="bg-yellow-400 text-black border-none hover:bg-yellow-500 font-black px-4 md:px-6 py-2 rounded-xl shadow-lg shadow-yellow-400/10 text-[10px] md:text-xs uppercase tracking-widest"
          />
        </>
      )}
    </div>
  </header>
);

// --- Statistics Dashboard ---
const StatsDashboard = ({ items, selectedCategory, onSelectCategory }) => {
  const stats = useMemo(() => {
    const counts = { total: items.length, 'Værktøj': 0, 'Møbler': 0, 'Auto': 0, 'Maskiner': 0 };
    items.forEach(item => { if (counts[item.category] !== undefined) counts[item.category]++; });
    return counts;
  }, [items]);

  const cards = [
    { label: 'Alle Varer', key: 'Alle', count: stats.total, icon: Package, color: 'text-white', bg: 'bg-slate-700' },
    { label: 'Værktøj', key: 'Værktøj', count: stats['Værktøj'], icon: Wrench, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { label: 'Møbler', key: 'Møbler', count: stats['Møbler'], icon: Armchair, color: 'text-slate-400', bg: 'bg-slate-400/10' },
    { label: 'Auto', key: 'Auto', count: stats['Auto'], icon: Car, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Maskiner', key: 'Maskiner', count: stats['Maskiner'], icon: Settings, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  ];

  return (
    <div className="grid grid-cols-5 gap-2 mb-4">
      {cards.map((card, i) => {
        const isActive = selectedCategory === card.key;
        return (
          <button
            key={card.label}
            onClick={() => onSelectCategory(card.key)}
            className={`flex flex-col items-center justify-center text-center border-2 p-2 rounded-xl transition-all duration-300 active:scale-95 ${isActive
              ? 'bg-yellow-400 border-yellow-500 shadow-xl shadow-yellow-400/20 z-10'
              : 'bg-slate-900 border-slate-800 hover:border-slate-500'
              }`}
          >
            <div className={`${isActive ? 'bg-black text-yellow-400 border-black' : 'bg-slate-800 text-slate-500 border-slate-700'} flex items-center justify-center px-2 py-0.5 rounded-sm border mb-2`}>
              <span className="text-[10px] font-black leading-none">{card.count}</span>
            </div>

            <div className={`${isActive ? 'text-black' : `${card.color}`} mb-1 transition-colors`}>
              <card.icon className="size-5" />
            </div>

            <div className={`text-[9px] uppercase font-black tracking-tight truncate w-full ${isActive ? 'text-black' : 'text-slate-400'}`}>
              {card.label}
            </div>
          </button>
        );
      })}
    </div>
  );
};

// --- Main App Controller ---
export default function App() {
  const [items, setItems] = useState([]);
  const [viewMode, setViewMode] = useState('list');
  const [currentView, setCurrentView] = useState('shop'); // shop, pin, admin, add, edit
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Alle');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isFavDrawerOpen, setIsFavDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [adminPin, setAdminPin] = useState(null); // Store verified PIN

  // Load items on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const data = await storage.getAllItems();
      setItems(data);
      setIsLoading(false);
    };
    loadData();

    const savedFavs = sessionStorage.getItem('sts_favorites');
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
  }, []);

  const saveItem = async (itemData) => {
    const isNew = !items.find(i => i.sku === itemData.sku);

    // Save item via secure proxy
    await storage.set(`item:${itemData.sku}`, itemData, adminPin);

    if (isNew) {
      setItems(prev => [itemData, ...prev]);
    } else {
      setItems(prev => prev.map(i => i.sku === itemData.sku ? itemData : i));
    }

    setCurrentView('admin');
  };

  const deleteItem = async (sku) => {
    // Delete via secure proxy
    await storage.remove(`item:${sku}`, adminPin);

    // Optimistically update UI
    setItems(prev => prev.filter(i => i.sku !== sku));
  };

  // getNextSku is now handled by storage.js

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'Alle' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, selectedCategory]);

  const toggleFavorite = (sku) => {
    const newFavs = favorites.includes(sku)
      ? favorites.filter(id => id !== sku)
      : [...favorites, sku];
    setFavorites(newFavs);
    sessionStorage.setItem('sts_favorites', JSON.stringify(newFavs));
  };

  const favoriteItems = useMemo(() => {
    return items.filter(item => favorites.includes(item.sku));
  }, [items, favorites]);

  const renderContent = () => {
    switch (currentView) {
      case 'shop':
        return (
          <div className="flex flex-col h-full">
            <div className="flex-shrink-0 px-4 pt-4 bg-slate-900/50">
              <StatsDashboard
                items={items}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />

              <SearchFilter
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                viewMode={viewMode}
                setViewMode={setViewMode}
              />
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-20 custom-scrollbar">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                  <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                  <p className="text-slate-500 font-medium animate-pulse">Henter varer...</p>
                </div>
              ) : filteredItems.length > 0 ? (
                viewMode === 'grid' ? (
                  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-6 gap-3 pb-8">
                    {filteredItems.map(item => (
                      <ItemCard
                        key={item.sku}
                        item={item}
                        isFavorite={favorites.includes(item.sku)}
                        isSelected={selectedItem?.sku === item.sku}
                        onToggleFavorite={toggleFavorite}
                        onClick={() => setSelectedItem(item)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-1 pb-8">
                    {filteredItems.map(item => (
                      <ItemRow
                        key={item.sku}
                        item={item}
                        isFavorite={favorites.includes(item.sku)}
                        isSelected={selectedItem?.sku === item.sku}
                        onToggleFavorite={toggleFavorite}
                        onClick={() => setSelectedItem(item)}
                      />
                    ))}
                  </div>
                )
              ) : (
                <div className="text-center py-20 bg-slate-800/20 rounded-3xl border border-dashed border-slate-700/50 mx-4">
                  <div className="bg-slate-800 p-4 rounded-full w-fit mx-auto mb-4">
                    <Search className="text-slate-600 size-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Ingen varer fundet</h2>
                  <p className="text-slate-500 mb-6 max-w-sm mx-auto">Prøv at søge efter noget andet eller vælg en anden kategori.</p>
                  <button
                    onClick={() => { setSearchQuery(''); setSelectedCategory('Alle'); }}
                    className="text-emerald-500 font-bold hover:text-emerald-400 transition-colors"
                  >
                    Nulstil filtre
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case 'pin':
        return (
          <PinAuth
            onAuthSuccess={(pin) => {
              setAdminPin(pin);
              setCurrentView('admin');
            }}
            onCancel={() => setCurrentView('shop')}
          />
        );

      case 'admin':
        return (
          <AdminDashboard
            items={items}
            onAdd={() => setCurrentView('add')}
            onEdit={(item) => {
              setEditingItem(item);
              setCurrentView('edit');
            }}
            onDelete={deleteItem}
            onBack={() => setCurrentView('shop')}
          />
        );

      case 'add':
        return (
          <ItemForm
            getNextSku={storage.getNextSku}
            onSave={saveItem}
            onCancel={() => setCurrentView('admin')}
          />
        );

      case 'edit':
        return (
          <ItemForm
            initialData={editingItem}
            onSave={saveItem}
            onCancel={() => {
              setEditingItem(null);
              setCurrentView('admin');
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-900 overflow-hidden font-sans text-slate-200">
      <Header
        favoritesCount={favorites.length}
        onFavoritesClick={() => setIsFavDrawerOpen(true)}
        onAdminClick={() => setCurrentView('pin')}
        currentView={currentView}
      />

      <main className={`flex-1 ${currentView === 'shop' ? 'overflow-hidden max-w-none' : 'overflow-y-auto max-w-7xl mx-auto px-4 py-8 md:py-12 custom-scrollbar'}`}>
        {renderContent()}
      </main>

      {/* Minimalist Fixed Footer (Shop View Only) */}
      {currentView === 'shop' && (
        <footer className="fixed bottom-0 left-0 right-0 bg-slate-950 border-t-2 border-slate-800 py-3 px-6 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="hidden md:flex items-center gap-6">
              <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">
                +45 40 78 14 88 • Peter Behrend • Mårsøvej 1, 4300 Holbæk
              </p>
            </div>
          </div>
        </footer>
      )}

      {/* Modals & Overlays */}
      <ItemModal
        item={selectedItem}
        isFavorite={selectedItem ? favorites.includes(selectedItem.sku) : false}
        onToggleFavorite={toggleFavorite}
        onClose={() => setSelectedItem(null)}
      />

      <FavoritesDrawer
        isOpen={isFavDrawerOpen}
        onClose={() => setIsFavDrawerOpen(false)}
        items={favoriteItems}
        onRemove={toggleFavorite}
        onClear={() => {
          setFavorites([]);
          sessionStorage.removeItem('sts_favorites');
        }}
      />
    </div>
  );
}
