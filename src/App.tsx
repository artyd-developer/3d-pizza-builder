import { useEffect, useRef, useState, type ReactNode } from 'react';
import { PizzaEngine } from './engine/PizzaEngine';
import { PizzaModel, type IngredientType, type Quarter } from './engine/PizzaModel';

const ingredientTypes: IngredientType[] = ['pepperoni', 'mushroom', 'pineapple', 'olives', 'jalapeno', 'bacon'];
const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;
const quarterNames = ['Front right', 'Front left', 'Back left', 'Back right'];
const descriptions: Record<IngredientType, string> = {
  pepperoni: 'Smoky & savory',
  mushroom: 'Earthy & savory',
  pineapple: 'Bright & sweet',
  olives: 'Rich & savory',
  jalapeno: 'Fresh & spicy',
  bacon: 'Smoky & crisp',
};

const popularPizzas = [
  { name: 'Supreme pizza', detail: 'Large Original Pan®', image: asset('brand/popular-supreme.png'), recipe: ['pepperoni', 'mushroom'] },
  { name: "Meat Lover's® pizza", detail: 'Large Original Pan®', image: asset('brand/popular-meat-lovers.png'), recipe: ['pepperoni', 'bacon'] },
  { name: 'Lava pizza', detail: 'Large hand tossed', image: asset('brand/popular-cheese.png'), recipe: ['pineapple', 'jalapeno'] },
  { name: 'Pepperoni pizza', detail: 'Large hand tossed', image: asset('brand/popular-pepperoni.png'), recipe: ['pepperoni'] },
];

function IngredientPreview({ type }: { type: IngredientType }) {
  const [failed, setFailed] = useState(false);
  const fallback = { pepperoni: '', mushroom: '🍄', pineapple: '🍍', olives: '🫒', jalapeno: '🌶️', bacon: '🥓' }[type];
  return failed ? <span className={`ingredient-preview-fallback ${type === 'pepperoni' ? 'pepperoni-preview-fallback' : ''}`} aria-hidden="true">{fallback}</span>
    : <img src={asset(`ingredients/${type}.png`)} alt="" onError={() => setFailed(true)} />;
}

function VisualButton({ className = '', children, label }: { className?: string; children: ReactNode; label?: string }) {
  return <button type="button" className={`visual-only ${className}`} disabled aria-disabled="true" aria-label={label}>{children}</button>;
}

