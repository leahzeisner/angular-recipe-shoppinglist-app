import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipe.model";

@Injectable()

export class RecipeService {
  recipesChanged = new Subject<Recipe[]>()

  private recipes: Recipe[]

  // private recipes: Recipe[] = [
  //   new Recipe("Pasta & Meatballs", "Saucy ballz",
  //   "https://www.cookingclassy.com/wp-content/uploads/2019/09/meatballs-21.jpg",
  //   [
  //     new Ingredient('pasta', 5),
  //     new Ingredient('sauce', 3),
  //     new Ingredient('ground beef', 11),
  //   ]),

  //   new Recipe("Buffalo Chicken Dip", "Dairy and Gluten free!",
  //   "https://realhousemoms.com/wp-content/uploads/Buffalo-Chicken-Dip-Crock-Pot-IG.jpg",
  //   [
  //     new Ingredient('chicken', 8),
  //     new Ingredient('buffalo sauce', 4),
  //   ]),
  // ];


  constructor(private shoppingListService: ShoppingListService) {}


  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.onRecipesChanged()
  }

  getRecipes() {
    if (!this.recipes) {
      return []
    }
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index]
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients)
  }

  addRecipe(recipe: Recipe) {
    if (!this.recipes) {
      this.recipes = []
      this.recipes.push(recipe)
    } else {
      this.recipes.push(recipe)
    }

    this.onRecipesChanged()
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe
    this.onRecipesChanged()
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1)
    this.onRecipesChanged()
  }

  onRecipesChanged() {
    this.recipesChanged.next(this.recipes.slice())
  }
}
