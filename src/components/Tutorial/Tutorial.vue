<template>
  <div class="backdrop">
    <span class="close" @click="close()">X</span>
    <div class="content">
      <h1>How to search for custom element</h1>
      <p>To target specific elements in book we use css selectors. <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors" target="_blank">There is detailed article about them.</a></p>
      <h2>Fast explanation:</h2>
      <p>
        Let assume that you found element in a book and you want to find the same element in other places. You just have to <strong>right click</strong> on this element, then <strong>hit "Inspect element"</strong>. Developer Console should appear. Now you can check what classes or attributes this element have.
      </p>
      <div class="example">
        <img src="../../assets/class.png">
        <p>
          Use dot <strong>.</strong> to target elements with specific class: <strong>.visual-connection</strong>
        </p>
      </div>
      <div class="example">
        <img src="../../assets/attribute.png">
        <p>
          Use square brackets <strong>[ ]</strong> to target elements with specific attribute: <strong>[data-type="problem"]</strong>
        </p>
      </div>
      <div class="example">
        <img src="../../assets/element.png">
        <p>
          Use element name to target all elements with specific name: <strong>figure</strong>
        </p>
      </div>

      <h2>More advanced examples:</h2>
      <div class="example">
        <p>
          Search for tables with images: <strong>table:has(img)</strong>
          <br>
          Search for tables inside Solution containers<strong>.os-solution-container:has(table)</strong>
        </p>
      </div>
      <div class="example">
        <p>
          Search for element which has multiple classes: <strong>.class1.class2</strong>
          <br>
          This selector will find elements which has both: <strong>class1</strong> and <strong>class2</strong>
        </p>
      </div>
      <div class="example">
        <p>
          Search for all elements which has one of the classes: <strong>.classA, .classB, .classC</strong>
        </p>
      </div>
      <div class="example">
        <p>
          Search for elements inside specific elements: <strong>table img</strong>
          <br>
          This selector will find <strong>img</strong>es which are inside <strong>table</strong>
        </p>
      </div>
      <p>More examples at <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors" target="_blank">https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors</a></p>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    close () {
      this.$emit('close')
    }
  },
  created() {
    document.getElementsByTagName('body')[0].style.overflow = 'hidden'
  },
  beforeDestroy() {
    document.getElementsByTagName('body')[0].style.overflow = null
  },
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

  .close {
    position: absolute;
    top: 20px;
    right: 20px;
    color: #fff;
    padding: 20px;
    cursor: pointer;
  }

  .content {
    width: 80%;
    max-width: 800px;
    margin: 50px auto;
    background-color: #fff;
    font-size: 18px;
    overflow: auto;
    border-radius: 4px;

    img {
      display: block;
      margin: 10px auto;
      max-width: 100%;
    }

    p {
      line-height: 1.4;
    }

    .example {
      width: calc(100% - 60px);
      padding: 10px;
      border: 1px solid #444;
      margin: 20px auto;
    }
  }
}
</style>
