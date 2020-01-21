<template>
  <div
    :contenteditable="contenteditable"
    style="padding: 5px 10px;"
    class="content"
    @paste.prevent="pasteData"
    @blur="save"
  >
    {{ item.content }}
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
          type: 'content',
          content: 'Content goes here'
        }
      }
    },
    itemIndex: {
      type: Number,
      default: 0
    }
  },
  methods: {
    ...mapActions([
      'saveItem'
    ]),
    pasteData(e) {
      this.item.content = e.clipboardData.getData('text/plain')
    },
    save(e) {
      this.item.content = e.target.innerText
      this.saveItem({ item: this.item, index: this.itemIndex })
    }
  }
}
</script>

<style scoped>
  [contenteditable]:focus {
    outline: 0 solid transparent;
  }
</style>
