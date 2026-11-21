import { StrictMode, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { ClipboardList, HardHat, Minus, Plus, Search, SlidersHorizontal, X, Zap } from "lucide-react";
import { categories, products, readQuote, rupees } from "./catalog";
import "./style.css";

function Brand() {
  return <a className="brand" href="#"><span className="brand-icon"><Zap size={22} fill="currentColor" /></span><span>VOLT<span className="amp"> & </span>BOLT<small>HARDWARE & ELECTRICAL</small></span></a>;
}

function App() {
  const [category, setCategory] = useState("All products");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [quote, setQuote] = useState(readQuote);
  const dialog = useRef<HTMLDialogElement>(null);
  const chosen = products.filter(({id}) => quote[id]);
  const count = chosen.reduce((sum, {id}) => sum + (quote[id] ?? 0), 0);
  const total = chosen.reduce((sum, {id, price}) => sum + price * (quote[id] ?? 0), 0);
  const results = products.filter(product => (category === "All products" || product.category === category) &&
    [product.name, product.detail, product.category].join(" ").toLowerCase().includes(query.trim().toLowerCase()));
  if (sort !== "featured") results.sort((a, b) => sort === "low" ? a.price - b.price : b.price - a.price);

  useEffect(() => {
    try { localStorage.setItem("volt-bolt-quote", JSON.stringify(quote)); } catch { /* Quote is still available in memory. */ }
  }, [quote]);

  function changeQuantity(id: string, delta: number) {
    setQuote(previous => {
      const next = { ...previous };
      const quantity = Math.min(999, (next[id] ?? 0) + delta);
      if (quantity > 0) next[id] = quantity;
      else delete next[id];
      return next;
    });
  }

  function downloadQuote() {
    const lines = chosen.map(({id, name, price}) => {
      const quantity = quote[id] ?? 0;
      return `${quantity} × ${name} — ${rupees.format(price * quantity)}`;
    });
    const content = ["Volt & Bolt — Demo quote request", "", ...lines, "", `Estimated total: ${rupees.format(total)}`, "Sample prices. Request prepared locally."].join("\n");
    const url = URL.createObjectURL(new Blob([content], {type:"text/plain;charset=utf-8"}));
    const link = document.createElement("a");
    link.href = url;
    link.download = "volt-bolt-quote-request.txt";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return <>
    <div className="topline"><div className="wrap top-inner"><span><Zap size={14} /> Hardware and electrical supplies</span><span>Demo storefront · Sample prices</span></div></div>
    <header className="wrap header">
      <Brand />
      <nav aria-label="Main navigation"><a href="#categories">Categories</a><a href="#catalog">Products</a><a href="#quote-help">Custom quotes</a></nav>
      <button className="quote-button" onClick={() => dialog.current?.showModal()}><ClipboardList size={19} /> My quote <span>{count}</span></button>
    </header>
    <main className="wrap">
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow"><span /> Hardware & electrical supply</p>
          <h1>Built for every<br/><em>fix & fitting.</em></h1>
          <p>Find the right hardware, lighting, fans and electrical essentials for your next home project.</p>
          <a className="primary" href="#catalog">Explore products</a>
        </div>
      </section>
      <section id="categories" className="categories">
        <h2>Shop by category</h2>
        <div className="category-grid">
          {categories.map(({name, icon: Icon}) => <a key={name} href="#catalog" className={category === name ? "active" : ""} onClick={() => {setCategory(name); setQuery("");}}><span><Icon size={25} strokeWidth={1.8}/></span>{name}</a>)}
        </div>
      </section>
      <section id="catalog" className="catalog">
        <div className="catalog-heading"><div><h2>Browse products</h2><p aria-live="polite">{results.length} {results.length === 1 ? "product" : "products"}</p></div>
          <label className="search"><Search size={20} /><input type="search" aria-label="Search catalog" placeholder="Search products…" value={query} onChange={event => {setCategory("All products"); setQuery(event.target.value);}} /></label>
        </div>
        <div className="filters">
          <div className="chips" aria-label="Filter products">{["All products", ...categories.map(({name}) => name)].map(name => <button key={name} aria-pressed={category === name} onClick={() => setCategory(name)}>{name}</button>)}</div>
          <label className="sort"><SlidersHorizontal size={16}/><select aria-label="Sort products" value={sort} onChange={event => setSort(event.target.value)}><option value="featured">Featured</option><option value="low">Price: Low to high</option><option value="high">Price: High to low</option></select></label>
        </div>
        {results.length ? <div className="product-grid">{results.map(product => <article className="product" key={product.id}>
          <div className="product-image"><img
  loading="lazy"
  src={`${import.meta.env.BASE_URL}${product.id}.webp`}
  alt={product.name}
/></div>
          <div className="product-content"><p className="product-category">{product.category}</p><h3>{product.name}</h3><p className="detail">{product.detail}</p>
          <div className="price-row"><strong>{rupees.format(product.price)}</strong><button aria-label={`Add ${product.name} to quote`} onClick={() => changeQuantity(product.id, 1)} disabled={quote[product.id] === 999}><Plus size={17}/>{quote[product.id] ? `Added (${quote[product.id]})` : "Add to quote"}</button></div></div>
        </article>)}</div> : <div className="empty"><h3>No matching products</h3><button className="primary" onClick={() => {setQuery("");setCategory("All products");}}>Show all products</button></div>}
      </section>
      <section id="quote-help" className="quote-help"><HardHat size={34}/><div><h2>Buying for a project?</h2><p>Build a list with quantities and download a quote request you can share.</p></div><button className="primary" onClick={() => dialog.current?.showModal()}>Review my quote</button></section>
    </main>
    <footer><div className="wrap footer-inner"><Brand/><span>Volt & Bolt · Demo storefront</span><a href="#catalog">Browse products</a></div></footer>
    <dialog ref={dialog} aria-labelledby="quote-title" onClick={event => {if (event.target === event.currentTarget) dialog.current?.close();}}>
      <section className="dialog-content"><div className="dialog-head"><h2 id="quote-title">My quote</h2><button className="icon-button" aria-label="Close quote" onClick={() => dialog.current?.close()}><X size={22}/></button></div>
      {chosen.length ? <>
        <ul className="quote-list">{chosen.map(({ id, name, price }) => <li key={id}><div><strong>{name}</strong><small>{rupees.format(price)} each</small></div><div className="stepper"><button aria-label={`Decrease quantity of ${name}`} onClick={() => changeQuantity(id, -1)}><Minus size={16}/></button><output aria-label={`Quantity of ${name}`}>{quote[id]}</output><button aria-label={`Increase quantity of ${name}`} onClick={() => changeQuantity(id, 1)} disabled={quote[id] === 999}><Plus size={16}/></button></div></li>)}</ul>
        <div className="quote-total"><span>Estimated total</span><strong>{rupees.format(total)}</strong></div>
        <p className="detail">Sample prices. Download the request to share it yourself.</p>
        <button className="primary" onClick={downloadQuote}>Download quote request</button>
      </> : <><p>Your quote is empty. Add products from the catalog to build a request.</p><a className="primary" href="#catalog" onClick={() => dialog.current?.close()}>Browse products</a></>}
      </section>
    </dialog>
  </>;
}

createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
