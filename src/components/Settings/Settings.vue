<template>
  <div class="settings">
    <h2 class="title">Settings</h2>
    <div class="form-group">
      <label>Select books to search in</label>
      <multiselect 
        v-model="selectedBooks" 
        :options="booksList" 
        :close-on-select="false"
        :multiple="true"
        :clear-on-select="false"
        placeholder="Pick some"
        label="name"
        track-by="name">
      </multiselect>
    </div>
    <div class="form-group">
      <label>Select what you want to find</label>
      <multiselect 
        v-model="selectedDefaultSelectors" 
        :options="defaultSelectors" 
        :close-on-select="false"
        :multiple="true"
        :clear-on-select="false"
        placeholder="Pick some"
        label="name"
        track-by="name">
      </multiselect>
    </div>
    <div class="form-group" :class="{'error': !isValidSelector}">
      <label>or search for custom css selector</label>
      <input type="text" v-model="customSelector" placeholder='ex. [data-type="note"] > .title'>
      <span class="information">{{ invalidSelectorInformation.message }}</span>
    </div>
    <div class="form-group">
      <button 
        @click="send" 
        class="send" 
        :disabled="!validateForm">
        Start new job
      </button>
      <transition name="fade" mode="out-in">
        <span v-if="showSuccess" class="success">Job was added</span>
      </transition>
      <transition name="fade" mode="out-in">
        <span v-if="invalidReason" class="invalid">{{ this.invalidReason }}</span>
      </transition>
    </div>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'

export default {
  data () {
    return {
      showSuccess: false,
      invalidReason: '',
      selectedBooks: [],
      booksList: [
        {
          name: 'Biology',
        },
        {
          name: 'Physics',
        },
        {
          name: 'Algebra',
        }
      ],
      selectedDefaultSelectors: [],
      defaultSelectors: [
        {
          name: 'tables',
        },
        {
          name: 'footnotes',
        },
        {
          name: 'notes',
        }
      ],
      customSelector: '',
      isValidSelector: true,
      invalidSelectorInformation: ''
    }
  },
  watch: {
    customSelector (val) {
      const isValid = this.validateSelector(val)
      if (this.isValidSelector !== isValid) {
        this.isValidSelector = isValid
      }
    }
  },
  computed: {
    validateForm () {
      if (this.isValidSelector) {
        if (this.selectedBooks.length > 0) {
          if (this.selectedDefaultSelectors.length || this.customSelector) {
            return true
          }
        }
      }
      return false
    }
  },
  methods: {
    validateSelector (selector) {
      if (!selector) return true

      try {
        document.querySelector(selector)
        return true
      } catch(e) {
        this.invalidSelectorInformation = e
      }

      return false
    },
    send () {
      if (this.validateForm) {
        let lastTimeSearch = localStorage.getItem('lastTimeSearch')
        const now = new Date()

        // user can search for every 2 minutes
        if (lastTimeSearch) {
          lastTimeSearch = new Date(lastTimeSearch)
          if ((now.getTime() - lastTimeSearch.getTime()) < (1000 * 60 * 2)) {
            this.invalidReason = 'You can start new job every 2 minutes.'
            return false
          }
        }

        this.invalidReason = ''
        console.log('start')
        
        let elementsToSearch = [...this.selectedDefaultSelectors].map(el => el.name)
        elementsToSearch.push(this.customSelector)

        this.selectedBooks.forEach(book => {
          const newJob = {
            book_id: 'book_id',
            book_name: book.name,
            elements: elementsToSearch
          }
          this.$store.commit('addNewJob', newJob)
        })

        this.clearForm()
        this.$emit('showJobs')
        this.showSuccess = true
        setTimeout(() => {
          this.showSuccess = false
        }, 2000)

        localStorage.setItem('lastTimeSearch', now)
      }
    },
    clearForm () {
      this.selectedBooks = []
      this.selectedDefaultSelectors = []
      this.customSelector = ''
    }
  },
  components: {
    Multiselect,
  }
}
</script>

<style lang="scss" scoped>
.title {
  text-align: left;
}

.settings {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.form-group {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  text-align: left;
  width: 300px;
  margin-bottom: 30px;
  label {
    font-size: 18px;
    margin-bottom: 10px;
  }
  input {
    box-sizing: content-box;
    display: block;
    position: relative;
    width: 100%;
    max-width: 282px;
    text-align: left;
    color: #35495e;
    border: 1px solid #e8e8e8;
    border-radius: 5px;
    padding: 11px 8px;
    font-size: 14px;
  }
  .information {
    opacity: 0;
    position: absolute;
    bottom: -20px;
    font-size: 14px;
    color: #e53f3f;
    transition: 0.3s opacity ease-in-out;
  }
  &.error {
    .information {
      opacity: 1;
    }
  }
}

button.send {
  cursor: pointer;
  color: #fff;
  background-color: #28a745;
  border: none;
  border-radius: 5px;
  padding: 12px 0;
  transition: 0.3s all ease-in-out;
  &:hover {
    background-color: #218838;
  }
  &:disabled {
    cursor: not-allowed;
    color: #333;
    background-color: #e8e8e8;
  }
}

.success {
  margin-top: 5px;
  font-size: 14px;
  color: #218838;
}

.invalid {
  margin-top: 5px;
  font-size: 14px;
  color: #e53f3f;
}
</style>
