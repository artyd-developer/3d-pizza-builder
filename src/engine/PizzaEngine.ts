import { PizzaModel, type IngredientType } from './PizzaModel';
import { PizzaRenderer } from './PizzaRenderer';
import { pickQuarter } from './QuarterMath';
import { findPlacement } from './Placement';
import { advanceAnimation } from './Animation';
import { CheesePhysics } from './CheesePhysics';

export class PizzaEngine {
  readonly model: PizzaModel;
  readonly cheese = new CheesePhysics();
  private renderer: PizzaRenderer | null;
  private frame = 0;
  private stopped = false;
  private lastFrame = 0;
  private accumulator = 0;

  constructor(readonly canvas: HTMLCanvasElement, model?: PizzaModel, private onError?: (message: string) => void) {
    this.model = model ?? new PizzaModel();
    this.renderer = new PizzaRenderer(canvas);
    this.loop = this.loop.bind(this);
    canvas.addEventListener('webglcontextlost', this.contextLost);
    canvas.addEventListener('webglcontextrestored', this.contextRestored);
    canvas.addEventListener('pointerdown', this.pointerDown);
    this.frame = requestAnimationFrame(this.loop);
  }

  private loop(now: number): void {
    if (this.stopped || !this.renderer) return;
    const delta = this.lastFrame ? (now - this.lastFrame) / 1000 : 0;
    this.lastFrame = now;
    this.accumulator = advanceAnimation(this.model.ingredients, this.accumulator, delta,
      (item) => this.cheese.addImpact(item), (dt) => this.cheese.step(dt));
    this.renderer.render(this.model, this.cheese);
    this.frame = requestAnimationFrame(this.loop);
  }

  private contextLost = (event: Event): void => {
    event.preventDefault();
    cancelAnimationFrame(this.frame);
    this.lastFrame = 0;
    this.accumulator = 0;
    // CPU scene state stays in PizzaModel; all GPU objects are invalid after loss.
    this.renderer?.destroy();
    this.renderer = null;
    this.onError?.('Graphics paused. Restoring the WebGL scene…');
  };

  private contextRestored = (): void => {
    if (this.stopped) return;
    try {
      this.renderer = new PizzaRenderer(this.canvas);
      this.lastFrame = 0;
      this.onError?.('');
      this.frame = requestAnimationFrame(this.loop);
    } catch (cause) {
      this.onError?.(cause instanceof Error ? cause.message : 'Unable to restore the WebGL scene.');
    }
  };

  private pointerDown = (event: PointerEvent): void => {
    if (!this.renderer) return;
    const rect = this.canvas.getBoundingClientRect();
    const quarter = pickQuarter(this.renderer.camera, event.clientX - rect.left, event.clientY - rect.top);
    if (quarter !== null) this.model.selectQuarter(quarter);
  };

  addIngredient(type: IngredientType): void {
    const sizes: Record<IngredientType, number> = {
      pepperoni: 0.20, mushroom: 0.22, pineapple: 0.18,
      olives: 0.18, jalapeno: 0.19, bacon: 0.20,
    };
    const size = sizes[type];
    const quarter = this.model.selectedQuarter;
    const footprint = type === 'pepperoni' ? size * 1.35 : size;
    const placement = quarter === null ? null : findPlacement(quarter, footprint, this.model.ingredients);
    this.model.addIngredient(type, placement, size, Math.random() * Math.PI * 2);
  }

  undo(): void {
    const removed = this.model.undo();
    if (removed) this.cheese.removeImpact(removed.id);
  }

  clear(): void {
    this.model.clear();
    this.cheese.clear();
  }

  reset(): void {
    this.model.reset();
    this.cheese.clear();
    this.accumulator = 0;
  }

  destroy(): void {
    this.stopped = true;
    cancelAnimationFrame(this.frame);
    this.canvas.removeEventListener('webglcontextlost', this.contextLost);
    this.canvas.removeEventListener('webglcontextrestored', this.contextRestored);
    this.canvas.removeEventListener('pointerdown', this.pointerDown);
    this.renderer?.destroy();
  }
}
