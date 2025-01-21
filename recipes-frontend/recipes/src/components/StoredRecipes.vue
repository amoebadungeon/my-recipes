<template>
  <section class="recipes-container stored-recipes">
    <h2>My Stored Recipes</h2>

    <div class="recipe-cards">
      <!-- Add Recipe Card -->

      <div class="recipe-card add-recipe-card" @click="openAddModal">
        <div class="add-recipe-content">
          <span class="plus-sign">+</span>

          <p>Add New Recipe</p>
        </div>
      </div>

      <!-- Existing Recipe Cards -->
      <div
        v-for="recipe in storedRecipes"
        :key="recipe.id"
        class="recipe-card"
        @click="openRecipeModal(recipe)"
      >
        <img :src="recipe.image || '/brokenIMG.png'" alt="Recipe Image" class="recipe-image" />

        <div class="recipe-info">
          <h3>{{ recipe.title }}</h3>

          <h5>{{ recipe.description }}</h5>
        </div>
      </div>
    </div>

    <!-- Recipe Details Modal -->
    <div v-if="showRecipeModal && selectedRecipe" class="modal-overlay" @click="closeRecipeModal">
      <div class="modal-content" @click.stop>
        <button class="close-button" @click="closeRecipeModal">&times;</button>

        <div class="modal-body">
          <div class="recipe-image-container">
            <img
              :src="selectedRecipe.image || '/brokenIMG.png'"
              :alt="selectedRecipe.title"
              class="recipe-modal-image"
            />
          </div>

          <div class="recipe-details">
            <div class="recipe-header">
              <h2>{{ selectedRecipe.title }}</h2>
              <div class="recipe-actions">
                <button class="edit-button" @click.stop="openEditModal">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="white"
                    width="16"
                    height="16"
                  >
                    <path
                      d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z"
                    />
                  </svg>
                </button>
                <button
                  class="delete-button"
                  @click="deleteRecipe(selectedRecipe.id)"
                  :disabled="isDeleting"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    fill="white"
                    width="16"
                    height="16"
                  >
                    <path
                      d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96h384c17.7 0 32-14.3 32-32s-14.3-32-32-32h-96l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32l21.2 339c1.6 25.3 22.6 45 47.9 45h245.8c25.3 0 46.3-19.7 47.9-45L416 128z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <p class="description">{{ selectedRecipe.description }}</p>

            <div class="ingredients-section">
              <h3>Ingredients</h3>
              <ul>
                <li
                  v-for="(ingredient, index) in parseIngredients(selectedRecipe.ingredients)"
                  :key="index"
                >
                  {{ ingredient }}
                </li>
              </ul>
            </div>

            <div class="instructions-section">
              <h3>Instructions</h3>
              <ol>
                <li
                  v-for="(instruction, index) in parseInstructions(selectedRecipe.instructions)"
                  :key="index"
                >
                  {{ instruction }}
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Recipe Modal -->
    <div v-if="showAddModal" class="modal-overlay" @click="closeAddModal">
      <div class="modal-content" @click.stop>
        <button class="close-button" @click="closeAddModal">&times;</button>

        <h2>Add New Recipe</h2>

        <form @submit.prevent="handleSubmit" class="add-recipe-form">
          <div class="form-group">
            <label for="title">Recipe Title</label>

            <input
              type="text"
              id="title"
              v-model="newRecipe.title"
              required
              placeholder="Enter recipe title"
            />
          </div>

          <div class="form-group">
            <label for="image">Image URL</label>

            <input
              type="url"
              id="image"
              v-model="newRecipe.image"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div class="form-group">
            <label for="description">Description</label>

            <textarea
              id="description"
              v-model="newRecipe.description"
              required
              rows="3"
              placeholder="Enter a brief description of your recipe"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="ingredients">Ingredients (one per line)</label>

            <textarea
              id="ingredients"
              v-model="newRecipe.ingredients"
              required
              rows="5"
              placeholder="1 cup flour&#10;2 eggs&#10;1 cup milk"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="instructions">Instructions</label>

            <textarea
              id="instructions"
              v-model="newRecipe.instructions"
              required
              rows="5"
              placeholder="1. Mix ingredients&#10;2. Bake at 350°F&#10;3. Cool and serve"
            ></textarea>
          </div>

          <button type="submit" class="submit-button" :disabled="isSubmitting">
            {{ isSubmitting ? 'Adding Recipe...' : 'Add Recipe' }}
          </button>
        </form>
      </div>
    </div>

    <!-- Edit Recipe Modal -->
    <EditRecipeModal
      :show="showEditModal"
      :recipe="selectedRecipe"
      @close="closeEditModal"
      @update="fetchStoredRecipes"
    />
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import '@/assets/styles/storeRecipe.css'
import type { Recipe } from '@/types/Recipes'
import EditRecipeModal from './EditRecipeModal.vue'

