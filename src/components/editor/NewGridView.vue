<template>
  <div id="app">
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
          v-for="(grid, i) in layout"
          :key="`layout-${i}`"
          :grid="i"
          class="grid-layout"
          :ref="'gridLayout'"
          :layout.sync="grid"
          :col-num="colNum"
          :row-height="rowHeight"
          :is-draggable="true"
          :is-resizable="true"
          :is-mirrored="false"
          :vertical-compact="true"
          :margin="colMargin"
          :use-css-transforms="true"
        >
          <grid-item
            v-for="item in grid"
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
import VueGridLayout from 'vue-grid-layout'
let id = 0
export default {
  name: 'NewGridView',
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem
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
      layout: [
        [],
        []
      ]
    }
  },
  mounted() {
    let entered = false // 左侧的grid是否已经拖拽到右侧的drop area上方
    let { x: mainDX, y: mainDY } = this.$refs['gridLayout'][0].$el.getBoundingClientRect()
    let copy = null
    let movingGridDeltaY = 0 // 左侧拖拽的原始grid距顶部距离
    let _this = this
    let x = 0
    let y = 0
    let position = { x: 0, y: 0 }
    let activeGrid = null
    let activeItem = null
    interact('.item').draggable({
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
          let { x: _x, y: _y } = (_this.calcXY(position.y + movingGridDeltaY - mainDY, position.x - mainDX))
          x = _x
          y = _y
          if (entered) {
            let currentDragGridData = _this.layout[activeGrid][_this.layout[activeGrid].length - 1]
            currentDragGridData.x = x
            currentDragGridData.y = y
            _this.$refs['gridLayout'][activeGrid].eventBus.$emit('dragEvent', 'dragmove', id, x, y, _this.defaultGridH, _this.defaultGridW)
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
    //         activeItem = event.currentTarget.__vue__.$vnode.componentInstance
    //      }
    //     },
    //     move(event) {
    //       position.x += event.dx
    //       position.y += event.dy
    //       event.target.style.transform = `translate(${position.x}px, ${position.y}px)`
    //       event.target.style.outline = '1px dashed darkmagenta'
    //       let { x: _x, y: _y } = (_this.calcXY(position.y + movingGridDeltaY - mainDY, position.x - mainDX))
    //       x = _x
    //       y = _y

    //       if (entered) {
    //         let currentDragGridData = _this.layout[activeGrid][_this.layout[activeGrid].length - 1]
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
      accept: ['.template-item', 'vue-grid-item'],
      ondropactivate(event) {
        event.target.classList.add('drop-active')
      },
      ondragenter(event) {
        let isTemplate = event.relatedTarget.classList.contains('template-item')
        activeGrid = event.currentTarget.attributes.grid.value

        let activeItemId = isTemplate ? id : activeItem.i

        entered = true
        console.log('ondragenter', activeGrid, {isTemplate})

        let color = getComputedStyle(event.relatedTarget).backgroundColor

        if (isTemplate){
        _this.layout[activeGrid].push({
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
        let index = _this.layout[activeGrid].length - 1
        if (!activeItem) {
        _this.layout[activeGrid].splice(index, 1)
        }
      },
      ondrop() {
        entered = false
        let item = _this.layout[activeGrid][_this.layout[activeGrid].length - 1]
        item.isTemplate = false

//         if (activeItem) {
//           console.log(activeItem.$attrs.grid, activeGrid);
//           if (activeItem.$attrs.grid !== parseInt(activeGrid)) {

// let index = _this.layout[activeGrid].findIndex(item => item.i === activeItem.i)

//         _this.layout[activeGrid].splice(index, 1)
//           }
//           } else {
            id++
        // }

        activeGrid = null
        activeItem = null
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
      const placeholderGrid = this.$refs['gridLayout'][0].$children[0]
      return (placeholderGrid.containerWidth - (this.colMargin[0] * (this.colNum + 1))) / this.colNum
    }
  }
}
</script>

<style>
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

    #app {
      display: flex;
      position: relative;
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
