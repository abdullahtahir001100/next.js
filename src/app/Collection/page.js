// src/app/Collection/page.js

// 1. Wrap both in { } because they are "Named Exports"
import { connectDB } from '@/lib/db';
import { SiteData } from '@/lib/models/SiteData'; 

export default async function CollectionsPage() {
  await connectDB();
  
  // 2. Use 'SiteData' (the name from your model file) instead of 'Collection'
  const data = await SiteData.findOne({ pageId: "collections_main" });

  // Fallback if database is empty so the page doesn't crash
  if (!data) return <div>No inventory found. Visit the Admin Dashboard to create it.</div>;

  return (
    <main className="collections-container">
      <nav className="breadcrumb">
        {data.hero.breadcrumb}
      </nav>

      <section className="header-section">
        <h1>{data.hero.title}</h1>
        <p>{data.hero.description}</p>
      </section>

      <div className="collections-grid">
        {data.collections.map((item, index) => (
          <div key={index} className="collection-card">
            <div className="image-box">
              <img src={item.image || "/placeholder.jpg"} alt={item.title} />
              <div className="hover-overlay">
                <button className="inner-shop-btn">{item.btnText || "SHOP NOW"}</button>
              </div>
            </div>
            <h2>{item.title}</h2>
            <p className="product-count">{item.count}</p>
            <p className="desc">{item.desc}</p>
            <button className="main-btn">{item.btnText || "SHOP NOW"}</button>
          </div>
        ))}
      </div>
    </main>
  );
}