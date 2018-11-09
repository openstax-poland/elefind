<template>
  <div class="results">
    <div class="title">
      <img v-if="!isLoading && data.thumbnail" :src="data.thumbnail" class="thumbnail">
      <h2 v-if="!isLoading"><status-icon v-if="false" :status="data.status"/> {{ data.bookName }} search for: {{ data.element }}</h2>
      <h2 v-else>Loading...</h2>
    </div>
    <div class="navigation">
      <div class="buttons">
        <button
          v-if="false"
          @click="goBack"
        >
          <svg aria-hidden="true" data-prefix="far" data-icon="caret-circle-left" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-caret-circle-left fa-w-16 fa-3x"><path fill="currentColor" d="M296 157.1v197.8c0 10.7-13 16.1-20.5 8.5l-98.3-98.9c-4.7-4.7-4.7-12.2 0-16.9l98.3-98.9c7.5-7.7 20.5-2.3 20.5 8.4zM256 504C119 504 8 393 8 256S119 8 256 8s248 111 248 248-111 248-248 248zm0-48c110.5 0 200-89.5 200-200S366.5 56 256 56 56 145.5 56 256s89.5 200 200 200z" class=""></path></svg>
          Back
        </button>
      </div>
      <span v-if="!isLoading" class="found-results">Found {{ data.instances }} elements on {{ data.results ? data.results.length : 0 }} pages.</span>
      <span v-else class="found-results">...</span>
    </div>
    <div class="tab">
      <div v-if="!isLoading">
        <ul v-if="data.results">
          <li
            v-for="(res, index) in data.results"
            :key="index"
          >
            <span class="module" :title="res.section_name">Found {{ (res.instances && res.instances > 1) ? res.instances + ' instances' : '1 instance' }} in: {{ res.section_name }}</span>
            <span v-if="res.link" class="link"><a :href="res.link" target="_blank" rel="nofollow" title="Open in new tab">{{ res.link }}</a></span>
          </li>
        </ul>
        <span style="display:block; padding-top: 10px;" v-else>Nothing was found.</span>
      </div>
      <div v-else class="is-loading">
        <spinner :isLoading="isLoading"/>
      </div>
    </div>
  </div>
</template>

<script>
import StatusIcon from '../Jobs/StatusIcon/StatusIcon'
import Spinner from '../Spinner/Spinner'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      'data': 'results',
      'isLoading': 'isLoading',
    })
  },
  methods: {
    goBack () {
      this.$emit('closeJobResults')
    }
  },
  components: {
    StatusIcon,
    Spinner,
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
    .thumbnail {
      width: 100px;
      margin-right: 10px;
    }
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
    .is-loading {
      margin-top: 20px;
    }
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
          width: 10%;
          margin-right: 10px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .module {
          margin-left: 10px;
          width: 50%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: inline-block;
        }
        .link {
          float: right;
          margin-right: 10px;
          width: 40%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: right;
        }
      }
    }
  }
}
</style>
