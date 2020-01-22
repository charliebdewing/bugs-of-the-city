<template>
<div class="grid-view"
      @ondragover="onDragOver"
      :isDroppable="true"
>
    <grid-layout
      ref="layout"
      v-bind="config"
      :layout.sync="resources"
      @layout-created="layoutCreated"
      @layout-before-mount="layoutBeforeMount"
      @layout-mounted="layoutMounted"
      @layout-ready="layoutReady"
      @layout-updated="layoutUpdated"
    >
      <grid-item
        v-for="(item, index) in resources"
        :key="index"
        :class="{ editMode: !preview }"
        :autoSize="false"
        ref="item"
        v-bind="item"
        @resize="resizeEvent"
        @move="moveEvent(item)"
        @resized="resizedEvent"
        @container-resized="containerResizedEvent"
        @move-event="movedEvent"
      >
        <div
          v-if="!preview"
          @click="removeItem({ key: index })"
          style="position: absolute; bottom: 0; left: 4px;"
        >
          <i class="fa fa-trash" aria-hidden="true"></i>
        </div>
        <text-widget
          v-if="item.type == 'title'"
          :preview="preview"
          :contenteditable="contenteditable"
          :item="item"
          :itemIndex="index"
        ></text-widget>

        <text-area-widget
          v-if="item.type == 'content'"
          :preview="preview"
          :contenteditable="contenteditable"
          :item="item"
          :itemIndex="index"
        ></text-area-widget>
      </grid-item>
    </grid-layout>

    <!-- <placeholder @selected="selected" /> -->
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import TextWidget from './TextWidget'
import TextAreaWidget from './TextAreaWidget'
import ImageWidget from './ImageWidget'
import Placeholder from './Placeholder'
import { GridItem, GridLayout } from 'vue-grid-layout'

import {cloneDeep} from 'lodash'

export default {
  name: 'gridview',

  props: {
    main: {
      type: Boolean,
      default: false
    },

    resources: {
      type: Array,
      default: () => {
        return [
          {
            x: 0,
            y: 0,
            w: 3,
            h: 2,
            i: '0',
            type: 'title',
            title: 'Actias Luna',
            headings: {
              h1: true,
              h2: false,
              h3: false
            },
            moved: false
          },
          {
            x: 8,
            y: 17,
            w: 4,
            h: 8,
            i: '1',
            type: 'content',
            content: 'test',
            moved: false
          },
          {
            x: 8,
            y: 7,
            w: 4,
            h: 10,
            i: '2',
            type: 'image',
            location:
              'http://vue-grid-layout.surge.sh/static/monarch-on-plant.png',
            moved: false
          },
          {
            x: 5,
            y: 16,
            w: 3,
            h: 5,
            i: '08fde225-71d0-b24c-4aa4-ecd391dd77cf',
            type: 'image',
            location: 'http://vue-grid-layout.surge.sh/static/monarch-04.png',
            moved: false
          }
        ]
      }
    }
  },

  components: {
    GridLayout,
    GridItem,
    TextWidget,
    TextAreaWidget,
    ImageWidget,
    Placeholder
  },
  data () {
    return {
      config: {
        isDraggable: false,
        isResizable: false,
        isResponsive: true,
        isMirrored: false,
        rowHeight: 30,
        verticalCompact: false,
        margin: [5, 5]
      },
      preview: true,
      contenteditable: false,
      active: false,
      resourcesClone: []
    }
  },
  computed: {
    ...mapGetters(['getResources', 'getActiveItem'])
  },

  mounted () {
    // const gridItems = this.$refs.item

// Toggle Grid on
    this.disableGrid()

    this.resourcesClone = cloneDeep(this.resources)
  },

  watch: {

  },

  methods: {
    ...mapActions([
      'setResources',
      'addTitleGridItem',
      'addContentGridItem',
      'addImageGridItem',
      'addGridItem',
      'removeItem',
      'setActiveItem'
    ]),
    disableGrid () {
      this.config.isDraggable = !this.config.isDraggable
      this.config.isResizable = !this.config.isResizable
      this.preview = !this.preview
      this.contenteditable = !this.contenteditable
    },

    selected (type) {
    },

    // Layout events

    layoutCreated(e) {
      console.log('layoutCreated', e)
    },
    layoutBeforeMount(e) {
      console.log('layoutBeforeMount', e)
    },
    layoutMounted(e) {
      console.log('layoutMounted', e)
    },
    layoutReady(e) {
      console.log('layoutReady', e)
    },
    layoutUpdated(e) {
      console.log('layoutUpdated', e)
    },
    onDrop(e) {
      console.log('onDrop', e)
    },
    onDragOver(e) {
      e.preventDefault()
      console.log('onDragOver', e)
    },

    // Item events
    resizeEvent(e) {
      console.log('resizeEvent', e)
    },
    moveEvent (item) {
      // this.setActiveItem({ item })
      console.log('moveEvent', item.i)
      // console.log('moveEvent', item, this.getActiveItem)
    },
    resizedEvent(e) {
      console.log('resizedEvent', e)
    },
    containerResizedEvent(e) {
      // console.log('containerResizedEvent', e)
    },
    movedEvent(e) {
      console.log('movedEvent', e)
    },
    dragEnter(e) {
      // const eventBus = this.$refs.layout.eventBus
      console.log('dragEnter', e)
      // if (!this.active) {
      //   this.active = false
      //   this.addGridItem(this.getActiveItem)
      //   this.$emit('dragEnd')
      // }
    }

  }
}
</script>
<style>
.editMode {
  background-color: #fafafa;
  border-radius: 5px;
}

.site-title {
  font-family: "Lilita One", cursive;
  font-size: 50px;
  color: #f48fb1;
  text-align: center;
}

.heading1 {
  font-family: "Crushed", cursive;
  font-size: 35px;
  border: none;
  color: #2196f3;
}

.heading2 {
  font-family: "Patrick Hand", cursive;
  font-size: 20px;
  border: none;
  color: #3096f3;
  background-color: #fff9c4;
  width: 100%;
  padding: 10px 5px;
}

.heading3 {
  font-family: "Homemade Apple", cursive;
  font-size: 20px;
  border: none;
  color: #66d2b3;
  padding: 0 7px;
}

.content {
  font-family: "Patrick Hand", cursive;
  font-size: 20px;
  color: #2196f3;
}


.placeholder-wrapper {
  transform: translate;
}

</style>
