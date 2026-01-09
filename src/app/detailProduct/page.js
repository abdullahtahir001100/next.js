"use client";
import React, { useState, useMemo, useEffect } from 'react';
import {
  FaHeart, FaShareAlt, FaMinus, FaPlus, FaEye, FaFire, FaStar,
  FaTelegramPlane, FaFacebookF, FaPinterestP, FaTumblr, FaRegCopy,
  FaTruck, FaUndoAlt, FaShieldAlt, FaDharmachakra, FaWeightHanging,
  FaRulerCombined, FaDraftingCompass, FaSpinner, FaRegStar, FaStarHalfAlt
} from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";
import { MdOutlineEmail } from "react-icons/md";
import { IoCloseOutline } from "react-icons/io5";

// --- Helper Component: Star Display ---
const StarRating = ({ rating, totalReviews }) => {
  const stars = [];
  const numericRating = parseFloat(rating) || 0;

  for (let i = 1; i <= 5; i++) {
    if (i <= numericRating) {
      stars.push(<FaStar key={i} className="star-filled" />);
    } else if (i - 0.5 <= numericRating) {
      stars.push(<FaStarHalfAlt key={i} className="star-filled" />);
    } else {
      stars.push(<FaRegStar key={i} className="star-empty" />);
    }
  }
  return (
    <div className="star-rating-container">
      <div className="stars-row">{stars}</div>
      {totalReviews !== undefined && <span className="review-count">({totalReviews} Reviews)</span>}
    </div>
  );
};

