<template>
  <div v-if="show" class="backdrop">
    <span class="close" @click="close()">X</span>
    <div class="content">
      <iframe width="760" height="515" src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen autoplay></iframe>
    </div>
  </div>
</template>

<script>
export default {
  props: ['show'],
  methods: {
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.backdrop {
  position: fixed;
  left:0;
  top: 0;
  z-index: 999;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;

  .close {
    position: absolute;
    top: 20px;
    right: 20px;
    color: #fff;
    padding: 20px;
    cursor: pointer;
  }
}
</style>