interface NewRecipe {
  title: string

  image: string

  description: string

  ingredients: string

  instructions: string
}

export default defineComponent({
  name: 'StoredRecipes',
  components: {
    EditRecipeModal,
  },
  setup() {
    const storedRecipes = ref<Recipe[]>([])

    const showAddModal = ref(false)

    const showRecipeModal = ref(false)

    const selectedRecipe = ref<Recipe | null>(null)

    const isSubmitting = ref(false)

    const isDeleting = ref(false)
    const showEditModal = ref(false)
    const newRecipe = ref<NewRecipe>({
      title: '',

      image: '',

      description: '',

      ingredients: '',

      instructions: '',
    })

    const openAddModal = () => {
      showAddModal.value = true
    }

    const closeAddModal = () => {
      showAddModal.value = false

      newRecipe.value = {
        title: '',

        image: '',

        description: '',

        ingredients: '',

        instructions: '',
      }
    }

    const openRecipeModal = (recipe: Recipe) => {
      selectedRecipe.value = recipe

      showRecipeModal.value = true
    }

    const closeRecipeModal = () => {
      showRecipeModal.value = false

      selectedRecipe.value = null
    }

    const parseIngredients = (ingredients: string) => {
      try {
        return JSON.parse(ingredients)
      } catch {
        return ingredients.split('\n')
      }
    }

    const parseInstructions = (instructions: string) => {
      try {
        return JSON.parse(instructions)
      } catch {
        return instructions.split('\n')
      }
    }

    const handleSubmit = async () => {
      if (isSubmitting.value) return

      isSubmitting.value = true

      try {
        const token = localStorage.getItem('token')

        const response = await fetch('http://localhost:3000/api/recipes/stored', {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            title: newRecipe.value.title,

            image: newRecipe.value.image,

            description: newRecipe.value.description,

            ingredients: newRecipe.value.ingredients,

            instructions: newRecipe.value.instructions,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to add recipe')
        }

        await fetchStoredRecipes()

        closeAddModal()

        alert('Recipe added successfully!')
      } catch (error) {
        console.error('Error adding recipe:', error)

        alert('Failed to add recipe')
      } finally {
        isSubmitting.value = false
      }
    }

    const fetchStoredRecipes = async () => {
      try {
        const token = localStorage.getItem('token')

        const response = await fetch('http://localhost:3000/api/recipes/stored', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()

        storedRecipes.value = data
      } catch (error) {
        console.error('Error fetching stored recipes:', error)
      }
    }
    const deleteRecipe = async (recipeId: number) => {
      if (!confirm('Are you sure you want to delete this recipe?')) return

      isDeleting.value = true

      try {
        const token = localStorage.getItem('token')

        const response = await fetch(`http://localhost:3000/api/recipes/stored/${recipeId}`, {
          method: 'DELETE',

          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to delete recipe')
        }

        await fetchStoredRecipes()

        closeRecipeModal()

        alert('Recipe deleted successfully!')
      } catch (error) {
        console.error('Error deleting recipe:', error)

        alert('Failed to delete recipe')
      } finally {
        isDeleting.value = false
      }
    }
    const openEditModal = () => {
      showEditModal.value = true
    }

    const closeEditModal = () => {
      showEditModal.value = false
    }
    onMounted(() => {
      fetchStoredRecipes()
    })

    return {
      storedRecipes,

      showAddModal,

      showRecipeModal,

      selectedRecipe,

      isSubmitting,

      newRecipe,

      openAddModal,

      closeAddModal,

      openRecipeModal,

      closeRecipeModal,

      handleSubmit,

      parseIngredients,

      parseInstructions,

      deleteRecipe,

      isDeleting,
      showEditModal,

      openEditModal,

      closeEditModal,
      fetchStoredRecipes,
    }
  },
})
</script>
