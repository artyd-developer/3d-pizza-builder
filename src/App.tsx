import { useEffect, useRef, useState } from 'react';
import { PizzaEngine } from './engine/PizzaEngine';
import { PizzaModel, type IngredientType, type Quarter } from './engine/PizzaModel';

const ingredientTypes: IngredientType[] = ['pepperoni', 'mushroom', 'pineapple'];
const quarterNames = ['Front right', 'Front left', 'Back left', 'Back right'];
const descriptions: Record<IngredientType, string> = {
  pepperoni: 'Smoky & savory',
  mushroom: 'Earthy & savory',
  pineapple: 'Bright & sweet',
};

function IngredientPreview({ type }: { type: IngredientType }) {
  const [failed, setFailed] = useState(false);
  const fallback = { pepperoni: '', mushroom: '🍄', pineapple: '🍍' }[type];
  return failed ? <span className={`ingredient-preview-fallback ${type === 'pepperoni' ? 'pepperoni-preview-fallback' : ''}`} aria-hidden="true">{fallback}</span>
    : <img src={`/ingredients/${type}.png`} alt="" onError={() => setFailed(true)} />;
}

export default function App() {
  const [model] = useState(() => new PizzaModel());
  const [snapshot, setSnapshot] = useState(() => model.getSnapshot());
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<PizzaEngine | null>(null);
  const [error, setError] = useState('');

  useEffect(() => model.subscribe(setSnapshot), [model]);
  useEffect(() => {
    if (!canvasRef.current) return;
    try {
      const engine = new PizzaEngine(canvasRef.current, model, setError);
      engineRef.current = engine;
      return () => { engineRef.current = null; engine.destroy(); };
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to start the pizza renderer.');
    }
  }, [model]);

  const addIngredient = (type: IngredientType) => engineRef.current?.addIngredient(type);
  const chosenQuarter = snapshot.selectedQuarter;
  return (
    <main className="app">
      <header className="masthead">
        <div className="brand"><span className="brand-mark" aria-hidden="true">P</span><span>PIZZA <strong>STUDIO</strong></span></div>
        <span className="masthead-note">THE LITTLE ART OF MAKING PIZZA</span>
      </header>

      <div className="intro">
        <div><p className="eyebrow">YOUR KITCHEN IS READY</p><h1>Make it your <em>masterpiece.</em></h1></div>
        <p className="intro-text">Choose a quarter, drop something delicious, and watch the cheese settle around every topping.</p>
      </div>

      <div className="workspace">
        <section className="scene-shell" aria-label="Pizza preview">
          <div className="scene-label"><span className="live-dot" /> LIVE FROM THE OVEN</div>
          <canvas ref={canvasRef} className="pizza-canvas" aria-label="Interactive pizza; tap a quarter to select it" />
          <div className="scene-bottom"><span>01 / CHOOSE A QUARTER</span><span>02 / ADD A TOPPING</span></div>
        </section>

        <aside className="control-panel" aria-label="Pizza controls">
          <div className="panel-heading"><div><p className="eyebrow">CREATE YOUR PIE</p><h2>Build your pizza</h2></div><span className="count-pill">{snapshot.ingredientCount} {snapshot.ingredientCount === 1 ? 'topping' : 'toppings'}</span></div>

          <div className="control-section">
            <div className="section-heading"><span className="step-number">01</span><div><h3>Pick your quarter</h3><p>Tap the pizza or choose below.</p></div></div>
            <div className="quarter-grid" role="group" aria-label="Select pizza quarter">
              {([0, 1, 2, 3] as Quarter[]).map((quarter) =>
                <button key={quarter} type="button" className={`quarter-button ${chosenQuarter === quarter ? 'is-active' : ''}`}
                  aria-pressed={chosenQuarter === quarter} onClick={() => model.selectQuarter(quarter)}>
                  <span>0{quarter + 1}</span><small>{quarterNames[quarter]}</small>
                </button>)}
            </div>
            <div className="quarter-indicator">{chosenQuarter === null ? 'No quarter selected' : `Quarter ${chosenQuarter + 1} · ${quarterNames[chosenQuarter]}`}</div>
          </div>

          <div className="control-section ingredient-section">
            <div className="section-heading"><span className="step-number">02</span><div><h3>Choose an ingredient</h3><p>Each click drops one topping.</p></div></div>
            <div className="ingredient-grid">
              {ingredientTypes.map((type) =>
                <button key={type} type="button" className={`ingredient-button ${snapshot.selectedIngredient === type ? 'is-active' : ''}`}
                  aria-pressed={snapshot.selectedIngredient === type} onClick={() => addIngredient(type)}>
                  <span className="ingredient-art"><IngredientPreview type={type} /></span>
                  <span className="ingredient-name">{type}</span><small>{descriptions[type]}</small>
                </button>)}
            </div>
          </div>

          <div className="control-section edit-section">
            <div className="section-heading"><span className="step-number">03</span><div><h3>Make it yours</h3><p>Change your mind anytime.</p></div></div>
            <div className="edit-grid">
              <button type="button" onClick={() => engineRef.current?.undo()} disabled={snapshot.ingredientCount === 0}>Undo</button>
              <button type="button" onClick={() => engineRef.current?.clear()}>Clear pizza</button>
              <button type="button" onClick={() => engineRef.current?.reset()}>Reset</button>
            </div>
          </div>

          <p className="status-line" role="status" aria-live="polite"><span aria-hidden="true">✦</span>{snapshot.message}</p>
          {error && <p className="error-line" role="alert">{error}</p>}
        </aside>
      </div>
      <footer>CRAFTED FRESH · FOUR QUARTERS · YOUR RECIPE</footer>
    </main>
  );
}
