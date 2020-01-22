<template>
  <div class="container">
    <aside :class="{hide}" @mouseenter="hide = false" @mouseleave="hide = true">
      <div
        v-for="(item, idx) in templateItems"
        :key="idx"
        class="template-item item"
        :class="{grid: item.type === 'grid'}"
        grid="drawer"
        :style="{ background: item.color, border: item.border }"
      />
    </aside>
    <button @click="addLayout('top')"> Add layout </button>
    <div class="wrapper">
      <grid-layout
        ref="main"
        class="main"
        :layout.sync="layouts"
        :col-num="colNum"
        :row-height="rowHeight"
        :is-draggable="true"
        :is-resizable="false"
        :is-mirrored="false"
        :vertical-compact="true"
        :breakpoints="{ lg: 996, md: 786, sm: 768, xs: 480, xxs: 0 }"
        :cols="{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }"
        :margin="[0,0]"
        :auto-size="false"
        @container-resized="mainContainerResized"
        @resize="mainContainerResized"
      >
        <grid-item
          v-for="(layout, i) in layouts"
          :key="`layout-${i}`"
          :x="layout.x"
          :y="layout.y"
          :w="layout.w"
          :h="layout.h"
          :i="layout.i"
          :is-draggable="true"
          :is-resizable="true"
          :drag-allow-from="'.drag-handle'"
          @container-resized="mainContainerResized"
        >
          <div
            class="layout-wrapper"
            @mouseenter="canDrag = i"
            @mouseleave="canDrag = null"
          >
            <grid-layout
              :ref="'gridLayout'"
              :grid="i"
              class="grid-layout section"
              :layout.sync="layout.items"
              :col-num="colNum"
              :row-height="rowHeight"
              :is-draggable="true"
              :is-resizable="true"
              :is-mirrored="false"
              :responsive="true"
              :vertical-compact="false"
              :margin="colMargin"
              :use-css-transforms="true"
              :prevent-collision="true"
              :breakpoints="{ lg: 996, md: 786, sm: 768, xs: 480, xxs: 0 }"
              :cols="{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }"
              :style="{ background: layout.color }"
              :auto-size="false"
            >
              <div class="drag-handle" :class="{'can-drag' : canDrag === i}">
                <i class="fa fa-arrows" aria-hidden="true" />
              </div>
              <grid-item
                v-for="item in layout.items"
                :key="item.i"
                ref="item"
                class="item"
                :grid="i"
                :is-draggable="!item.isTemplate"
                :is-resizable="!item.isTemplate"
                :x="item.x"
                :y="item.y"
                :w="item.w"
                :h="item.h"
                :i="item.i"
                :style="{ outline: item.isTemplate ? '2px dashed darkmagenta' : '' }"
                @click="editorShow = true"
                @container-resized="containerResized"
              >
                <!-- @move="moveEvent(i, item)"
              @moved="movedEvent" -->
                <div
                  v-show="!item.isTemplate"
                  style="height: 100%; width: 100%;"
                  :style="{ background: item.color }"
                >
                  {{ item.i }}
                </div>
              </grid-item>
            </grid-layout>
          </div>
        </grid-item>
      </grid-layout>
    </div>
    <button @click="addLayout('bottom')"> Add layout </button>
  </div>
</template>

