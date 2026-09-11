import React, { useMemo, useState } from 'react';

type ProductCategory = 'Vehicles' | 'Accessories';

type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  type: string;
  price: number;
  image: string;
  description: string;
  specs: string;
  badge?: string;
};

const products: Product[] = [
  {
    id: 'model-3',
    name: 'Model 3',
    category: 'Vehicles',
    type: 'Sedan',
    price: 38990,
    image: '/products/Model 3.avif',
    description: 'The electric sedan for every day.',
    specs: '272 mi range · 0-60 mph in 4.1 sec',
    badge: 'Best seller',
  },
  {
    id: 'model-y',
    name: 'Model Y',
    category: 'Vehicles',
    type: 'SUV',
    price: 44990,
    image: '/products/Model Y.avif',
    description: 'Room for your ideas and everything else.',
    specs: '320 mi range · 5 seats · AWD available',
    badge: 'Most versatile',
  },
  {
    id: 'model-s',
    name: 'Model S',
    category: 'Vehicles',
    type: 'Sedan',
    price: 74990,
    image: '/products/Model s.avif',
    description: 'Long-range performance, redefined.',
    specs: '405 mi range · 0-60 mph in 3.1 sec',
    badge: 'Performance',
  },
  {
    id: 'model-x',
    name: 'Model X',
    category: 'Vehicles',
    type: 'SUV',
    price: 79990,
    image: '/products/Model X.avif',
    description: 'Maximum utility with falcon-wing doors.',
    specs: '348 mi range · Up to 7 seats · AWD',
  },
  {
    id: 'cybertruck',
    name: 'Cybertruck',
    category: 'Vehicles',
    type: 'Truck',
    price: 60990,
    image: '/products/The truck.avif',
    description: 'Tough, capable, and undeniably different.',
    specs: '340 mi range · 11,000 lb towing · AWD',
    badge: 'New arrival',
  },
  {
    id: 'wall-connector',
    name: 'Wall Connector',
    category: 'Accessories',
    type: 'Charging',
    price: 475,
    image: '/products/Home-charger.avif',
    description: 'Convenient overnight charging at home.',
    specs: 'Up to 44 mi of range per hour',
    badge: 'Home essential',
  },
];

const formatPrice = (value: number) => `$${value.toLocaleString('en-US')}`;
const calculateMonthlyPayment = (price: number) => {
  const monthlyRate = 0.0699 / 12;
  const term = 72;
  return Math.round((price * monthlyRate) / (1 - (1 + monthlyRate) ** -term));
};
const managerEmail = 'sales@tesla-direct.com';
const managerWhatsapp = '14155550148';
const giveawayUrl = '/giveaway';