export default function App() {
  const [model] = useState(() => new PizzaModel());
  const [snapshot, setSnapshot] = useState(() => model.getSnapshot());
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<PizzaEngine | null>(null);
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => model.subscribe(setSnapshot), [model]);
  useEffect(() => {
    if (!canvasRef.current) return;
    try {
      const engine = new PizzaEngine(canvasRef.current, model, setError);
      engineRef.current = engine;
      let cancelled = false;
      const pageImages = ['brand/logo.png', 'brand/cook.png', 'brand/hand.png', ...popularPizzas.map((pizza) => pizza.image.slice(import.meta.env.BASE_URL.length))];
      const imageReady = Promise.all(pageImages.map((path) => new Promise<void>((resolve) => {
        const image = new Image(); image.onload = () => resolve(); image.onerror = () => resolve(); image.src = asset(path);
      })));
      void Promise.all([engine.ready, imageReady]).then(() => {
        if (cancelled || model.ingredients.length) return;
        const recipes = Array.from({ length: 4 }, () => {
          const choices = [...ingredientTypes];
          for (let index = choices.length - 1; index > 0; index--) {
            const other = Math.floor(Math.random() * (index + 1));
            [choices[index], choices[other]] = [choices[other], choices[index]];
          }
          return choices.slice(0, Math.random() < 0.5 ? 1 : 2);
        });
        engine.applyRecipes(recipes, 'Choose a quarter to customize your pizza.');
        setReady(true);
      });
      return () => { cancelled = true; engineRef.current = null; engine.destroy(); };
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to start the pizza renderer.');
    }
  }, [model]);

  const addIngredient = (type: IngredientType) => { if (ready) engineRef.current?.addIngredient(type); };
  const chosenQuarter = snapshot.selectedQuarter;
  const activeTypes = chosenQuarter === null ? [] : snapshot.recipes[chosenQuarter];

  return (
    <div className="app">
      <header className="site-header">
        <div className="header-inner">
          <img className="header-logo" src={asset('brand/logo.png')} alt="PizzaBomb" />
          <nav className="desktop-nav" aria-label="PizzaBomb navigation preview">
            <VisualButton>Deals</VisualButton>
            <VisualButton>Special Offers </VisualButton>
            <VisualButton>Partnership</VisualButton>
            <VisualButton>Locations</VisualButton>
          </nav>
          <div className="desktop-account">
            <VisualButton className="account-button" label="Sign in preview"><span className="person-icon" aria-hidden="true" /> Sign In</VisualButton>
            <VisualButton className="cart-button" label="Cart preview"><span className="cart-icon" aria-hidden="true">🛒</span><span className="cart-count">0</span><strong>$0.00</strong></VisualButton>
          </div>
          <VisualButton className="mobile-menu" label="Menu preview"><span /><span /><span /></VisualButton>
        </div>
      </header>

      <main className="page-layout">
        <h1 className="sr-only">PizzaBomb pizza builder</h1>

        <section className="chef-feature" aria-label="Chef holding the interactive pizza">
          <div className="chef-stage">
            <img className="chef-image" src={asset('brand/cook.png')} alt="PizzaBomb chef" />
            <div className="pizza-window">
              <canvas ref={canvasRef} className="pizza-canvas" aria-label="Interactive pizza; tap a quarter to select it" />
            </div>
            <img className="chef-hand" src={asset('brand/hand.png')} alt="" aria-hidden="true" />
          </div>
        </section>

        <section className="hero-brand" aria-label="PizzaBomb brand">
          <img src={asset('brand/logo.png')} alt="PizzaBomb — Explode You Hunger!" />
        </section>

        <section className="popular-section" aria-labelledby="popular-title">
          <div className="section-title-row">
            <h2 id="popular-title">Popular pizzas</h2>
            <VisualButton className="pizza-menu-link">Pizza Menu <span aria-hidden="true">›</span></VisualButton>
          </div>
          <div className="popular-grid">
            {popularPizzas.map((pizza) => (
              <button type="button" className="popular-card" key={pizza.name} disabled={!ready}
                aria-label={`${pizza.name} preset`} onClick={() => engineRef.current?.applyRecipes(
                  Array.from({ length: 4 }, () => pizza.recipe as IngredientType[]), `${pizza.name} selected.`)}>
                <img src={pizza.image} alt="" />
                <span><strong>{pizza.name}</strong><small>{pizza.detail}</small></span>
                <b aria-hidden="true">›</b>
              </button>
            ))}
          </div>
        </section>

        <aside className="control-panel" aria-label="Pizza controls">
          <div className="panel-heading">
            <h2>Build your pizza <span className="burst-mark" aria-hidden="true">◢</span></h2>
          </div>

          <div className="control-section edit-section">
            <div className="section-heading"><span className="step-number">01</span><div><h3>Create your bomb</h3><p>Start with a fresh cheese pizza.</p></div></div>
            <div className="edit-grid"><button type="button" disabled={!ready} onClick={() => engineRef.current?.clear()}>🍕 Create my bomb </button></div>
          </div>

          <div className="control-section quarter-section">
            <div className="section-heading"><span className="step-number">02</span><div><h3>Choose a quarter</h3><p>Pick the pizza quarter to customize.</p></div></div>
            <div className="quarter-grid" role="group" aria-label="Select pizza quarter">
              {([0, 1, 2, 3] as Quarter[]).map((quarter) =>
                <button key={quarter} type="button" className={`quarter-button ${chosenQuarter === quarter ? 'is-active' : ''}`}
                  aria-pressed={chosenQuarter === quarter} onClick={() => model.selectQuarter(quarter)}>
                  <strong>Q{quarter + 1}</strong><small>{quarterNames[quarter]}</small>
                </button>)}
            </div>
          </div>

          <div className="control-section ingredient-section">
            <div className="section-heading"><span className="step-number">03</span><div><h3>Choose ingredients</h3><p>Add toppings to the selected quarter.</p></div></div>
            <div className="ingredient-grid">
              {ingredientTypes.map((type) =>
                <button key={type} type="button" disabled={!ready} className={`ingredient-button ${activeTypes.includes(type) ? 'is-active' : ''}`}
                  aria-pressed={activeTypes.includes(type)} onClick={() => addIngredient(type)}>
                  <span className="ingredient-art"><IngredientPreview type={type} /></span>
                  <span className="ingredient-name">{type === 'jalapeno' ? 'Jalapeño' : type}</span><small>{descriptions[type]}</small>
                </button>)}
            </div>
          </div>

          {error && <p className="error-line" role="alert">{error}</p>}
        </aside>

        <section className="cta-section" aria-label="Build call to action preview">
          <VisualButton className="build-cta"><span aria-hidden="true">🍕</span> Order Your Pizza <b aria-hidden="true">›</b></VisualButton>
        </section>
      </main>
    </div>
  );
}
