<!-- EditRecipeModal.vue -->
<template>
  <div v-if="show" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <button class="close-button" @click="closeModal">&times;</button>

      <h2>Edit Recipe</h2>
      <form @submit.prevent="handleSubmit" class="edit-recipe-form">
        <div class="form-group">
          <label for="edit-title">Recipe Title</label>
          <input
            type="text"
            id="edit-title"
            v-model="editedRecipe.title"
            required
            placeholder="Enter recipe title"
          />
        </div>

        <div class="form-group">
          <label for="edit-image">Image URL</label>
          <input
            type="url"
            id="edit-image"
            v-model="editedRecipe.image"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div class="form-group">
          <label for="edit-description">Description</label>
          <textarea
            id="edit-description"
            v-model="editedRecipe.description"
            required
            rows="3"
            placeholder="Enter a brief description of your recipe"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="edit-ingredients">Ingredients (one per line)</label>
          <textarea
            id="edit-ingredients"
            v-model="editedRecipe.ingredients"
            required
            rows="5"
            placeholder="1 cup flour&#10;2 eggs&#10;1 cup milk"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="edit-instructions">Instructions</label>
          <textarea
            id="edit-instructions"
            v-model="editedRecipe.instructions"
            required
            rows="5"
            placeholder="1. Mix ingredients&#10;2. Bake at 350°F&#10;3. Cool and serve"
          ></textarea>
        </div>

        <button type="submit" class="submit-button" :disabled="isSubmitting">
          {{ isSubmitting ? 'Saving Changes...' : 'Save Changes' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import type { Recipe } from '@/types/Recipes'
import '@/assets/styles/storeRecipe.css'
export default defineComponent({
  name: 'EditRecipeModal',
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    recipe: {
      type: Object as () => Recipe,
      required: true,
    },
  },
  emits: ['close', 'update'],
  setup(props, { emit }) {
    const isSubmitting = ref(false)
    const editedRecipe = ref<Recipe>({ ...props.recipe })

    // Update editedRecipe when props.recipe changes
    watch(
      () => props.recipe,
      (newRecipe) => {
        editedRecipe.value = { ...newRecipe }
      },
    )

    const closeModal = () => {
      emit('close')
    }

    const handleSubmit = async () => {
      if (isSubmitting.value) return

      isSubmitting.value = true
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(
          `http://localhost:3000/api/recipes/stored/${props.recipe.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(editedRecipe.value),
          },
        )

        if (!response.ok) {
          throw new Error('Failed to update recipe')
        }

        emit('update')
        closeModal()
        alert('Recipe updated successfully!')
      } catch (error) {
        console.error('Error updating recipe:', error)
        alert('Failed to update recipe')
      } finally {
        isSubmitting.value = false
      }
    }

    return {
      editedRecipe,
      isSubmitting,
      closeModal,
      handleSubmit,
    }
  },
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

/* ... rest of your styles ... */
</style>