function App() {
  const [activeCategory, setActiveCategory] = useState<'All' | ProductCategory>('All');
  const [activeType, setActiveType] = useState('All');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactMode, setContactMode] = useState<'general' | 'product' | 'shortlist'>('general');
  const [activeHeroIndex, setActiveHeroIndex] = useState(1);

  const filteredProducts = useMemo(
    () => products.filter((product) =>
      (activeCategory === 'All' || product.category === activeCategory) &&
      (activeType === 'All' || product.type === activeType),
    ),
    [activeCategory, activeType],
  );

  const cartItems = products.filter((product) => cart[product.id]);
  const cartCount = Object.values(cart).reduce((total, count) => total + count, 0);
  const cartTotal = cartItems.reduce((total, product) => total + product.price * cart[product.id], 0);
  const shortlistMessage = cartItems.map((product) => `${product.name} x${cart[product.id]} (${formatPrice(product.price)} each)`).join(', ');
  const contactMessage = contactMode === 'product' && selectedProduct
    ? `Hello, I am interested in the ${selectedProduct.name} (${formatPrice(selectedProduct.price)}). Please share payment and delivery details.`
    : contactMode === 'shortlist' && shortlistMessage
      ? `Hello, I am shopping for: ${shortlistMessage}. Please share payment and delivery details.`
      : 'Hello, I would like to speak with a manager about Tesla vehicles or accessories.';
  const contactSubject = contactMode === 'product' && selectedProduct
    ? `Tesla ${selectedProduct.name} inquiry`
    : contactMode === 'shortlist'
      ? 'Tesla shortlist inquiry'
      : 'Tesla sales inquiry';
  const emailHref = `mailto:${managerEmail}?subject=${encodeURIComponent(contactSubject)}&body=${encodeURIComponent(contactMessage)}`;
  const whatsappHref = `https://wa.me/${managerWhatsapp}?text=${encodeURIComponent(contactMessage)}`;
  const heroSlides = products.filter((product) => product.category === 'Vehicles');
  const heroProduct = heroSlides[activeHeroIndex];

  const addToCart = (product: Product) => {
    setCart((current) => ({ ...current, [product.id]: (current[product.id] || 0) + 1 }));
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, change: number) => {
    setCart((current) => {
      const nextQuantity = (current[productId] || 0) + change;
      const next = { ...current };
      if (nextQuantity <= 0) delete next[productId];
      else next[productId] = nextQuantity;
      return next;
    });
  };

  const openContact = (product?: Product, mode: 'general' | 'product' | 'shortlist' = product ? 'product' : 'general') => {
    setSelectedProduct(product || null);
    setContactMode(mode);
    setIsCartOpen(false);
    setIsContactOpen(true);
  };

  const resetFilters = () => {
    setActiveCategory('All');
    setActiveType('All');
  };

  const moveHero = (direction: number) => {
    setActiveHeroIndex((current) => (current + direction + heroSlides.length) % heroSlides.length);
  };

  const renderProductCard = (product: Product, paymentMode: 'full' | 'installment') => (
    <article className="product-card" key={`${paymentMode}-${product.id}`}>
      <button className="product-image" onClick={() => setSelectedProduct(product)} aria-label={`View ${product.name} details`}>
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <img src={product.image} alt={product.name} loading="lazy" />
        <span className="view-detail">View details ↗</span>
      </button>
      <div className="product-info">
        <div className="product-topline"><p>{product.category} / {product.type}</p><strong>{paymentMode === 'full' ? formatPrice(product.price) : `${formatPrice(calculateMonthlyPayment(product.price))}/mo`}</strong></div>
        <h3>{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <p className="product-specs">{product.specs}</p>
        {paymentMode === 'installment' && <p className="payment-note">Est. 72 months · 6.99% APR</p>}
        <div className="product-actions"><button className="button button-small" onClick={() => addToCart(product)}>Add to shortlist</button><button className="icon-button" onClick={() => openContact(product)} aria-label={`Contact manager about ${product.name}`}>↗</button></div>
      </div>
    </article>
  );

  return (
    <div className="site-shell">
      <div className="announcement">Order online today · A Tesla manager will coordinate payment and delivery with you</div>
      <header className="site-header">
        <a className="logo-lockup" href="#top" aria-label="Tesla Direct Sales home">
          <svg className="logo-svg" viewBox="0 0 342 35" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M0 .1a9.7 9.7 0 0 0 7 7h11l.5.1v27.6h6.8V7.3L26 7h11a9.8 9.8 0 0 0 7-7H0zm238.6 0h-6.8v34.8H263a9.7 9.7 0 0 0 6-6.8h-30.3V0zm-52.3 6.8c3.6-1 6.6-3.8 7.4-6.9l-38.1.1v20.6h31.1v7.2h-24.4a13.6 13.6 0 0 0-8.7 7h39.9v-21h-31.2v-7zm116.2 28h6.7v-14h24.6v14h6.7v-21h-38zM85.3 7h26a9.6 9.6 0 0 0 7.1-7H78.3a9.6 9.6 0 0 0 7 7m0 13.8h26a9.6 9.6 0 0 0 7.1-7H78.3a9.6 9.6 0 0 0 7 7m0 14.1h26a9.6 9.6 0 0 0 7.1-7H78.3a9.6 9.6 0 0 0 7 7M308.5 7h26a9.6 9.6 0 0 0 7-7h-40a9.6 9.6 0 0 0 7 7"></path>
          </svg>
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          <a href="#inventory">Inventory</a>
          <a href="#accessories">Accessories</a>
          <a href="#process">How it works</a>
        </nav>
        <div className="header-actions">
          <a className="giveaway-top-link" href={giveawayUrl}>GIVEAWAY ↗</a>
          <button className="manager-link" onClick={() => openContact()}>Talk to a manager</button>
          <button className="cart-button" onClick={() => setIsCartOpen(true)} aria-label={`Open cart with ${cartCount} items`}>
            Cart <span>{cartCount}</span>
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow">Tesla direct</p>
            <h1>Move<br /><em>beautifully.</em></h1>
            <p className="hero-lede">Explore the current Tesla lineup. Choose your model, build your shortlist, and let a dedicated manager handle the details from payment to delivery.</p>
            <div className="hero-actions">
              <a className="button button-dark" href="#inventory">Shop vehicles <span>↓</span></a>
              <button className="text-button" onClick={() => openContact()}>Speak with a manager <span>↗</span></button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-stamp">ELECTRIC<br /><strong>BY DESIGN</strong></div>
            <img key={heroProduct.id} src={heroProduct.image} alt={`Tesla ${heroProduct.name}`} />
            <div className="hero-caption"><span>{heroProduct.name} · {heroProduct.type}</span></div>
            <div className="hero-controls" aria-label="Hero vehicle carousel controls">
              <button onClick={() => moveHero(-1)} aria-label="Previous vehicle">←</button>
              <button onClick={() => moveHero(1)} aria-label="Next vehicle">→</button>
            </div>
          </div>
        </section>

        <section className="trust-strip" aria-label="Shopping benefits">
          <div><strong>01</strong><span>Current lineup</span></div>
          <div><strong>02</strong><span>Transparent pricing</span></div>
          <div><strong>03</strong><span>Personal delivery support</span></div>
          <div><strong>04</strong><span>Real people, no checkout maze</span></div>
        </section>

        <section className="giveaway-section" id="giveaway">
          <div className="giveaway-section-copy">
            <p className="eyebrow">A little extra energy</p>
            <h2>Take the next<br /><em>chance.</em></h2>
            <p>Explore the dedicated giveaway experience for the latest event updates, eligibility details, and entry information.</p>
            <a className="button button-dark" href={giveawayUrl}>Visit the giveaway <span>↗</span></a>
          </div>
          <div className="giveaway-section-mark" aria-hidden="true"><span>TESLA</span><strong>GIVEAWAY</strong><small>Explore the experience</small></div>
        </section>

        <section className="inventory-section" id="inventory">
          <div className="section-heading">
            <div><p className="eyebrow">The collection</p><h2>Find your Tesla.</h2></div>
            <p className="section-note">Choose the way you want to move forward. Every order is finalized with a dedicated manager.</p>
          </div>
          <div className="catalog-toolbar">
            <div className="filter-group" role="group" aria-label="Filter by category">
              {(['All', 'Vehicles', 'Accessories'] as const).map((category) => (
                <button key={category} className={activeCategory === category ? 'filter active' : 'filter'} onClick={() => { setActiveCategory(category); setActiveType('All'); }}>{category}</button>
              ))}
            </div>
            <label className="select-wrap">Type
              <select value={activeType} onChange={(event) => setActiveType(event.target.value)}>
                <option value="All">All types</option>
                <option value="Sedan">Sedans</option>
                <option value="SUV">SUVs</option>
                <option value="Truck">Trucks</option>
                <option value="Charging">Charging</option>
              </select>
            </label>
          </div>
          <div className="payment-section payment-installments">
            <div className="payment-heading"><div><p className="eyebrow">Pay monthly</p><h3>Spread the drive.</h3></div><p>Estimated vehicle payments over 72 months at 6.99% APR. Your manager will confirm available terms and eligibility.</p></div>
            <div className="product-grid">{filteredProducts.filter((product) => product.category === 'Vehicles').map((product) => renderProductCard(product, 'installment'))}</div>
          </div>
          {filteredProducts.length === 0 && <div className="empty-state"><p>No products match those filters.</p><button className="text-button" onClick={resetFilters}>Reset filters ↗</button></div>}
        </section>

        <section className="feature-section" id="accessories">
          <div className="feature-image"><img src="/products/Home-charger.avif" alt="Tesla Wall Connector mounted at home" loading="lazy" /></div>
          <div className="feature-copy"><p className="eyebrow">Complete the setup</p><h2>Charge at home.<br /><em>Wake up ready.</em></h2><p>Bring the Tesla experience home with the Wall Connector. Add accessories to your shortlist and your manager will help coordinate fit, installation, and delivery.</p><button className="button button-dark" onClick={() => addToCart(products.find((product) => product.id === 'wall-connector')!)}>Add Wall Connector <span>+</span></button></div>
        </section>

        <section className="full-payment-section">
          <div className="payment-section payment-full">
            <div className="payment-heading"><div><p className="eyebrow">Pay in full</p><h2>Own it outright.</h2></div><p>See the full vehicle or accessory price upfront. Payment and delivery are arranged securely with your manager.</p></div>
            <div className="product-grid">{filteredProducts.map((product) => renderProductCard(product, 'full'))}</div>
          </div>
        </section>

        <section className="process-section" id="process">
          <div className="section-heading"><div><p className="eyebrow">Simple by design</p><h2>Your next move.</h2></div><p className="section-note">Shopping is easy. The final details are personal.</p></div>
          <div className="process-grid"><div><span>01</span><h3>Shortlist</h3><p>Add vehicles and accessories you want to discuss.</p></div><div><span>02</span><h3>Connect</h3><p>Share your contact details and a Tesla manager will reply.</p></div><div><span>03</span><h3>Drive home</h3><p>Confirm payment, delivery timing, and next steps together.</p></div></div>
        </section>
      </main>

      <footer className="site-footer"><div className="footer-logo" aria-label="Tesla"> <svg className="logo-svg" viewBox="0 0 342 35" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M0 .1a9.7 9.7 0 0 0 7 7h11l.5.1v27.6h6.8V7.3L26 7h11a9.8 9.8 0 0 0 7-7H0zm238.6 0h-6.8v34.8H263a9.7 9.7 0 0 0 6-6.8h-30.3V0zm-52.3 6.8c3.6-1 6.6-3.8 7.4-6.9l-38.1.1v20.6h31.1v7.2h-24.4a13.6 13.6 0 0 0-8.7 7h39.9v-21h-31.2v-7zm116.2 28h6.7v-14h24.6v14h6.7v-21h-38zM85.3 7h26a9.6 9.6 0 0 0 7.1-7H78.3a9.6 9.6 0 0 0 7 7m0 13.8h26a9.6 9.6 0 0 0 7.1-7H78.3a9.6 9.6 0 0 0 7 7m0 14.1h26a9.6 9.6 0 0 0 7.1-7H78.3a9.6 9.6 0 0 0 7 7M308.5 7h26a9.6 9.6 0 0 0 7-7h-40a9.6 9.6 0 0 0 7 7"></path></svg></div><p>Electric vehicles and energy products, made for the road ahead.</p><div className="footer-actions"><a className="giveaway-link" href={giveawayUrl}>Enter the Tesla giveaway ↗</a><button className="text-button light" onClick={() => openContact()}>Contact a manager ↗</button></div><small>© 2026 Tesla direct sales portal · Prices shown in USD</small></footer>

      {isCartOpen && <div className="overlay" onClick={() => setIsCartOpen(false)}><aside className="side-drawer" onClick={(event) => event.stopPropagation()}><div className="drawer-header"><div><p className="eyebrow">Your shortlist</p><h2>{cartCount} item{cartCount === 1 ? '' : 's'}</h2></div><button className="close-button" onClick={() => setIsCartOpen(false)} aria-label="Close shortlist">×</button></div>{cartItems.length === 0 ? <div className="drawer-empty"><p>Your shortlist is empty.</p><button className="button button-dark" onClick={() => setIsCartOpen(false)}>Browse the collection</button></div> : <><div className="drawer-items">{cartItems.map((product) => <div className="drawer-item" key={product.id}><img src={product.image} alt="" /><div><h3>{product.name}</h3><p>{formatPrice(product.price)}</p><div className="quantity"><button onClick={() => updateQuantity(product.id, -1)} aria-label="Decrease quantity">−</button><span>{cart[product.id]}</span><button onClick={() => updateQuantity(product.id, 1)} aria-label="Increase quantity">+</button></div></div></div>)}</div><div className="drawer-footer"><div><span>Estimated total</span><strong>{formatPrice(cartTotal)}</strong></div><p>Final pricing, payment, and delivery are confirmed directly with your manager.</p><button className="button button-dark full-width" onClick={() => openContact(undefined, 'shortlist')}>Contact manager about my shortlist ↗</button></div></>}</aside></div>}

      {selectedProduct && <div className="modal-backdrop" onClick={() => setSelectedProduct(null)}><div className="product-modal" onClick={(event) => event.stopPropagation()}><button className="close-button" onClick={() => setSelectedProduct(null)} aria-label="Close product details">×</button><img src={selectedProduct.image} alt={selectedProduct.name} /><div className="modal-copy"><p className="eyebrow">{selectedProduct.category} / {selectedProduct.type}</p><h2>{selectedProduct.name}</h2><p>{selectedProduct.description}</p><strong className="modal-price">{formatPrice(selectedProduct.price)}</strong><p className="product-specs">{selectedProduct.specs}</p><div className="modal-actions"><button className="button button-dark" onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}>Add to shortlist</button><button className="text-button" onClick={() => openContact(selectedProduct)}>Ask a manager ↗</button></div></div></div></div>}

      {isContactOpen && <div className="modal-backdrop" onClick={() => setIsContactOpen(false)}><div className="contact-modal" onClick={(event) => event.stopPropagation()}><button className="close-button" onClick={() => setIsContactOpen(false)} aria-label="Close contact options">×</button><p className="eyebrow">Personal support</p><h2>Let’s get you moving.</h2><p className="modal-intro">Choose the channel you prefer. A Tesla manager will help confirm availability, payment, and delivery details securely.</p><div className="contact-options"><a className="contact-channel" href={emailHref}><span className="contact-channel-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M3 5.5h18v13H3zM4 6.5l8 6 8-6M4 17.5l5-5m11 5-5-5" /></svg></span><span><strong>Email a manager</strong><small>Send a private message</small></span><b aria-hidden="true">↗</b></a><a className="contact-channel whatsapp" href={whatsappHref} target="_blank" rel="noreferrer"><span className="contact-channel-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 3.5a8.5 8.5 0 0 0-7.2 13.1L3.5 20.5l4-1.2A8.5 8.5 0 1 0 12 3.5Z" /><path d="M8.7 8.8c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.7 1.6c.1.2.1.4-.1.6l-.5.6c.5 1 1.3 1.8 2.3 2.3l.6-.5c.2-.2.4-.2.6-.1l1.6.7c.3.1.4.3.4.5v.5c0 .3 0 .5-.4.7-.4.2-1 .3-1.5.1-2.8-.7-4.9-2.8-5.6-5.6-.2-.6-.1-1.1.2-1.4Z" /></svg></span><span><strong>Chat on WhatsApp</strong><small>Open a direct conversation</small></span><b aria-hidden="true">↗</b></a></div><p className="contact-context">{selectedProduct ? `Your message will mention the ${selectedProduct.name}.` : 'You can include a vehicle, accessory, or shortlist in your message.'}</p></div></div>}
    </div>
  );
}

export default App;
