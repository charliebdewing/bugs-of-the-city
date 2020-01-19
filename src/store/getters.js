// Getter to retrieve state data
export const getResources = (state) => {
  return state.resources
}

// Getter to retrieve activeItem
export const getActiveItem = (state, id) => {
  return state.activeItem
}

// Getter to retrieve item by id
export const getResourceById = (state, id) => {
  return state.resources.find(item => item.i === id)
}
