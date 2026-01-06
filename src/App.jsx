import React, { useState, useEffect, useMemo } from 'react';
import {
  Phone,
  Package,
  MapPin,
  MessageSquare,
  Wrench,
  Armchair,
  Car,
  Settings,
  Settings2,
  Heart,
  Search,
  Lock
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
const Header = ({ favoritesCount, onFavoritesClick, currentView }) => (
  <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 px-4 py-3 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className="bg-emerald-500 p-1.5 rounded-lg shadow-lg shadow-emerald-500/20">
        <Package className="text-white size-5 md:size-6" />
      </div>
      <div>
        <h1 className="text-white font-bold text-lg md:text-xl leading-none">SagerTilSalg</h1>
        <p className="text-slate-400 text-[10px] md:text-xs uppercase tracking-widest mt-0.5">Peter Behrend</p>
      </div>
    </div>
    <div className="flex items-center gap-2 md:gap-4">
      {currentView === 'shop' && (
        <>
          <button
            onClick={onFavoritesClick}
            className="relative p-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-300 hover:text-emerald-400 hover:border-emerald-500/50 transition-all group"
          >
            <Heart className={`size-5 md:size-6 transition-transform group-active:scale-125 ${favoritesCount > 0 ? 'fill-emerald-500 text-emerald-500' : ''}`} />
            {favoritesCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ring-2 ring-slate-900 animate-in zoom-in">
                {favoritesCount}
              </span>
            )}
          </button>
          <ContactButton
            variant="header"
            label="Ring Peter"
          />
        </>
      )}
    </div>
  </header>
);

// --- Statistics Dashboard ---
const StatsDashboard = ({ items, selectedCategory, onSelectCategory }) => {
  const stats = useMemo(() => {
    const counts = { total: items.length, 'Værktøj': 0, 'Møbler': 0, 'Bildele': 0, 'Maskiner': 0 };
    items.forEach(item => { if (counts[item.category] !== undefined) counts[item.category]++; });
    return counts;
  }, [items]);

  const cards = [
    { label: 'Alle Varer', key: 'Alle', count: stats.total, icon: Package, color: 'text-white', bg: 'bg-emerald-600' },
    { label: 'Værktøj', key: 'Værktøj', count: stats['Værktøj'], icon: Wrench, color: 'text-orange-400', bg: 'bg-orange-400/10' },
    { label: 'Møbler', key: 'Møbler', count: stats['Møbler'], icon: Armchair, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Bildele', key: 'Bildele', count: stats['Bildele'], icon: Car, color: 'text-red-400', bg: 'bg-red-400/10' },
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
            className={`flex flex-col items-center justify-center text-center border p-2 rounded-xl transition-all duration-300 active:scale-95 ${isActive
              ? 'bg-emerald-500 border-emerald-400 shadow-lg shadow-emerald-500/20 z-10'
              : 'bg-slate-800/40 border-slate-700/50 hover:border-slate-500'
              }`}
          >
            <div className={`${isActive ? 'bg-white/20 text-white border-white/20' : 'bg-slate-900/40 text-slate-400 border-slate-700/30'} flex items-center justify-center px-2 py-0.5 rounded-full border mb-2`}>
              <span className="text-[10px] font-bold leading-none">{card.count}</span>
            </div>

            <div className={`${isActive ? 'text-white' : `${card.color}`} mb-1 transition-colors`}>
              <card.icon className="size-5" />
            </div>

            <div className={`text-[10px] font-bold tracking-tight truncate w-full ${isActive ? 'text-white' : 'text-slate-300'}`}>
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

    // Save item
    await storage.set(`item:${itemData.sku}`, itemData);

    if (isNew) {
      setItems(prev => [itemData, ...prev]);
    } else {
      setItems(prev => prev.map(i => i.sku === itemData.sku ? itemData : i));
    }

    setCurrentView('admin');
  };

  const deleteItem = async (sku) => {
    const itemToDelete = items.find(i => i.sku === sku);

    // Delete image from storage if it's a Supabase URL
    if (itemToDelete?.image && itemToDelete.image.includes('supabase.co/storage/v1/object/public/inventory/')) {
      const fileName = itemToDelete.image.split('inventory/').pop();
      if (fileName) {
        await supabase.storage.from('inventory').remove([fileName]);
      }
    }

    await storage.remove(`item:${sku}`);
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
            onAuthSuccess={() => setCurrentView('admin')}
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
        currentView={currentView}
      />

      <main className={`flex-1 overflow-hidden ${currentView === 'shop' ? 'max-w-none' : 'max-w-7xl mx-auto px-4 py-8 md:py-12'}`}>
        {renderContent()}
      </main>

      {/* Minimalist Fixed Footer (Shop View Only) */}
      {currentView === 'shop' && (
        <footer className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-md border-t border-slate-800/50 py-3 px-6 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="hidden md:flex items-center gap-6">
              <p className="text-slate-500 text-[10px] font-medium">
                © 2025 SagerTilSalg — Peter Behrend
              </p>
              <div className="h-4 w-px bg-slate-800" />
              <div className="flex gap-4 text-slate-500 text-[9px] font-bold uppercase tracking-wider">
                <span className="cursor-pointer hover:text-slate-300">Privatliv</span>
                <span className="cursor-pointer hover:text-slate-300">Handelsbetingelser</span>
              </div>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <ContactButton variant="ghost" label="+45 12 34 56 78" className="bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50 text-[11px]" />
              <button
                onClick={() => setCurrentView('pin')}
                className="bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700/50 transition-all flex items-center gap-2 text-[11px] font-bold"
              >
                <Lock className="size-3" />
                Lagerstyring
              </button>
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