const ProductPageClient = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // --- UI & DATA STATES ---
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviewForm, setReviewForm] = useState({ userName: "", rating: 5, comment: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, msg: "" });
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [mounted, setMounted] = useState(false);

  // --- DERIVED DATA ---
  const displayPrice = product?.onSale ? parseFloat(product?.salePrice) : parseFloat(product?.price);
  const subtotal = (displayPrice * quantity).toFixed(2);

  // Calculate Average Rating dynamically
  const averageRating = useMemo(() => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, rev) => acc + (rev.rating || 0), 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  const images = useMemo(() => {
    const list = [product?.mainImage, product?.hoverImage, ...(product?.smallImages || [])];
    return list.filter(img => img && typeof img === 'string' && img.trim() !== "");
  }, [product]);

  const getAvatarColor = (name) => {
    const colors = ['#2c3e50', '#c0392b', '#27ae60', '#2980b9', '#8e44ad', '#f39c12', '#16a085'];
    return colors[name ? name.length % colors.length : 0];
  };

  useEffect(() => {
    setMounted(true);
    if (product?._id) {
      // Load Reviews
      fetch(`/api/reviews?productId=${product._id}`)
        .then(res => res.json())
        .then(data => setReviews(Array.isArray(data) ? data : []))
        .catch(() => setReviews([]));

      // Load Related Products (Safety check for array)
      fetch(`/api/products?type=${product.productType}&limit=5`)
        .then(res => res.json())
        .then(data => {
          const dataArray = Array.isArray(data) ? data : (data.products || []);
          const filtered = dataArray.filter(p => p._id !== product._id);
          setRelatedProducts(filtered.slice(0, 4));
        })
        .catch(() => setRelatedProducts([]));

      // Check Wishlist Status
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setIsWishlisted(wishlist.includes(product._id));
    }
  }, [product?._id, product?.productType]);

  const triggerNotify = (msg) => {
    setNotification({ show: true, msg });
    setTimeout(() => setNotification({ show: false, msg: "" }), 3000);
  };

  const handleWishlistToggle = () => {
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (wishlist.includes(product._id)) {
      wishlist = wishlist.filter(id => id !== product._id);
      setIsWishlisted(false);
      triggerNotify("Removed from Wishlist");
    } else {
      wishlist.push(product._id);
      setIsWishlisted(true);
      triggerNotify("Added to Wishlist");
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  };

  const handleAddToCart = () => {
    const cartItem = { id: product._id, quantity: quantity };
    localStorage.setItem('lastPurchase', JSON.stringify(cartItem));

    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingIndex = cart.findIndex(item => item.id === product._id);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push(cartItem);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    triggerNotify("Stored in Armory!");
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...reviewForm, productId: product._id })
      });
      if (res.ok) {
        const newRev = await res.json();
        setReviews([newRev, ...reviews]);
        setReviewForm({ userName: "", rating: 5, comment: "" });
        triggerNotify("Review forged successfully!");
      }
    } catch (err) { triggerNotify("Failed to post"); }
    finally { setIsSubmitting(false); }
  };

  const currentUrl = mounted ? window.location.href : "";

  return (
    <main>
      <h6 className="product-title_main"> Home <span>&gt;</span> Product <span>&gt;</span> {product?.name}</h6>
      <section>
        <div className="product-page-wrapper container">

          {notification.show && (
            <div className="toast-box">
              <div className="toast-dot"></div>
              {notification.msg}
            </div>
          )}

          {isShareModalOpen && (
            <div className="share-overlay">
              <div className="share-card">
                <button className="close-btn" onClick={() => setIsShareModalOpen(false)}>
                  <IoCloseOutline size={28} />
                </button>
                <h3>Share this Blade</h3>
                <p>Let other warriors see this craft.</p>
                <div className="copy-link-box">
                  <input readOnly value={currentUrl} />
                  <button className="copy-trigger" onClick={() => {
                    navigator.clipboard.writeText(currentUrl);
                    triggerNotify("Link Copied!");
                  }}>
                    <FaRegCopy color="white" size={18} />
                  </button>
                </div>
                <div className="social-icons">
                  <a href="#"><FaFacebookF /></a>
                  <a href="#"><FaXTwitter /></a>
                  <a href="#"><FaPinterestP /></a>
                  <a href="#"><MdOutlineEmail size={24} /></a>
                </div>
              </div>
            </div>
          )}

          <div className="main-grid">
            <div className="gallery-section">
              <div className="thumb-list">
                {images.map((img, idx) => (
                  <img
                    key={idx} src={img} alt="thumb"
                    className={currentImageIndex === idx ? 'active' : ''}
                    onClick={() => setCurrentImageIndex(idx)}
                  />
                ))}
              </div>
              <div className="image-stage">
                <img src={images[currentImageIndex]} alt="product" />
                {product?.onSale && <span className="sale-badge">SALE</span>}
              </div>
            </div>

            <div className="info-section">
              <h1 className="product-title">{product?.name}</h1>

              {/* STAR RATING PLACE IN MAIN DETAIL */}
              <div className="main-star-row">
                <StarRating rating={averageRating} totalReviews={reviews.length} />
              </div>

              <div className="meta-data">
                <div><strong>Vendor:</strong> {product?.vendor}</div>
                <div><strong>Availability:</strong> <span className="stock-count">{product?.stock} In stock</span></div>
                <div><strong>Product type:</strong> {product?.productType}s</div>
              </div>

              <div
                className="desc-preview"
               
              />

              <div className="fire-alert"><FaFire /> {product?.recentSales} warriors looking now</div>

              <div className="pricing">
                {product?.onSale && <span className="old">${product?.price}</span>}
                <span className="current">${displayPrice}</span>
              </div>

              <div className="purchase-box">
                <div className="qty-row">
                  <div className="selector">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}><FaMinus size={12} /></button>
                    <span>{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(product?.stock || 99, quantity + 1))}><FaPlus size={12} /></button>
                  </div>
                  <div className="subtotal">Subtotal: <span>${subtotal}</span></div>
                </div>

                <div className="main-actions">
                  <button className="buy-btn" onClick={handleAddToCart}>ADD TO ARMORY</button>
                  <button className="icon-btn" onClick={handleWishlistToggle}>
                    <FaHeart color={isWishlisted ? 'red' : '#ccc'} />
                  </button>
                  <button className="icon-btn" onClick={() => setIsShareModalOpen(true)}><FaShareAlt /></button>
                </div>
              </div>

              <div className="specs-brief">
                <div className="spec-item"><FaDharmachakra /> <span>{product?.bladeMaterial}</span></div>
                <div className="spec-item"><FaRulerCombined /> <span>{product?.overallLength} Total</span></div>
                <div className="spec-item"><FaWeightHanging /> <span>{product?.weight}</span></div>
                <div className="spec-item"><FaDraftingCompass /> <span>{product?.handleMaterial}</span></div>
              </div>
            </div>
          </div>

          <div className="tabs-section">
           <div className="overflow">
             <div className="tab-nav">
              <button onClick={() => setActiveTab('description')} className={activeTab === 'description' ? 'tab-trigger active' : 'tab-trigger'}>The Forge Story</button>
              <button onClick={() => setActiveTab('shipping')} className={activeTab === 'shipping' ? 'tab-trigger active' : 'tab-trigger'}>Shipping & Returns</button>
              <button onClick={() => setActiveTab('reviews')} className={activeTab === 'reviews' ? 'tab-trigger active' : 'tab-trigger'}>Warrior Reviews ({reviews.length})</button>
            </div>
           </div>

            <div className="tab-content">
              {activeTab === 'description' && (
                <div className="description-content">
                  <div className='pos' dangerouslySetInnerHTML={{ __html: product?.description }} />
                  <div className="boxer">
                    <h4>Technical Specifications</h4>
                    <div className="spec-row"><span>Blade Length</span><strong>{product?.bladeLength}</strong></div>
                    <div className="spec-row"><span>Material</span><strong>{product?.bladeMaterial}</strong></div>
                    <div className="spec-row"><span>Handle</span><strong>{product?.handleMaterial}</strong></div>
                    <div className="spec-row"><span>Total Weight</span><strong>{product?.weight}</strong></div>
                  </div>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="shipping-grid">
                  <div className="ship-card">
                    <FaTruck size={40} className="ship-icon" />
                    <h4>Global Expedited</h4>
                    <p>Tracked delivery to all major realms within 7-12 business days.</p>
                  </div>
                  <div className="ship-card">
                    <FaUndoAlt size={40} className="ship-icon" />
                    <h4>Warrior's Refund</h4>
                    <p>If the steel doesn't suit your spirit, return within 30 days for a full exchange.</p>
                  </div>
                  <div className="ship-card">
                    <FaShieldAlt size={40} className="ship-icon" />
                    <h4>Reinforced Transit</h4>
                    <p>Shipped in specialized heavy-duty armory packaging.</p>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="review-container">
                  <form onSubmit={handleReviewSubmit} className="review-form">
                    <h3>Forge a Review</h3>
                    <input
                      placeholder="Your Warrior Name"
                      required
                      value={reviewForm.userName}
                      onChange={e => setReviewForm({ ...reviewForm, userName: e.target.value })}
                    />
                    <div className="star-input">
                      {[1, 2, 3, 4, 5].map(s => (
                        <FaStar key={s} size={26} color={(hoverRating || reviewForm.rating) >= s ? '#f1c40f' : '#ddd'}
                          onMouseEnter={() => setHoverRating(s)} onMouseLeave={() => setHoverRating(0)} onClick={() => setReviewForm({ ...reviewForm, rating: s })} />
                      ))}
                    </div>
                    <textarea
                      placeholder="Your experience with the craft..."
                      value={reviewForm.comment}
                      onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    />
                    <button type="submit" className="buy-btn action-post" disabled={isSubmitting}>POST REVIEW</button>
                  </form>
                  <div className="reviews">
                    {reviews.map((rev, i) => (
                      <div key={i} className="review-item">
                        <div className="avatar" style={{ background: getAvatarColor(rev.userName) }}>{rev.userName?.charAt(0).toUpperCase()}</div>
                        <div className="content">
                          <div className="head">
                            <strong>{rev.userName}</strong>
                            <div className="stars">
                              {[...Array(rev.rating)].map((_, j) => <FaStar key={j} color="#f1c40f" />)}
                            </div>
                          </div>
                          <p>{rev.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RELATED PRODUCTS SECTION */}
          {/* {relatedProducts.length > 0 && (
            <div className="related-section">
              <h2 className="section-title">Related Armory Pieces</h2>
              <div className="related-grid">
                {relatedProducts.map((relProd) => (
                  <div key={relProd._id} className="home-product-card">
                    <div className="card-image">
                      <img src={relProd.mainImage} alt={relProd.name} className="primary-img" />
                      {relProd.hoverImage && <img src={relProd.hoverImage} alt={relProd.name} className="secondary-img" />}
                      {relProd.onSale && <span className="card-sale-tag">SALE</span>}
                    </div>
                    <div className="card-info">
                      <h3 className="card-name">{relProd.name}</h3>

                      
                      <div className="card-rating">
                        <StarRating rating={relProd.rating || 5} />
                      </div>

                      <div className="card-pricing">
                        {relProd.onSale && <span className="card-old-price">${relProd.price}</span>}
                        <span className="card-current-price">${relProd.onSale ? relProd.salePrice : relProd.price}</span>
                      </div>
                      <a href={`/product/${relProd.slug}`} className="view-product-link">VIEW BLADE</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )} 
          */}

        </div>
      </section>
    </main>
  );
};

export default ProductPageClient;