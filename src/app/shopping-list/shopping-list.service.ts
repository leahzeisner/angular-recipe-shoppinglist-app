import { Subject } from 'rxjs';
import { Ingredient } from './../shared/ingredient.model';

export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>()
  startedEditing = new Subject<number>()

  private ingredients: Ingredient[]

  // private ingredients: Ingredient[] = [
  //   new Ingredient("penne", 5),
  //   new Ingredient("sauce", 3),
  //   new Ingredient("ground beef", 11)
  // ]


  getIngredients() {
    if (!this.ingredients) {
      return []
    }
    return this.ingredients.slice();
  }

  getIngredient(index: number) {
    return this.ingredients[index]
  }

  addIngredient(ingredient: Ingredient) {
    if (!this.ingredients) {
      this.ingredients = []
      this.ingredients.push(ingredient)
    } else {
      this.ingredients.push(ingredient)
    }

    this.onIngredientsChanged()
  }

  addIngredients(ingredients: Ingredient[]) {
    this.ingredients.push(...ingredients);
    this.onIngredientsChanged()
  }

  updateIngredient(index: number, newIngredient: Ingredient) {
    this.ingredients[index] = newIngredient
    this.onIngredientsChanged()
  }

  deleteIngredient(index: number) {
    this.ingredients.splice(index, 1)
    this.onIngredientsChanged()
  }

  onIngredientsChanged() {
    this.ingredientsChanged.next(this.ingredients.slice())
  }
}
