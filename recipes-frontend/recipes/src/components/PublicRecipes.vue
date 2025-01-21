<!-- PublicRecipes.vue -->

<template>
  <section class="recipes-container public-recipes">
    <h2>Public Recipes</h2>

    <div class="recipes-navigation">
      <!-- Left Arrow -->

      <button class="nav-arrow left" :disabled="currentPage === 0" @click="previousPage">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </button>

      <div class="recipe-cards">
        <div
          v-for="recipe in paginatedRecipes"
          :key="recipe.name"
          class="recipe-card"
          @click="openRecipeModal(recipe)"
        >
          <img
            :src="recipe.image[0] === 'h' ? '/brokenIMG.png' : recipe.image[0]"
            alt="Recipe Image"
            class="recipe-image"
          />

          <div class="recipe-info">
            <h3>{{ recipe.name }}</h3>

            <h5>{{ recipe.description }}</h5>
          </div>
        </div>
      </div>

      <!-- Right Arrow -->

      <button class="nav-arrow right" :disabled="!hasMoreRecipes" @click="nextPage">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
        </svg>
      </button>
    </div>
    <RecipeModal :show="showModal" :recipe="selectedRecipe" @close="closeModal" />
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'

import RecipeModal from './RecipesModal.vue'

import type { Recipe } from '@/types/Recipes' // Import the interface

export default defineComponent({
  name: 'PublicRecipes',
  components: {
    RecipeModal,
  },

  setup() {
    const publicRecipes = ref<Recipe[]>([])

    const currentPage = ref(0)

    const recipesPerPage = 10
    const showModal = ref(false)

    const selectedRecipe = ref<Recipe | null>(null) // Add proper typing

    const openRecipeModal = (recipe: Recipe) => {
      selectedRecipe.value = recipe

      showModal.value = true
    }

    const closeModal = () => {
      showModal.value = false

      selectedRecipe.value = null
    }
    const paginatedRecipes = computed(() => {
      const start = currentPage.value * recipesPerPage

      return publicRecipes.value.slice(start, start + recipesPerPage)
    })

    const hasMoreRecipes = computed(() => {
      return (currentPage.value + 1) * recipesPerPage < publicRecipes.value.length
    })

    const nextPage = () => {
      if (hasMoreRecipes.value) {
        currentPage.value++
      }
    }

    const previousPage = () => {
      if (currentPage.value > 0) {
        currentPage.value--
      }
    }

    const fetchPublicRecipes = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/recipes/public')

        const data = await response.json()

        publicRecipes.value = data
      } catch (error) {
        console.error('Error fetching public recipes:', error)
      }
    }

    onMounted(() => {
      fetchPublicRecipes()
    })

    return {
      paginatedRecipes,

      hasMoreRecipes,

      currentPage,

      nextPage,

      previousPage,
      showModal,

      selectedRecipe,

      openRecipeModal,

      closeModal,
    }
  },
})
</script>
