<template>
  <div class="jobs">
    <h2 class="title">Jobs</h2>
    <div class="navigation">
      <div class="buttons">
        <button @click="activateTab('queue')" :class="{'active' : activeTab === 'queue'}">Queue</button>
        <button @click="activateTab('done')" :class="{'active' : activeTab === 'done'}">Done</button>
      </div>
      <div class="legend">
        <span class="legend-name">Active: </span>
        <status-icon :status="'active'"/>
        <span class="legend-name">Pending: </span>
        <status-icon :status="'pending'"/>
        <span class="legend-name">Done: </span>
        <status-icon :status="'done'"/>
        <span class="legend-name">Canceled: </span>
        <status-icon :status="'canceled'"/>
      </div>
    </div>
    <jobs-list
      v-if="activeTab === 'queue'"
      :jobs="jobsInQueue"
      @showResults="showResultsHandler"/>
    <jobs-list
      v-if="activeTab === 'done'"
      :jobs="doneJobs"
      @showResults="showResultsHandler"/>
  </div>
</template>

<script>
import JobsList from './JobsList/JobsList'
import StatusIcon from './StatusIcon/StatusIcon'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      activeTab: 'queue',
    }
  },
  computed: {
    ...mapGetters({
      'jobsInQueue': 'getJobsInQueue',
      'doneJobs': 'getDoneJobs'
    })
  },
  methods: {
    activateTab (tabName) {
      this.activeTab = tabName
    },
    showResultsHandler (jobId) {
      this.$emit('showResults', jobId)
    },
  },
  components: {
    JobsList,
    StatusIcon,
  }
}
</script>

<style lang="scss" scoped>
.jobs {
  width: 100%;
  .title {
    text-align: left;
  }
  .navigation {
    display: flex;
    justify-content: space-between;
    .buttons {
      button {
        cursor: pointer;
        background-color: transparent;
        border: none;
        padding: 20px;
        &.active {
          font-weight: bold;
          background-color: #f2f2f2;
        }
      }
    }
    .legend {
      display: flex;
      align-items: center;
      .legend-name {
        margin-right: 5px;
      }
      .status-icon {
        margin-right: 10px;
        width: 15px;
      }
    }
  }
  .tab {
    border: 1px solid #e8e8e8;
    border-radius: 5px;
    border-top-left-radius: 0;
    height: 300px;
    overflow: auto;
  }
}
</style>


