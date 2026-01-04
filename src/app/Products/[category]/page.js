"use client";
import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import axios from "axios";
import Select from "react-select";
import toast, { Toaster } from "react-hot-toast";
import { 
  X, ShoppingCart, ChevronUp, Activity, Info 
} from "lucide-react"; 
import "../collections.scss";
import FullPageLoader from "../../components/VikingLoader";
// --- ICONS ---
const Icons = {
  Grid2: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="2" width="9" height="20"></rect><rect x="13" y="2" width="9" height="20"></rect></svg>
  ),
  Grid3: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="2" width="6" height="20"></rect><rect x="9" y="2" width="6" height="20"></rect><rect x="16" y="2" width="6" height="20"></rect></svg>
  ),
  List: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="4" width="20" height="4"></rect><rect x="2" y="10" width="20" height="4"></rect><rect x="2" y="16" width="20" height="4"></rect></svg>
  ),
};

const customSelectStyles = {
  control: (base) => ({
    ...base,
    minWidth: '160px',
    borderRadius: '4px',
    border: '1px solid #e2e8f0',
    fontSize: '12px',
    fontWeight: '600',
    boxShadow: 'none',
    '&:hover': { border: '1px solid #111' }
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? '#111' : state.isFocused ? '#f8fafc' : '#fff',
    color: state.isSelected ? '#fff' : '#333',
    fontSize: '12px',
    cursor: 'pointer'
  })
};

const NoticeablePopup = ({ t, type, message, icon: Icon }) => (
  <div className={`custom-popup-box ${type} animate-popup`}>
    <div className="popup-body">
      <div className="svg-icon-wrap">{Icon ? <Icon size={32} /> : <Info size={32} />}</div>
      <div className="content">
        <h4>{type === 'success' ? 'ARMORY UPDATE' : type.toUpperCase()}</h4>
        <p>{message}</p>
      </div>
      <button onClick={() => toast.dismiss(t.id)} className="close-btn"><X size={14} /></button>
    </div>
    <div className="popup-progress-bar"><div className="fill"></div></div>
  </div>
);



