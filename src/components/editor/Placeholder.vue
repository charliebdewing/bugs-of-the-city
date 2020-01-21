<template>
<div class="placeholder">
<select v-model="selected">
  <option disabled value="">Please select one</option>
  <option>Heading</option>
  <option>Text</option>
  <option>Image</option>
</select>
</div>
</template>
<script>
export default {
  props: {
  },
  data () {
    return {
      selected: null
    }
  },

  watch: {
    selected (to) {
      this.$emit('selected', to)
    }
  },
  methods: {
  }
}
</script>

<style scoped>
  [contenteditable]:focus {
    outline: 0px solid transparent;
  }


.placeholder {
  height: 100%;
  width: 100%;
  background: lightblue;
}
</style>
