<template>
  <div v-if="item.type == 'title'">
    <div style="position: absolute; top: 5px; right: 1%;">
      <span v-if="!preview" style="cursor: pointer;" @click="hVisible = !hVisible">
        <i class="fa fa-ellipsis-v" aria-hidden="true" />
      </span>
      <div
        v-for="(heading, key) in item.headings"
        v-if="!preview && hVisible"
        class="btn-group btn-group-sm"
        title="Change Heading"
        @click="changeToHeading({headingKey: key})"
      >
        <button type="button" class="btn btn-primary" style="cursor: pointer;"> {{ key }} </button>
      </div>
    </div>
    <div
      :id="item.i"
      v-model="item.title"
      :contenteditable="contenteditable"
      style="padding: 6px 10px;"
      :class="[{ 'heading1': item.headings.h1,
                 'heading2': item.headings.h2,
                 'heading3': item.headings.h3,
      }]"
      @paste.prevent="pasteData"
      @blur="save"
    >
      {{ item.title }}
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import map from 'lodash/map'
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
          content: 'http://via.placeholder.com/600x350' }
      }
    },
    itemIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      hVisible: false
    }
  },
  methods: {
    ...mapActions([
      'saveHeadings',
      'saveItem'
    ]),
    changeToHeading(data) {
      const updatedHeadingSelection = map(this.item.headings, (item, key) => key === data.headingKey)
      this.saveHeadings({ values: updatedHeadingSelection, itemIndex: this.itemIndex })
    },
    save(e) {
      this.item.title = e.target.innerText
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
