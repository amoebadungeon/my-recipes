<!-- components/RecipeModal.vue -->
<template>
  <div v-if="show" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <button class="close-button" @click="closeModal">&times;</button>

      <div class="modal-body" v-if="recipe">
        <!-- Add v-if here -->
        <div class="recipe-image-container">
          <img
            :src="recipe.image[0] === 'h' ? '/brokenIMG.png' : recipe.image[0]"
            :alt="recipe.name"
            class="recipe-modal-image"
          />
        </div>

        <div class="recipe-details">
          <div class="recipe-header">
            <h2>{{ recipe.name }}</h2>
            <button
              class="favorite-button"
              @click="toggleFavorite"
              :class="{ 'is-favorite': isFavorite }"
            >
              <i class="fas fa-heart"></i>
            </button>
          </div>
          <p class="description">{{ recipe.description }}</p>

          <div class="ingredients-section">
            <h3>Ingredients</h3>
            <ul>
              <li v-for="(ingredient, index) in recipe.recipeIngredient" :key="index">
                {{ ingredient }}
              </li>
            </ul>
          </div>

          <div class="instructions-section">
            <h3>Instructions</h3>
            <ol>
              <li v-for="(step, index) in recipe.recipeInstructions" :key="index">
                {{ step.text }}
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Recipe } from '@/types/Recipes'
import '@/assets/styles/recipeModal.css'

export default defineComponent({
  name: 'RecipeModal',
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    recipe: {
      type: Object as PropType<Recipe | null>,
      required: true,
      default: null,
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const router = useRouter()
    const isFavorite = ref(false)
    const isLoading = ref(false)

    // Check if recipe is already in favorites
    const checkIfFavorite = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) return

        const response = await fetch('http://localhost:3000/api/recipes/stored', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const storedRecipes = await response.json()
          isFavorite.value = storedRecipes.some(
            (stored: any) => stored.title === props.recipe?.name,
          )
        }
      } catch (error) {
        console.error('Error checking favorite status:', error)
      }
    }

    const toggleFavorite = async () => {
      if (isLoading.value || !props.recipe) return

      isLoading.value = true
      try {
        const token = localStorage.getItem('token')

        if (!token) {
          alert('Please login to save recipes')
          router.push('/login')
          return
        }

        const response = await fetch('http://localhost:3000/api/recipes/stored', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: props.recipe.name,
            description: JSON.stringify(props.recipe.description),
            image: props.recipe.image[0],
            ingredients: JSON.stringify(props.recipe.recipeIngredient),
            instructions: JSON.stringify(props.recipe.recipeInstructions.map((step) => step.text)),
          }),
        })

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token')
          router.push('/login')
          return
        }

        if (!response.ok) {
          throw new Error('Failed to save recipe')
        }

        isFavorite.value = true
        alert('Recipe saved to favorites!')
      } catch (error) {
        console.error('Error saving recipe:', error)
        if (error instanceof Error) {
          alert(error.message)
        } else {
          alert('Failed to save recipe to favorites')
        }
      } finally {
        isLoading.value = false
      }
    }

    const closeModal = () => {
      emit('close')
    }

    // Check favorite status when modal opens
    onMounted(() => {
      if (props.show) {
        checkIfFavorite()
      }
    })

    return {
      closeModal,
      toggleFavorite,
      isFavorite,
      isLoading,
    }
  },
})
</script>
