<template>
  <div :style="getStyle" >
    <div v-if="!preview" @click="editImage = !editImage" class="preview">
      <i v-if="!editImage" class="fa fa-pencil" aria-hidden="true"></i>
      <i v-else="!editImage" class="fa fa-times" aria-hidden="true"></i>
    </div>
    <input v-if="editImage" type="text" v-model="item.location" @blur="save" class="edit">
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  props: {
    preview: {
      type: Boolean,
      default: true
    },
    contenteditable: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: () => {
        return {
          x: 0,
          y: 0,
          w: 4,
          h: 4,
          i: 0,
          type: 'image',
          location: 'http://via.placeholder.com/600x350' }
      }
    },
    itemIndex: {
      type: Number,
      default: 0
    }
  },

  data () {
    return {
      editImage: false
    }
  },
  computed: {
    getStyle () {
      return 'background-image:url(' + this.item.location + '); height: 100%; background-size: contain; background-repeat: no-repeat; border: 2px solid #FCE4EC; border-radius: 5px; background-position: center;'
    }
  },
  methods: {
    ...mapActions([
      'saveItem'
    ]),
    save (e) {
      this.item.location = e.target.value
      this.saveItem({ item: this.item, index: this.itemIndex })
    }
  }
}
</script>

<style scoped>
  .preview {
    position: absolute;
    left: 4px;
    top: 2px;
  }

  .edit {
    padding-left: 20px;
    width: 100%;
  }

</style>


// export const addTitleGridItem = ({ commit, state }, payload) => {
//   let g = lib.guid()
//   let k = { 'x': 0, 'y': 0, 'w': 4, 'h': 2, 'i': g, 'type': 'title', 'title': 'Heading 1', 'headings': { 'h1': false, 'h2': false, 'h3': false } }
//   commit('setNewGridItem', k)
// }

// // Action to add content grid item in the state through the mutation
// export const addContentGridItem = ({ commit, state }, payload) => {
//   let g = lib.guid()
//   let k = { 'x': 0, 'y': 0, 'w': 4, 'h': 3, 'i': g, 'type': 'content', 'content': 'Content goes here' }
//   commit('setNewGridItem', k)
// }

// // Action to add image grid item in the state through the mutation
// export const addImageGridItem = ({ commit, state }, payload) => {
//   let g = lib.guid()
//   let k = { 'x': 0, 'y': 0, 'w': 4, 'h': 4, 'i': g, 'type': 'image', 'location': 'http://via.placeholder.com/600x350' }
//   commit('setNewGridItem', k)
// }
