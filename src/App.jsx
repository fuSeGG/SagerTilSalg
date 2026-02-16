import React, { useState, useEffect, useMemo } from 'react';
import { Menu, Heart, Package, Printer, FileText, ArrowRight, Bookmark, Search } from 'lucide-react';
import { formatFavoritesAsText, downloadTextFile } from './utils/exportUtils';
import { storage } from './utils/storage';
import { CATEGORIES, getIconComponent } from './utils/constants';
import { supabase } from './utils/supabaseClient';
import { ItemCard, ItemRow } from './components/InventoryItems';
import ItemModal from './components/ItemModal';

import PinAuth from './components/PinAuth';
import AdminDashboard from './components/AdminDashboard';
import ItemForm from './components/ItemForm';
import Sidebar from './components/Sidebar';
import ContactButton from './components/ContactButton';
import { List, LayoutGrid } from 'lucide-react';

// --- Main App Controller ---
export default function App() {
  const [items, setItems] = useState([]);
  const [viewMode, setViewMode] = useState('list');
  const [currentView, setCurrentView] = useState('shop'); // shop, pin, admin, add, edit

  // Lazy init favorites from sessionStorage
  const [favorites, setFavorites] = useState(() => {
    const saved = sessionStorage.getItem('sts_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Alle');
  const [selectedItem, setSelectedItem] = useState(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [adminPin, setAdminPin] = useState(null); // Store verified PIN

  // Dynamic categories state
  const [categories, setCategories] = useState([]);

  // Load items and categories on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Parallel fetch for speed
        const [itemsData, categoriesData] = await Promise.all([
          storage.getAllItems(),
          supabase.from('categories').select('*').order('sort_order', { ascending: true })
        ]);

        setItems(Array.isArray(itemsData) ? itemsData : []);

        // Use DB categories if available, else fallback
        if (categoriesData.data && categoriesData.data.length > 0) {
          // Normalize DB categories (snake_case to camelCase)
          const normalized = categoriesData.data.map(cat => ({
            ...cat,
            skuPrefix: cat.sku_prefix // Map sku_prefix from DB to skuPrefix for UI
          }));
          setCategories(normalized);
        } else {
          console.log('Using fallback categories');
          setCategories(CATEGORIES);
        }
      } catch (err) {
        console.error('Failed to load data:', err);
        setCategories(CATEGORIES); // Safety fallback
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
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

  const favoriteItems = useMemo(() => {
    return items.filter(item => favorites.includes(item.sku));
  }, [items, favorites]);

  // Filter items
  const filteredItems = useMemo(() => {
    const sourceList = selectedCategory === 'Favoritter' ? favoriteItems : items;

    return sourceList.filter(item => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'Alle' || selectedCategory === 'Favoritter' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, favoriteItems, searchQuery, selectedCategory]);

  const toggleFavorite = (sku) => {
    const newFavs = favorites.includes(sku)
      ? favorites.filter(id => id !== sku)
      : [...favorites, sku];
    setFavorites(newFavs);
    sessionStorage.setItem('sts_favorites', JSON.stringify(newFavs));
  };

  const handlePrint = () => {
    window.print();
  };

  const renderContent = () => {
    switch (currentView) {
      case 'shop':
        return (
          <div className="flex flex-col h-full bg-bg-primary">
            {/* Mobile Top Bar */}
            <div className="md:hidden flex items-center h-16 px-4 bg-bg-primary border-b border-border sticky top-0 z-40">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 -ml-2 bg-bg-secondary/40 backdrop-blur-md rounded-xl text-text-primary border border-border/50 active:scale-95 transition-all"
              >
                <Menu className="size-6" />
              </button>

              <div className="flex-1 flex items-center justify-center gap-2 pl-6">
                <div className="bg-accent p-1 rounded rotate-3 shadow-lg shadow-accent/20">
                  <Package className="text-accent-contrast size-4" />
                </div>
                <span className="text-text-primary font-black italic tracking-tighter text-lg whitespace-nowrap">
                  SAGER<span className="text-accent">TIL</span>SALG
                </span>
              </div>

              {/* Quick Access Favorites Button (Top Right) */}
              <button
                onClick={() => setSelectedCategory('Favoritter')}
                className={`p-2.5 -mr-2 backdrop-blur-md rounded-xl border transition-all active:scale-95 group ${selectedCategory === 'Favoritter'
                  ? 'bg-accent text-accent-contrast border-accent-hover'
                  : 'bg-bg-secondary/40 text-text-primary border-border/50'}`}
              >
                <div className="relative">
                  <Heart className={`size-5 ${favorites.length > 0 ? (selectedCategory === 'Favoritter' ? 'fill-accent-contrast text-accent-contrast' : 'fill-success text-success') : 'text-text-muted group-hover:text-error'}`} />
                  {favorites.length > 0 && (
                    <span className={`absolute -top-1.5 -right-1.5 text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-bg-primary ${selectedCategory === 'Favoritter' ? 'bg-accent-contrast text-accent' : 'bg-error text-white'}`}>
                      {favorites.length}
                    </span>
                  )}
                </div>
              </button>
            </div>

            {/* Desktop Header Context / Universal Header Controls */}
            <div className="flex-shrink-0 px-6 py-4 bg-bg-secondary/20 border-b border-border/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-3">
                  <h2 className="text-2xl md:text-4xl font-black text-text-primary uppercase italic tracking-tighter leading-none truncate">
                    {selectedCategory === 'Alle' ? 'Alle Varer' : selectedCategory}
                  </h2>
                  <span className="text-xs text-text-secondary font-bold not-italic tracking-normal bg-bg-tertiary/50 px-2 py-1 rounded-lg border border-border/50 flex-shrink-0">
                    {filteredItems.length} varer
                  </span>
                </div>
                <p className="text-text-muted mt-1.5 text-xs font-bold uppercase tracking-[0.3em] overflow-hidden text-ellipsis whitespace-nowrap">
                  {selectedCategory === 'Favoritter' ? 'Dine gemte favoritter' : 'Gennemse vores lager'}
                </p>
              </div>

              {/* Global Controls: Search & View Mode */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative group w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-text-muted group-focus-within:text-accent transition-colors" />
                  <input
                    type="text"
                    placeholder="Søg i lager..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-bg-secondary border border-border rounded-xl py-2 pl-9 pr-8 text-xs font-bold text-text-primary focus:outline-none focus:border-accent/50 transition-all placeholder:text-text-muted uppercase tracking-widest shadow-inner"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex p-1 bg-bg-secondary rounded-xl border border-border shadow-inner">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all ${viewMode === 'list' ? 'bg-accent text-accent-contrast shadow-lg shadow-accent/20' : 'text-text-muted hover:text-text-secondary'}`}
                  >
                    <List className="size-3" />
                    <span className="hidden lg:inline">Liste</span>
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all ${viewMode === 'grid' ? 'bg-accent text-accent-contrast shadow-lg shadow-accent/20' : 'text-text-muted hover:text-text-secondary'}`}
                  >
                    <LayoutGrid className="size-3" />
                    <span className="hidden lg:inline">Gitter</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons for Favorites View */}
              {selectedCategory === 'Favoritter' && favorites.length > 0 && (
                <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-500">
                  <button
                    onClick={() => {
                      const text = formatFavoritesAsText(filteredItems);
                      downloadTextFile(text);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-bg-tertiary hover:bg-bg-secondary border border-border rounded-xl text-text-secondary text-xs font-black uppercase tracking-wider transition-all active:scale-95"
                  >
                    <FileText className="size-4" />
                    <span className="hidden sm:inline">Gem liste</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 bg-text-primary text-bg-primary hover:bg-text-secondary rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-text-primary/5"
                  >
                    <Printer className="size-4" />
                    <span className="hidden sm:inline">Print</span>
                  </button>
                  <a
                    href="tel:+4540781488"
                    className="flex items-center gap-2 px-4 py-2 bg-success hover:bg-success/80 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-success/20"
                  >
                    Kontakt
                  </a>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-20 custom-scrollbar">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                  <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
                  <p className="text-text-muted font-medium animate-pulse">Henter varer...</p>
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
                <div className="text-center py-20 bg-bg-secondary/20 rounded-3xl border border-dashed border-border/50 mx-4">

                  {/* Specialized Empty States */}
                  {selectedCategory === 'Favoritter' ? (
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <div className="bg-bg-tertiary p-6 rounded-full mb-6 relative">
                        <Bookmark className="text-text-muted size-10" />
                        <Heart className="absolute -bottom-1 -right-1 text-bg-primary fill-text-muted size-8 stroke-[3px]" />
                      </div>
                      <h2 className="text-2xl font-black text-text-primary italic tracking-tighter mb-2">Ingen favoritter endnu</h2>
                      <p className="text-text-secondary text-sm mb-8 leading-relaxed">
                        Du har ikke gemt nogen varer endnu. Klik på hjertet på de varer du er interesseret i, for at samle dem her.
                      </p>
                      <button
                        onClick={() => setSelectedCategory('Alle')}
                        className="flex items-center gap-2 px-8 py-4 bg-accent hover:bg-accent-hover text-accent-contrast rounded-2xl font-black uppercase text-xs tracking-widest transition-all active:scale-95 shadow-xl shadow-accent/20"
                      >
                        <ArrowRight className="size-4 rotate-180" />
                        <span>Gå til alle varer</span>
                      </button>
                    </div>
                  ) : (
                    // Standard Search/Category Empty State
                    <div>
                      <div className="bg-bg-tertiary p-4 rounded-full w-fit mx-auto mb-4">
                        <Search className="text-text-muted size-8" />
                      </div>
                      <h2 className="text-2xl font-bold text-text-primary mb-2">Ingen varer fundet</h2>

                      {searchQuery ? (
                        <div className="space-y-4">
                          <p className="text-text-muted mb-6 max-w-sm mx-auto italic">
                            Ingen match i "{selectedCategory === 'Alle' ? 'lageret' : selectedCategory}" for "{searchQuery}"
                          </p>

                          {/* Smart suggestions */}
                          {(() => {
                            // Use dynamic categories for suggestions
                            const activeCats = categories.length > 0 ? categories : CATEGORIES;
                            const suggestions = activeCats
                              .filter(c => c.id !== selectedCategory)
                              .map(c => {
                                const count = (items || []).filter(item =>
                                  item && item.category === c.id &&
                                  (item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    item.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    item.description?.toLowerCase().includes(searchQuery.toLowerCase()))
                                ).length;
                                return { cat: c.id, count };
                              })
                              .filter(s => s.count > 0);

                            if (suggestions.length > 0) {
                              return (
                                <div className="space-y-3">
                                  <p className="text-xs font-black uppercase tracking-widest text-accent/80">Prøv i stedet:</p>
                                  <div className="flex flex-wrap justify-center gap-2">
                                    {suggestions.map(s => (
                                      <button
                                        key={s.cat}
                                        onClick={() => setSelectedCategory(s.cat)}
                                        className="px-4 py-2 bg-bg-tertiary hover:bg-bg-secondary border border-border rounded-xl text-xs font-black text-text-primary transition-all active:scale-95 flex items-center gap-2"
                                      >
                                        <span>{s.cat}</span>
                                        <span className="bg-accent text-accent-contrast px-1.5 py-0.5 rounded text-xs">{s.count}</span>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          })()}

                          <button
                            onClick={() => { setSearchQuery(''); setSelectedCategory('Alle'); }}
                            className="block mx-auto mt-8 text-text-secondary font-bold hover:text-text-primary transition-colors text-sm underline underline-offset-4"
                          >
                            Nulstil alle filtre
                          </button>
                        </div>
                      ) : (
                        <>
                          <p className="text-text-muted mb-6 max-w-sm mx-auto">Vælg en anden kategori eller ryd dine filtre.</p>
                          <button
                            onClick={() => { setSearchQuery(''); setSelectedCategory('Alle'); }}
                            className="text-success font-bold hover:text-success/80 transition-colors"
                          >
                            Nulstil filtre
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Subtle Footer for Admin Access */}
            <footer className="mt-auto py-8 border-t border-border/30 px-6 flex flex-col items-center gap-4 bg-bg-secondary/10">
              <div className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-text-muted">Mårsøvej 1, 4300 Holbæk</p>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-text-muted">+45 40 78 14 88</p>
              </div>
              <button
                onClick={() => setCurrentView('pin')}
                className="text-[10px] font-black uppercase text-text-muted hover:text-accent tracking-[0.2em] transition-all flex items-center gap-2"
              >
                <span>Administrer Lagerstyring</span>
              </button>
            </footer>
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
            categories={categories}
            onInspect={(item) => setSelectedItem(item)}
          />
        );

      case 'add':
        return (
          <ItemForm
            getNextSku={storage.getNextSku}
            onSave={saveItem}
            onCancel={() => setCurrentView('admin')}
            categories={categories}
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
            categories={categories}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-[100dvh] flex bg-bg-primary overflow-hidden font-sans text-text-primary">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        items={items}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        favoritesCount={favorites.length}
        onAdminClick={() => setCurrentView('pin')}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        viewMode={viewMode}
        setViewMode={setViewMode}
        currentView={currentView}
        categories={categories}
      />

      {/* Quick Access Favorites Button (Desktop only, mobile has it in header) */}
      <button
        onClick={() => setSelectedCategory('Favoritter')}
        className={`hidden md:flex fixed top-4 right-4 z-40 p-3 backdrop-blur-md rounded-full border shadow-xl transition-all active:scale-95 group ${selectedCategory === 'Favoritter'
          ? 'bg-accent text-accent-contrast border-accent-hover hover:bg-accent-hover'
          : 'bg-bg-secondary/80 text-text-primary border-border/50 hover:bg-bg-tertiary'}`}
      >
        <div className="relative">
          <Heart className={`size-6 ${favorites.length > 0 ? (selectedCategory === 'Favoritter' ? 'fill-accent-contrast text-accent-contrast' : 'fill-success text-success') : 'text-text-muted group-hover:text-error'}`} />
          {favorites.length > 0 && (
            <span className={`absolute -top-2 -right-2 text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-bg-primary ${selectedCategory === 'Favoritter' ? 'bg-accent-contrast text-accent' : 'bg-error text-white'}`}>
              {favorites.length}
            </span>
          )}
        </div>
      </button>

      {/* Main Content Area (Offset by Sidebar on Desktop) */}
      <main className={`flex-1 flex flex-col h-full bg-bg-primary transition-all duration-300 ${currentView === 'shop' || currentView === 'pin' ? 'md:ml-64' : 'w-full'} ${currentView !== 'shop' ? 'z-50 bg-bg-primary fixed inset-0 md:static' : ''} w-full max-w-[100vw] overflow-x-auto`}>
        {renderContent()}
      </main>

      {/* Modals & Overlays */}
      <ItemModal
        item={selectedItem}
        isFavorite={selectedItem ? favorites.includes(selectedItem.sku) : false}
        onToggleFavorite={toggleFavorite}
        onClose={() => setSelectedItem(null)}
      />


    </div>
  );
}
