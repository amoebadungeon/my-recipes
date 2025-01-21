// types/Recipe.ts
export interface Recipe {
  id: number
  title: string
  name: string
  url?: string
  image: string
  author?: {
    name: string
  }
  datePublished?: string
  dateModified?: string
  description: string
  recipeIngredient: string[]
  recipeInstructions: {
    text: string
  }[]
  [key: string]: any // for any additional properties
  ingredients: string
  instructions: string
  user_id?: number
  created_at?: string
}