<script>
import interact from 'interactjs'
import VueGridlayout from 'vue-grid-layout'
let id = 0
export default {
  name: 'NewGridView',
  components: {
    Gridlayout: VueGridlayout.Gridlayout,
    GridItem: VueGridlayout.GridItem
  },
  data() {
    return {
      // ------------------------ //
      rowHeight: 30,
      colNum: 12,
      colMargin: [10, 10],
      defaultGridW: 2,
      defaultGridH: 2,
      maxRows: Infinity,
      // ------------------------ //
      templateItems: [
        {
          color: 'aqua'
        },
        {
          color: 'salmon'
        }

      ],
      layouts: [
        { w: 12, h: 10, x: 0, y: 0, i: 0, items: [{ w: 2, h: 2, x: 0, y: 0, i: 0, color: 'salmon' }], color: 'lightgreen' },
        { w: 12, h: 10, x: 0, y: 10, i: 1, items: [], color: '#fff7bd' }
      ],
      activeGrid: null,
      activeItem: null,
      hide: true,
      heightBeforeMove: null,
      canDrag: false
    }
  },

  computed: {

  },
  mounted() {
    this.registerInteractions()
  },
  methods: {
    registerInteractions() {
      let entered = false
      let copy = null
      let movingGridDeltaY = 0
      let _this = this
      let x = 0
      let y = 0
      let position = { x: 0, y: 0 }


      // Copy drag move emitted value

      interact('.template-item').draggable({
        inertia: true,
        listeners: {
          start(event) {
            copy = event.target.cloneNode(true)
            event.target.appendChild(copy)
            movingGridDeltaY = event.target.getBoundingClientRect().y
            _this.hide = true
          },
          move(event) {
            position.x += event.dx
            position.y += event.dy
            copy.style.transform = `translate(${position.x}px, ${position.y}px)`
            copy.style.outline = '1px dashed darkmagenta'
            let { x: _x, y: _y } = (_this.calcXY(position.y + movingGridDeltaY - _this.mainDY(), position.x - _this.mainDX()))
            x = _x
            y = _y
            if (entered) {
              let currentDragGridData = _this.layouts[_this.activeGrid].items[_this.layouts[_this.activeGrid].items.length - 1]
              currentDragGridData.x = x
              currentDragGridData.y = y
              _this.$refs['gridLayout'][_this.activeGrid].eventBus.$emit('dragEvent', 'dragmove', id, x, y, _this.defaultGridH, _this.defaultGridW)
            }
          },
          end(event) {
            event.target.removeChild(copy)
            copy = null
            movingGridDeltaY = 0
            position = { x: 0, y: 0 }
            x = 0
            y = 0
          }
        }
      })
      interact('.grid-layout').dropzone({
        accept: ['.template-item'],
        ondropactivate(event) {
          event.target.classList.add('drop-active')
        },
        ondragenter(event) {
          let isTemplate = event.relatedTarget.classList.contains('template-item')
          _this.activeGrid = event.currentTarget.attributes.grid.value

          entered = true
          console.log('ondragenter', _this.activeGrid, { isTemplate })

          let color = getComputedStyle(event.relatedTarget).backgroundColor

          _this.layouts[_this.activeGrid].items.push({
            x,
            y,
            w: 2,
            h: 2,
            i: id++,
            isTemplate,
            color
          })
        },
        ondragleave() {
          entered = false
          let index = _this.layouts[_this.activeGrid].items.length - 1
          _this.layouts[_this.activeGrid].items.splice(index, 1)
        },
        ondrop() {
          //   entered = false
          //   let item = _this.layouts[_this.activeGrid].items[_this.layouts[_this.activeGrid].items.length - 1]
          //   item.isTemplate = false
          //   id++
          //  _this.activeItem = null
          console.log(_this.activeGrid)
          entered = false
          _this.layouts[_this.activeGrid].items[_this.layouts[_this.activeGrid].items.length - 1].isTemplate = false
          _this.activeGrid = null
        },
        ondropdeactivate(event) {
          event.target.classList.remove('drop-active')
        }
      })
    },

    calcXY(top, left) {
      const colWidth = this.calcColWidth()

      let x = Math.round((left - this.colMargin[0]) / (colWidth + this.colMargin[0]))
      let y = Math.round((top - this.colMargin[1]) / (this.rowHeight + this.colMargin[1]))
      // Capping
      x = Math.max(Math.min(x, this.colNum - this.defaultGridW), 0)
      y = Math.max(Math.min(y, this.maxRows - this.defaultGridH), 0)
      return { x, y }
    },
    calcColWidth() {
      const placeholderGrid = this.$refs['gridLayout'][this.activeGrid ? this.activeGrid : 0].$children[0]
      return (placeholderGrid.containerWidth - (this.colMargin[0] * (this.colNum + 1))) / this.colNum
    },

    mainDX() {
      try {
        return this.$refs['gridLayout'][this.activeGrid ? this.activeGrid : 0].$el.getBoundingClientRect().x
      } catch (error) {
        console.log('no gridLayout')
        return this.$refs['main'].$el.getBoundingClientRect().x
      }
    },
    mainDY() {
      try {
        return this.$refs['gridLayout'][this.activeGrid ? this.activeGrid : 0].$el.getBoundingClientRect().y
      } catch (error) {
        console.log('no gridLayout')
        return this.$refs['main'].$el.getBoundingClientRect().y
      }
    },
    addLayout(area) {
      if (area === 'bottom') {
        const lastLayout = this.layouts[this.layouts.length - 1]
        const y = lastLayout.y + lastLayout.h
        this.layouts.push(
          { w: 12, h: 12, x: 0, y, i: lastLayout.i + 1, items: [] }
        )
      } else {
        const firstLayout = this.layouts[0]
        firstLayout.y++
        this.layouts.unshift(
          { w: 12, h: 5, x: 0, y: 0, i: this.layouts.length + 1, items: [] }
        )
      }
    },
    getNestedGridHeight(index) {
      try {
        return this.$refs['gridLayout'][index].h
      } catch (error) {
        return this.layouts[index].h
      }
    },

    moveEvent(layoutIndex, item) {
      console.log({ layoutIndex }, item.y, item.h)

      const layout = this.layouts[layoutIndex]

      this.heightBeforeMove = this.heightBeforeMove ? this.heightBeforeMove : layout.h

      const itemBottomEdge = item.y + item.h + 2

      console.log(this.heightBeforeMove, layout.h, itemBottomEdge)
      // const bottomItem = layout.items.reduce((acc, item) => (acc.y + acc.h > item.y + item.h) ? acc : item)

      if (this.heightBeforeMove < itemBottomEdge) {
        const newH = this.heightBeforeMove < itemBottomEdge ? itemBottomEdge : this.heightBeforeMove

        console.log({ newH })

        this.$set(this.layouts[layoutIndex], 'h', newH)
        layout.h = newH

        this.$refs['main'].resizeEvent('resizemove', layout.i, layout.x, layout.y, layout.h, layout.w)
      }
      // this.$refs['main'].updateHeight()
    },

    movedEvent(i, newX, newY) {
      console.log(i, newX, newY)
    },
    containerResized(layoutIndex, itemId, newH, newW, newHPx, newWPx) {
      console.log('containerResized', { layoutIndex, itemId, newH, newW, newHPx, newWPx })
    },

    mainContainerResized(layoutIndex, newH, newW, newHPx, newWPx) {
      console.log('mainContainerResized', { layoutIndex, newH, newW, newHPx, newWPx })
    },

    resizedEvent() {
      console.log('resized')
    }
  }
}
</script>

