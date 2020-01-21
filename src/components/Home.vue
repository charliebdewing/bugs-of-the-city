<template>
  <div class="container">
    <div>
      <new-grid-view
        ref="main"
        :layout="getResources"
        :main="true"
        @dragEnd="dropItem"
      />
    </div>
    <div
      class="drawer"
      :class="{hide: !drawerActive}"
      @mouseenter="drawerActive = true"
      @mouseleave="drawerActive = false"
    >
      <div
        v-for="(item, index) in drawer"
        :key="`item-${index}`"
        class="wrapper"
      >
        <!-- @mousedown="itemClicked(item)" -->
        <!-- <image-widget /> -->
        <text-widget
          v-if="item.type == 'title'"
          :item="item"
          :item-index="index"
        />

        <text-area-widget
          v-if="item.type == 'content'"
          :item="item"
          :item-index="index"
        />

        <image-widget
          v-if="item.type == 'image'"
          :item="item"
          :item-index="index"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import NewGridView from './editor/NewGridView'

import TextWidget from './editor/TextWidget'
import TextAreaWidget from './editor/TextAreaWidget'
import ImageWidget from './editor/ImageWidget'

export default {
  name: 'Home',
  components: { NewGridView, TextWidget, TextAreaWidget, ImageWidget },

  data() {
    return {
      isDraggable: true,
      drawer: [
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
      ],
      drawerActive: false
    }
  },


  computed: {
    ...mapGetters([
      'getResources'
    ])
  },


  created() {
    this.fetchResources()
  },

  methods: {
    ...mapActions({
      fetchResources: 'fetchResources',
      setActiveItem: 'setActiveItem',
      addGridItem: 'addGridItem'
    }),
    itemClicked(item) {
      console.log('itemClicked', item)
      this.addGridItem(item)
      // const eventBus = this.$refs.main.$refs.layout.eventBus

      // eventBus.$emit('dragStart', { item })
    },
    dragStart(item) {
      // console.log('dragEvent', {eventName: 'dragstart', item})

      // this.setActiveItem({item})
      // const eventBus = this.$refs.layout.eventBus
      // eventBus.$emit({eventName: 'dragstart', item})
    },
    dragEnter(e) {
      console.log('dragEnter', e)
      console.log('app')
    },
    dragOver(e) {
      console.log('dragOver', e)
    },
    dragEnd(e) {
      console.log('dragEnd', e)

      // const eventBus = this.$refs.layout.eventBus
      // eventBus.$emit('dragStart', { item: this.getActiveItem })
    },
    drag(e) {
      // console.log('drag', e)
    },
    drop(e) {
      e.preventDefault()
      console.log('drop', e)
    },

    dropItem(e) {
      console.log('dropItem', e)
    },

    // Drawer
    onDragStart(positionDiff, absolutePosition, event) {
      console.log(event)

      // console.log('left corner', absolutePosition.left)
      // console.log('top corner', absolutePosition.top)
    }

  }
}
</script>

<style>
.drawer {
  position: fixed;
  width: 10rem;
  height: 100vh;
  left: 0;
  top: 0;
  background: lightblue;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  user-select: none;
  transition: left 0.25s ease-in-out;
}

.drawer.hide {
  left: -8rem;
}

.wrapper {
  flex: 1 0 auto;
}

.vue-grid-layout {
  border: 1px solid lightgray;
}

</style>
