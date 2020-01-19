<template>
  <div>
    <div style="text-align: center;">
      <span v-if="!preview">
        <button class="btn btn-outline-primary" @click="addTitleGridItem">
          H1
        </button>
        <button class="btn btn-outline-primary" @click="addContentGridItem">
          Content
        </button>
        <button class="btn btn-outline-primary" @click="addImageGridItem">
          Image
        </button>
      </span>
      <button class="btn btn-outline-primary" @click="disableGrid">
        <span v-if="preview"> Edit </span>
        <span v-else> Preview </span>
      </button>
    </div>
    <hr />
    <div @mouseenter="mouseEnter" @mouseout="mouseLeave" @dragenter.prevent.stop="dragEnter">
    <grid-layout ref="layout" v-bind="config" :layout="resources">
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
        @moved="movedEvent"
      >
        <div
          v-if="!preview"
          @click="removeItem({ key: index })"
          style="position: absolute; bottom: 0px; left: 4px;"
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

        <image-widget
          v-if="item.type == 'image'"
          :preview="preview"
          :contenteditable="contenteditable"
          :item="item"
          :itemIndex="index"
        ></image-widget>
      </grid-item>
    </grid-layout>
  </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import TextWidget from './TextWidget'
import TextAreaWidget from './TextAreaWidget'
import ImageWidget from './ImageWidget'
import { GridLayout, GridItem } from 'vue-grid-layout'
import GridView from './GridView'

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
    GridView,
    GridLayout,
    GridItem,
    TextWidget,
    TextAreaWidget,
    ImageWidget
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
        useCssTransforms: true,
        margin: [5, 5]
      },
      preview: true,
      contenteditable: false,
      active: false
    }
  },
  computed: {
    ...mapGetters(['getResources', 'getActiveItem'])
  },

  mounted () {
    // const gridItems = this.$refs.item

// Toggle Grid on
    this.disableGrid()

    const eventBus = this.$refs.layout.eventBus

    if (this.main) {
      console.log(eventBus.$on('dragEvent', (eventName, id, x, y, h, w) => {
        if (eventName === 'dragstart') {
          console.log(this.main ? 'main: ' : 'drawer: ', {eventName, id, x, y, h, w})
          if (this.main) {
            this.active = true
            eventBus.$emit('dragEnd')
            eventBus.$emit('dragStart', { item: this.getActiveItem })
          }
        }
        if (eventName === 'dragmove') {
          console.log(this.main ? 'main: ' : 'drawer: ', {eventName, id, x, y, h, w})
          let layoutRect = this.$el.getBoundingClientRect()

          let rect = layoutRect
          let mouse = {x: event.x, y: event.y}

          if (mouse.x >= rect.x && mouse.x <= rect.x + rect.width && mouse.y >= rect.y && mouse.y <= rect.y + rect.height) {
            if (!this.active) {
              this.active = true
              console.log('inside')
              this.addImageGridItem()
            }
          } else {
            console.log(this.main ? 'main: ' : 'drawer: ', {eventName, id, x, y, h, w})
            if (this.active) {
              this.active = false
              console.log('outside')
              const index = this.resources.findIndex(item => item.i === id)
              const item = {...{}, ...this.resources[index]}
              this.$refs.layout.isDragging = false
              this.$refs.layout.placeholder = {h: 0, i: -1, w: 0, x: 0, y: 0}

              this.removeItem({ key: index })

              eventBus.$emit('dragEnd', {item})
            }
          }
        }
        if (eventName === 'dragend') {
          this.active = false
          console.log({eventName, id, x, y, h, w})
        }
      }))
    }
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

    // Layout events
    mouseEnter (e) {
      console.log('mouseEnter', this.main ? 'main' : 'drawer')
      // this.active = true
      console.log(!this.getActiveItem)

      if (!this.getActiveItem) {
        console.log('No active Item')
      }
    },
    mouseLeave (e) {
      console.log('mouseLeave', this.main ? 'main' : 'drawer')
      // this.active = false
    },

    // Item events
    resizeEvent (e) {
      console.log('resizeEvent', e)
    },
    moveEvent (item) {
      this.setActiveItem({ item })
      console.log('moveEvent', item.i)
      // console.log('moveEvent', item, this.getActiveItem)
    },
    resizedEvent (e) {
      console.log('resizedEvent', e)
    },
    containerResizedEvent (e) {
      // console.log('containerResizedEvent', e)
    },
    movedEvent (e) {
      console.log('movedEvent', e)
    },
    dragEnter (e) {
      console.log('dragEnter', e)
      if (!this.active) {
        this.active = false
        this.addGridItem(this.getActiveItem)
        this.$emit('dragEnd')
      }
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
</style>
