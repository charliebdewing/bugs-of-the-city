import Vue from 'vue'

// Mutation to set resources in state
export const setResources = (state, resources) => {
  state.resources = resources || {}
}

// Mutation to new grid item in resources
export const setNewGridItem = (state, payload) => {
  state.resources.push(payload)
}

// Mutation to remove item from the resources
export const removeItem = (state, payload) => {
  if (payload.key > -1) {
    state.resources.splice(payload.key, 1)
  }
}

// Mutation to update item in resources
export const setUpdatedItem = (state, response) => {
  Vue.set(state.resources, response.itemIndex, response.item)
}

// Mutation to update item in resources
export const setActiveItem = (state, response) => {
  state.activeItem = response.item
}
