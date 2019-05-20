<template>
  <div class="tab">
    <ul>
      <li
        v-for="job in jobs"
        :key="job.id"
        :class="job.status"
        :title="job.book_name.replace(/_/g, ' ') + ' | ' + job.element"
        @click="handleJobClick(job)"
      >
        <span
          class="book-name"
        >
          {{ job.book_name.replace(/_/g, ' ') }}
        </span>
        <span
          class="elements"
        >
          Search for: {{ job.element }}
        </span>
        <span
          v-if="job.results"
          class="instances"
        >
          Found {{ typeof job.results.instances === 'number' ? job.results.instances : 'unknow' }} instances
        </span>
        <span
          v-if="job.error"
          class="error-info"
        >
          Error: {{ job.error }} Click here to restart.
        </span>
        <span
          class="status"
        >
          Status: <status-icon :status="job.status"/>
        </span>
        <span
          v-if="job.status === 'pending'"
          class="time"
        >
          Started {{ timeFromStart(job.start_date) }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
import StatusIcon from '../StatusIcon/StatusIcon'

export default {
  props: ['jobs'],
  methods: {
    timeFromStart (date) {
      const now = new Date()
      return this.msToMinutes(now.getTime() - date.getTime())
    },
    msToMinutes (ms) {
      const s = ms / 1000
      if (s < 60) {
        return 'just now.'
      } else {
        return `about ${parseInt(s/60)} minute${(s/60) > 1 ? 's' : ''} ago.`
      }
    },
    handleJobClick (job) {
      if (job.status === 'ok') {
        this.$emit('showResults', job.id)
      } else if (job.status === 'error') {
        this.$store.dispatch('refreshJob', job)
      }
    }
  },
  components: {
    StatusIcon
  }
}
</script>

<style lang="scss" scoped>
.tab {
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    li {
      cursor: pointer;
      width: 100%;
      padding: 10px 0;
      border-bottom: 1px solid #e8e8e8;
      text-align: left;
      &:hover {
        background-color: #f2f2f2;
      }
      .book-name {
        font-weight: 700;
        margin-left: 10px;
        margin-right: 10px;
      }
      .elements {
        margin-right: 10px;
        max-width: 400px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .status {
        float: right;
        margin-right: 10px;
        display: inline-flex;
        align-items: center;
        .status-icon {
          margin-left: 10px;
          width: 15px;
        }
      }
      .time {
        float: right;
        margin-right: 10px;
      }
    }
  }
}
</style>
