<template>
  <div class="top-bar">
    <nav>
      <ul>
        <li>
          <router-link to="/" :active="'active'">Home</router-link>
        </li>
      </ul>
    </nav>
    <div class="servers-status">
      <span class="title">Server status:</span>
      <span class="server">Defaults elements: <status-icon :status="statusServerDefaults" /></span>
      <span class="server">Custom elements: <status-icon :status="statusServerCustom" /></span>
    </div>
  </div>
</template>

<script>
import StatusIcon from '../Jobs/StatusIcon/StatusIcon'
import axios from 'axios'

export default {
  data () {
    return {
      statusServerDefaults: 'pending',
      statusServerCustom: 'pending',
    }
  },
  components: {
    StatusIcon
  },
  beforeCreate () {
    axios.get('https://content-finder.herokuapp.com/')
      .then(() => {
        this.statusServerDefaults = 'active'
      })
      .catch(e => {
        console.log(e)
        this.statusServerDefaults = 'error'
      })

    axios.get('http://pistacja.kylos.net.pl:3000/')
      .then(() => {
        this.statusServerCustom = 'active'
      })
      .catch(e => {
        console.log(e)
        this.statusServerCustom = 'error'
      })
  }
}
</script>


<style lang="scss" scoped>
.top-bar {
  display: flex;
  align-items: center;
  margin-bottom: 50px;
}

nav {
  height: 60px;
  border-bottom: 1px solid #ddd;
  text-align: left;
  margin-right: 50px;
  ul {
    height: 100%;
    margin: 0;
    padding: 0;
    list-style: none;
    li {
      display: inline-block;
      height: 100%;
      a {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        padding: 0 15px;
        text-decoration: none;
        color: #2c3e50;
        transition: 0.3s all ease-in-out;
        &.router-link-exact-active, &:hover {
          color: #fff;
          background-color: #2c3e50;
        }
      }
    }
  }
}
.servers-status {
  display: flex;
  .title {
    font-weight: 700;
    margin-right: 20px;
  }
  .server {
    margin-right: 20px;
    display: flex;
    align-items: center;
    .status-icon {
      margin-left: 5px;
      width: 20px;
    }
  }
}
</style>

