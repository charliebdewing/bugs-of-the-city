<template>
  <div class="container">
    <div style="width: 930px; margin: 0 auto;">
      <grid-view ref="main" @dragEnd="dropItem" :main="true" :resources="getResources" />
      <div style="background: #FCE4EC; text-align: center; padding: 50px; margin: 50px 0; border-radius: 5px;">
        <h4> Grid Layout Editor made with <strong>Vue Js</strong> using <strong>Vue Grid Layout</strong> </h4>
        <div> Check out same project built with
           <strong><a href="http://gridstack.surge.sh/#/" target="_blank">GridStack.js</a></strong> for an eLearning use case.
        </div>
        <div> This R&amp;D project is developed to test grid-layout library for
          <strong> <a href="https://www.pariksha.io" target="_blank"> pariksha.io</a></strong>.
        </div>
        <div> Read <strong><a href="https://medium.com/@krutie/grid-layout-editor-for-vue-js-a-research-project-for-pariksha-io-e3445025d21e" target="_blank"> supporting medium article </a></strong> to learn more. </div>
      </div>
    </div>
    <div class="drawer">
      <div v-for="(item, index) in drawer" class="wrapper"
      @mousedown="itemClicked(item)"
       >
        <!-- <image-widget /> -->
        <text-widget
          v-if="item.type == 'title'"
          :item="item"
          :itemIndex="index"
        ></text-widget>

        <text-area-widget
          v-if="item.type == 'content'"
          :item="item"
          :itemIndex="index"
        ></text-area-widget>

        <image-widget
          v-if="item.type == 'image'"
          :item="item"
          :itemIndex="index"
        ></image-widget>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import GridView from './editor/GridView'

import TextWidget from './editor/TextWidget'
import TextAreaWidget from './editor/TextAreaWidget'
import ImageWidget from './editor/ImageWidget'

export default {
  name: 'home',
  components: {GridView, TextWidget, TextAreaWidget, ImageWidget},
  methods: {
    ...mapActions({
      fetchResources: 'fetchResources',
      setActiveItem: 'setActiveItem',
      addGridItem: 'addGridItem'
    }),
    itemClicked (item) {
      console.log('itemClicked', item)
      this.addGridItem(item)
      const eventBus = this.$refs.main.$refs.layout.eventBus

      eventBus.$emit('dragStart', { item })
    },
    dragStart (item) {
      console.log('dragEvent', {eventName: 'dragstart', item})
      // const eventBus = this.$refs.layout.eventBus

      this.setActiveItem({item})
      // eventBus.$emit('dragStart', { item })
    },
    dragEnter (e) {
      console.log('dragEnter', e)
      console.log('app')
    },
    dragOver (e) {
      console.log('dragOver', e)
    },
    dragEnd (e) {
      console.log('dragEnd', e)

      // const eventBus = this.$refs.layout.eventBus
      // eventBus.$emit('dragStart', { item: this.getActiveItem })
    },
    drag (e) {
      // console.log('drag', e)
    },
    drop (e) {
      e.preventDefault()
      console.log('drop', e)
    },

    dropItem () {
      console.log('dropItem')

      this.isDraggable = false

      this.$nextTick(() => {
        // this.isDraggable = true
      })
    }
  },
  created () {
    this.fetchResources()
  },

  data () {
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
      ]
    }
  },

  computed: {
    ...mapGetters([
      'getResources'
    ])
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
}

.wrapper {
  flex: 1 0 auto;
}
</style>
