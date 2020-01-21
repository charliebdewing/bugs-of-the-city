<template>
  <div class="container">
    <aside>
      <div
        v-for="(item, idx) in templateItems"
        :key="idx"
        class="template-item item"
        grid="drawer"
        :style="{ background: item.color }"
      />
    </aside>
    <main ref="main" class="main">
        <grid-layout
          v-for="(layout, i) in layouts"
          :key="`layout-${i}`"
          :grid="i"
          class="grid-layout"
          :ref="'gridLayout'"
          :layout.sync="layout.items"
          :col-num="colNum"
          :row-height="rowHeight"
          :is-draggable="true"
          :is-resizable="true"
          :is-mirrored="false"
          :vertical-compact="false"
          :margin="colMargin"
          :use-css-transforms="true"
        >
          <grid-item
            v-for="item in layout.items"
            :key="item.i"
            class="item"
            ref="item"
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
          >
            <div
              v-show="!item.isTemplate"
              style="height: 100%; width: 100%;"
              :style="{ background: item.color }"
            >
              {{ item.i }}
            </div>
          </grid-item>
        </grid-layout>
    </main>
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
        {w:12, h: 12, x: 0, y:0, items:[]},
        {w:12, h: 12, x: 0, y:12, items:[]},
      ],
      activeGrid: null,
      activeItem: null
    }
  },

  computed: {

  },
  mounted() {
    let entered = false // 左侧的grid是否已经拖拽到右侧的drop area上方
    let copy = null
    let movingGridDeltaY = 0 // 左侧拖拽的原始grid距顶部距离
    let _this = this
    let x = 0
    let y = 0
    let position = { x: 0, y: 0 }

    interact('.template-item').draggable({
      inertia: true,
      listeners: {
        start(event) {
          copy = event.target.cloneNode(true)
          event.target.appendChild(copy)
          movingGridDeltaY = event.target.getBoundingClientRect().y
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
    // interact('.vue-grid-item').draggable({
    //   inertia: true,
    //   listeners: {
    //     start(event) {
    //       movingGridDeltaY = event.target.getBoundingClientRect().y

    //       console.log(event.currentTarget.__vue__);

    //       if (event.currentTarget.__vue__ !== undefined) {
    //         _this.activeItem = event.currentTarget.__vue__.$vnode.componentInstance
    //      }
    //     },
    //     move(event) {
    //       position.x += event.dx
    //       position.y += event.dy
    //       event.target.style.transform = `translate(${position.x}px, ${position.y}px)`
    //       event.target.style.outline = '1px dashed darkmagenta'
    //       let { x: _x, y: _y } = (_this.calcXY(position.y + movingGridDeltaY - _this.mainDY, position.x - _this.mainDX))
    //       x = _x
    //       y = _y

    //       if (entered) {
    //         let currentDragGridData = _this.layouts[activeGrid][_this.layouts[activeGrid].length - 1]
    //         currentDragGridData.x = x
    //         currentDragGridData.y = y
    //         _this.$refs['gridLayout'][activeGrid].eventBus.$emit('dragEvent', 'dragmove', id, x, y, _this.defaultGridH, _this.defaultGridW)
    //       }
    //     },
    //     end(event) {
    //       movingGridDeltaY = 0
    //       position = { x: 0, y: 0 }
    //       x = 0
    //       y = 0
    //     }
    //   }
    // })
    interact('.grid-layout').dropzone({
      accept: ['.template-item'],
      ondropactivate(event) {
        event.target.classList.add('drop-active')
      },
      ondragenter(event) {
        let isTemplate = event.relatedTarget.classList.contains('template-item')
        _this.activeGrid = event.currentTarget.attributes.grid.value

        let activeItemId = isTemplate ? id : _this.activeItem.i

        entered = true
        console.log('ondragenter', _this.activeGrid, {isTemplate})

        let color = getComputedStyle(event.relatedTarget).backgroundColor

        if (isTemplate){
        _this.layouts[_this.activeGrid].items.push({
          x,
          y,
          w: 2,
          h: 2,
          i: activeItemId,
          isTemplate,
          color
        })
        }

      },
      ondragleave() {
        entered = false
        let index = _this.layouts[_this.activeGrid].items.length - 1
          _this.layouts[_this.activeGrid].items.splice(index, 1)
      },
      ondrop() {
        entered = false
        let item = _this.layouts[_this.activeGrid].items[_this.layouts[_this.activeGrid].items.length - 1]
        item.isTemplate = false

//         if (activeItem) {
//           console.log(activeItem.$attrs.grid, activeGrid);
//           if (activeItem.$attrs.grid !== parseInt(activeGrid)) {

// let index = _this.layouts[activeGrid].findIndex(item => item.i === activeItem.i)

//         _this.layouts[activeGrid].splice(index, 1)
//           }
//           } else {
            id++
        // }

        _this.activeGrid = null
       _this.activeItem = null
      },
      ondropdeactivate(event) {
        event.target.classList.remove('drop-active')
      }
    })
  },
  methods: {
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
        console.log('no gridLayout');
        return this.$refs['main'].getBoundingClientRect().x
      }
    },
    mainDY() {
      try {
        return this.$refs['gridLayout'][this.activeGrid ? this.activeGrid : 0].$el.getBoundingClientRect().y
      } catch (error) {
        console.log('no gridLayout');
        return this.$refs['main'].getBoundingClientRect().y
      }
    },
  }
}
</script>

<style>
.container {
  display: flex;
}

aside {
  width: 180px;
  height: 800px;
  padding: 10px;
  border: 1px solid salmon;
  margin-right: 20px;
  z-index: 100;
}

main {
  border: 1px solid skyblue;
  height: 800px;
  flex: 1;
}

main.drop-active {
  border: 2px dashed skyblue;
}

.vue-grid-layout {
  border: 1px solid black;
  min-height: 10rem;
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