<style>
.container {
  display: flex;
  align-items: stretch;
}

aside {
  width: 180px;
  padding: 10px;
  border: 1px solid salmon;
  margin-right: 20px;
  z-index: 100;
  position: fixed;
  top: 0;
  left: 0;
  background: lightblue;
  height: 100vh;
  transition: transform 0.25s ease-in-out;
}

aside.hide {
  transform: translateX(-90%);
}

.wrapper {
  flex: 1;
}

.main {
  border: 1px solid skyblue;
  flex: 1;
}

.main.drop-active {
  border: 2px dashed skyblue;
}

.layout-wrapper {
  flex: 1;
  height: 100%;
}

.vue-grid-layout.section {
  border: 1px solid black;
  min-height: 100%;
  height: 100%;
}


.drag-handle {
  position: absolute;
  top: 0;
  right: 4px;
  opacity: 0.2;
  transition: opacity 0.2s ease-in-out;
}

.drag-handle.can-drag {
  opacity: 1;
}


.item {
  user-select: none;
}

.template-item {
  touch-action: none;
  user-select: none;
  margin-bottom: 10px;
  height: 100px;
}

.vue-grid-item {
  touch-action: none;
  user-select: none;
}

.editor {
  position: absolute;
  top: 10px;
  right: 10px;
  height: 800px;
  width: 200px;
  border: 1px solid darkmagenta;
}

.drop-active /deep/ .vue-grid-item.vue-grid-placeholder {
  display: none;
}


</style>
