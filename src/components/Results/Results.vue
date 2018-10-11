<template>
  <div class="results">
    <h2 class="title"><status-icon :status="data.status"/> {{ data.book_name }} search for: {{ data.elements }}</h2>
    <div class="navigation">
      <div class="buttons">
        <button 
          @click="goBack"
        >
          <svg aria-hidden="true" data-prefix="far" data-icon="caret-circle-left" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-caret-circle-left fa-w-16 fa-3x"><path fill="currentColor" d="M296 157.1v197.8c0 10.7-13 16.1-20.5 8.5l-98.3-98.9c-4.7-4.7-4.7-12.2 0-16.9l98.3-98.9c7.5-7.7 20.5-2.3 20.5 8.4zM256 504C119 504 8 393 8 256S119 8 256 8s248 111 248 248-111 248-248 248zm0-48c110.5 0 200-89.5 200-200S366.5 56 256 56 56 145.5 56 256s89.5 200 200 200z" class=""></path></svg>
          Back
        </button>
      </div>
      <span class="found-results">Found {{ data.results.length }} matching elements.</span>
    </div>
    <div class="tab">
      <ul>
        <li
          v-if="data.status === 'done'"
          v-for="(res, index) in data.results"
          :key="index"
        >
          <span class="element">Element: {{ res.element }}</span>
          <span class="module">Found in: {{ res.module }}</span>
          <span class="link"><a :href="res.link" target="_blank" rel="nofollow" title="Open in new tab">{{ res.link }}</a></span>
        </li>
        <li v-else>
          Status: {{ data.status }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import StatusIcon from '../Jobs/StatusIcon/StatusIcon'

export default {
  props: ['data'],
  methods: {
    goBack () {
      this.$emit('closeJobResults')
    }
  },
  components: {
    StatusIcon,
  }
}
</script>

<style lang="scss" scoped>
.results {
  width: 100%;
  .title {
    display: inline-flex;
    width: 100%;
    justify-content: flex-start;
    align-items: center;
    .status-icon {
      margin-right: 10px;
      width: 20px;
      svg {
        width: 20px !important;
      }
    }
  }
  .navigation {
    display: flex;
    justify-content: space-between;
    .buttons {
      button {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        background-color: transparent;
        border: none;
        padding: 20px;
        &:hover {
          background-color: #f2f2f2;
        }
        svg {
          width: 20px;
          margin-right: 10px;
        }
      }
    }
    .found-results {
      display: inline-flex;
      justify-content: center;
      align-items: center;
    }
  }
  .tab {
    border: 1px solid #e8e8e8;
    border-radius: 5px;
    border-top-left-radius: 0;
    height: 300px;
    overflow: auto;
    ul {
      padding: 0;
      margin: 0;
      list-style: none;
      li {
        width: 100%;
        padding: 10px 0;
        border-bottom: 1px solid #e8e8e8;
        text-align: left;
        &:hover {
          background-color: #f2f2f2;
        }
        .element {
          margin-left: 10px;
          margin-right: 10px;
        }
        .module {
          margin-right: 10px;
        }
        .link {
          float: right;
          margin-right: 10px;
        }
      }
    }
  }
}
</style>
