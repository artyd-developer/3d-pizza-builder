export type IngredientType = 'pepperoni' | 'mushroom' | 'pineapple' | 'olives' | 'jalapeno' | 'bacon';
export type MotionState = 'SPAWNING' | 'FALLING' | 'LANDING' | 'IDLE';
export type Quarter = 0 | 1 | 2 | 3;

export interface Placement {
  x: number;
  z: number;
}

export interface Ingredient extends Placement {
  id: number;
  type: IngredientType;
  quarter: Quarter;
  rotation: number;
  size: number;
  state: MotionState;
  age: number;
  height: number;
  velocity: number;
  spin: number;
  impactAge: number;
}

export interface PizzaSnapshot {
  selectedQuarter: Quarter | null;
  selectedIngredient: IngredientType | null;
  ingredientCount: number;
  recipes: IngredientType[][];
  message: string;
}

export class PizzaModel {
  readonly ingredients: Ingredient[] = [];
  readonly recipes: IngredientType[][] = [[], [], [], []];
  selectedQuarter: Quarter | null = null;
  selectedIngredient: IngredientType | null = null;
  message = 'Tap a quarter of the pizza to begin.';
  private nextId = 1;
  private listeners = new Set<(state: PizzaSnapshot) => void>();

  getSnapshot(): PizzaSnapshot {
    return {
      selectedQuarter: this.selectedQuarter,
      selectedIngredient: this.selectedIngredient,
      ingredientCount: this.ingredients.length,
      recipes: this.recipes.map((recipe) => [...recipe]),
      message: this.message,
    };
  }

  subscribe(listener: (state: PizzaSnapshot) => void): () => void {
    this.listeners.add(listener);
    listener(this.getSnapshot());
    return () => this.listeners.delete(listener);
  }

  private emit(): void {
    const snapshot = this.getSnapshot();
    this.listeners.forEach((listener) => listener(snapshot));
  }

  selectQuarter(quarter: Quarter): void {
    this.selectedQuarter = quarter;
    this.message = `Quarter ${quarter + 1} selected. Choose an ingredient.`;
    this.emit();
  }

  addIngredient(type: IngredientType, placement: Placement | null, size: number, rotation: number): Ingredient | null {
    if (this.selectedQuarter === null) {
      this.message = 'Select a pizza quarter first.';
      this.emit();
      return null;
    }
    if (!placement) {
      this.message = 'This quarter is full. Try another one.';
      this.emit();
      return null;
    }
    const ingredient: Ingredient = {
      id: this.nextId++, type, quarter: this.selectedQuarter,
      x: placement.x, z: placement.z, size, rotation,
      state: 'SPAWNING', age: 0, height: 0.95, velocity: 0,
      spin: (Math.random() - 0.5) * 1.2, impactAge: 0,
    };
    this.ingredients.push(ingredient);
    this.selectedIngredient = type;
    this.message = `${type[0].toUpperCase()}${type.slice(1)} added to quarter ${this.selectedQuarter + 1}.`;
    this.emit();
    return ingredient;
  }

  replaceRecipes(recipes: readonly (readonly IngredientType[])[], batches: readonly Ingredient[][], message: string): Ingredient[] {
    const removed = this.ingredients.splice(0);
    for (let quarter = 0; quarter < 4; quarter++) {
      this.recipes[quarter] = [...recipes[quarter]];
      this.ingredients.push(...batches[quarter]);
    }
    this.selectedIngredient = null;
    this.message = message;
    this.emit();
    return removed;
  }

  addBatch(type: IngredientType, batch: Ingredient[]): Ingredient[] {
    const quarter = this.selectedQuarter;
    if (quarter === null) {
      this.message = 'Select a pizza quarter first.';
      this.emit();
      return [];
    }
    const recipe = this.recipes[quarter];
    if (recipe.includes(type)) return [];
    const removed = recipe.length === 2
      ? this.ingredients.filter((item) => item.quarter === quarter && item.type === recipe[0]) : [];
    if (removed.length) this.ingredients.splice(0, this.ingredients.length,
      ...this.ingredients.filter((item) => !removed.includes(item)));
    if (recipe.length === 2) recipe.shift();
    recipe.push(type);
    this.ingredients.push(...batch);
    this.selectedIngredient = type;
    this.message = `${type[0].toUpperCase()}${type.slice(1)} added to quarter ${quarter + 1}.`;
    this.emit();
    return removed;
  }

  createPiece(type: IngredientType, quarter: Quarter, placement: Placement, size: number, rotation: number, delay = 0): Ingredient {
    return {
      id: this.nextId++, type, quarter, x: placement.x, z: placement.z, size, rotation,
      state: 'SPAWNING', age: -delay, height: 0.95, velocity: 0,
      spin: (Math.random() - 0.5) * 1.2, impactAge: 0,
    };
  }

  undo(): Ingredient | null {
    const removed = this.ingredients.pop() ?? null;
    if (removed) {
      this.message = 'Last ingredient removed.';
      this.emit();
    }
    return removed;
  }

  clear(): void {
    this.ingredients.length = 0;
    this.recipes.forEach((recipe) => recipe.splice(0));
    this.message = 'Pizza cleared. Your selections are ready.';
    this.emit();
  }

  reset(): void {
    this.ingredients.length = 0;
    this.recipes.forEach((recipe) => recipe.splice(0));
    this.selectedQuarter = null;
    this.selectedIngredient = null;
    this.message = 'Tap a quarter of the pizza to begin.';
    this.emit();
  }
}