export default function CollectionsPage() {
  const params = useParams();
  const categoryName = decodeURIComponent(params.category);
  const [products, setProducts] = useState([]);
  const [sectionData, setSectionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gridColumns, setGridColumns] = useState(3);
  const [priceMax, setPriceMax] = useState(210);
  const [itemsPerPage, setItemsPerPage] = useState({ value: 10, label: "10" });
  const [sortBy, setSortBy] = useState({ value: "best-selling", label: "Best selling" });

  const categories = [ "Swords", "Axes", "Knives & Daggers", "Chef Set", "Spears & Polearms", "Hammers & Maces", "Shields & Armor", "Display & Accessories" ];

  useEffect(() => {
    loadData();
  }, [categoryName, sortBy, itemsPerPage]);

  const loadData = async () => {
    setLoading(true);
    try {
      const secRes = await axios.get(`/api/sections?name=${categoryName}`);
      if (secRes.data.success) setSectionData(secRes.data.data);

      const prodRes = await axios.get(`/api/shopProducts?category=${categoryName}&sort=${sortBy.value}&limit=${itemsPerPage.value}`);
      if (prodRes.data.success) setProducts(prodRes.data.data);
    } catch (err) { console.error(err); } 
    finally { setTimeout(() => setLoading(false), 800); }
  };

  const addToCart = (p) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push({ id: p._id, quantity: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    toast.custom((t) => <NoticeablePopup t={t} type="success" message="Added to Cart" icon={ShoppingCart} />);
  };

  const filteredProducts = useMemo(() => products.filter(p => parseFloat(p.price) <= priceMax), [products, priceMax]);

  if (loading) return <FullPageLoader />;

  return (
    <div className="collections-page">
      <Toaster position="top-right" />
      <div className="breadcrumb"><Link href="/">Home</Link> <span>&gt;</span> {categoryName}</div>

      <div className="layout-container">
        <aside className="sidebar-col">
          {/* Categories Filter */}
          <div className="filter-block">
            <div className="filter-title"><h3>CATEGORIES</h3><ChevronUp size={14}/></div>
            <ul className="cat-list">
              {categories.map((cat, idx) => (
                <li key={idx} className={cat === categoryName ? "active" : ""}>
                  <Link href={`/Products/${encodeURIComponent(cat)}`}>
                    {cat === categoryName && <span className="active-marker">&gt; </span>}{cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Availability Filter */}
          <div className="filter-block">
            <div className="filter-title"><h3>AVAILABILITY</h3><ChevronUp size={14}/></div>
            <div className="check-list">
              <label className="custom-check">
                <input type="checkbox" defaultChecked /><span className="box"></span>
                In Stock ({products.length})
              </label>
            </div>
          </div>

          {/* Price Filter */}
          <div className="filter-block">
            <div className="filter-title"><h3>PRICE</h3><ChevronUp size={14}/></div>
            <div className="price-widget">
              <input type="range" min="0" max="1000" value={priceMax} onChange={(e) => setPriceMax(Number(e.target.value))} className="range-input" />
              <div className="price-inputs-row">
                <div className="p-input"><span>$</span><input type="number" value={0} readOnly /></div>
                <span className="to">to</span>
                <div className="p-input"><span>$</span><input type="number" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} /></div>
              </div>
              <button className="btn-apply" onClick={loadData}>Apply</button>
            </div>
          </div>
        </aside>

        <div className="main-col">
          <div className="category-banner">
             {sectionData?.mainPic && <Image src={sectionData.mainPic} alt="Banner" fill priority className="banner-img" />}
          </div>

          <div className="cat-description">
            <h2>{categoryName}</h2>
            <p>{sectionData?.mainDescription || "Hand-forged historical weapons crafted with authentic materials."}</p>
          </div>

          {/* TOOLBAR */}
          <div className="toolbar-section">
            <div className="view-toggle">
              <span className="lbl">VIEW AS</span>
              {/* 2nd Icon - Grid 2 */}
              <button className={gridColumns === 2 ? 'active' : ''} onClick={() => setGridColumns(2)}><Icons.Grid2 /></button>
              {/* 3rd Icon - Grid 3 */}
              <button className={gridColumns === 3 ? 'active' : ''} onClick={() => setGridColumns(3)}><Icons.Grid3 /></button>
              {/* 1st Icon - List */}
              <button className={gridColumns === 1 ? 'active' : ''} onClick={() => setGridColumns(1)}><Icons.List /></button>
            </div>

            <div className="sort-actions">
               <div className="select-group">
                 <label>ITEMS PER PAGE</label>
                 <Select 
                    styles={customSelectStyles}
                    value={itemsPerPage} 
                    onChange={setItemsPerPage}
                    options={[10, 15, 20, 25, 30, 50].map(v => ({value:v, label:v.toString()}))}
                 />
               </div>
               <div className="select-group">
                 <label>SORT BY</label>
                 <Select 
                    styles={customSelectStyles}
                    value={sortBy} 
                    onChange={setSortBy}
                    options={[
                      {value: "featured", label: "Featured"},
                      {value: "best-selling", label: "Best selling"},
                      {value: "title-ascending", label: "Alphabetically, A-Z"},
                      {value: "title-descending", label: "Alphabetically, Z-A"},
                      {value: "price-ascending", label: "Price, low to high"},
                      {value: "price-descending", label: "Price, high to low"},
                    ]}
                 />
               </div>
            </div>
          </div>

          {/* PRODUCTS WRAPPER */}
          <div className={`products-wrapper cols-${gridColumns}`}>
            {filteredProducts.map((p) => (
              <div key={p._id} className="prod-card">
                  <div className="img-box">
                    {p.onSale && <span className="tag-sale">Sale</span>}
                    <Link href={`/detailProduct/${p._id}`}>
                      <Image src={p.mainImage} alt={p.name} width={450} height={450} className="primary-img" />
                    </Link>
                  </div>
                  <div className="details-box">
                    <h3 className="p-name"><Link href={`/product/${p._id}`}>{p.name}</Link></h3>
                    
                    {/* Description only visible in List View (gridColumns === 1) */}
                    {gridColumns === 1 && (
                      <p className="p-desc">{p.description}</p>
                    )}

                    <div className="p-prices">
                      {p.onSale && <span className="old">${p.price}</span>}
                      <span className="new">${p.salePrice || p.price}</span>
                    </div>
                    <button className="btn-buy" onClick={() => addToCart(p)}>Buy Now</button>
                  </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}