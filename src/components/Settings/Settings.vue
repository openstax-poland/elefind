<template>
  <div class="settings">
    <h2 class="title">Settings</h2>
    <div class="form-group">
      <label>Select book to search in</label>
      <multiselect 
        v-model="selectedBook" 
        :options="booksList" 
        placeholder="Pick one"
        label="book_name"
        track-by="book_name">
      </multiselect>
    </div>
    <div class="form-group">
      <label>Select what you want to find</label>
      <multiselect
        v-model="selectedDefaultSelector"
        :options="defaultSelectors"
        placeholder="Pick one"
        :disabled="(selectedBook && !customSelector) ? false : true">
      </multiselect>
    </div>
    <div class="form-group" :class="{'error': !isValidSelector}">
      <label>or search for custom css selector</label>
      <input type="text" v-model="customSelector" placeholder='ex. [data-type="note"] > .title'>
      <span class="information">{{ invalidSelectorInformation.message }}</span>
    </div>
    <div class="form-group">
      <button 
        @click="getResults()" 
        class="send" 
        :disabled="!validateForm || isLoading">
        Get results
      </button>
      <transition name="fade" mode="out-in">
        <span v-if="showSuccess" class="success">Success</span>
      </transition>
      <transition name="fade" mode="out-in">
        <span v-if="invalidReason" class="invalid">{{ this.invalidReason }}</span>
      </transition>
    </div>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import axios from 'axios'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      showSuccess: false,
      invalidReason: '',
      selectedBook: '',
      booksList: [], // async GET
      avaliableSearchElements: [], // async GET
      defaultSelectors: [],
      selectedDefaultSelector: '',
      customSelector: '',
      isValidSelector: true,
      invalidSelectorInformation: ''
    }
  },
  watch: {
    selectedBook (book) {
      this.avaliableSearchElements.forEach(el => {
        if (el.book_name === book.book_name) {
          this.defaultSelectors = el.elements
        }
      })
    },
    customSelector (val) {
      const isValid = this.validateSelector(val)
      if (this.isValidSelector !== isValid) {
        this.isValidSelector = isValid
      }
    }
  },
  computed: {
    ...mapGetters({
      isLoading: 'isLoading',
    }),
    validateForm () {
      if (this.isValidSelector && this.selectedBook && (this.selectedDefaultSelector || this.customSelector)) {
        return true
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
    getResults () {
      this.$store.commit('setLoading', true)
      
      const payload = {
        config: {
          responseType: 'json'
        },
        params: {
          bookName: this.selectedBook.book_name,
          element: this.customSelector ? this.customSelector : this.selectedDefaultSelector
        }
      }

      const customElementsEndpoint = process.env.NODE_ENV === 'development' ?
      'http://localhost:3000/elements' :
      'http://pistacja.kylos.net.pl:3000/elements'

      const link = this.customSelector ? 
      customElementsEndpoint : 'https://content-finder.herokuapp.com/API/GetElementsNonCustom.do'

      axios.get(link, payload)
        .then(res => {
          const data = {
            bookName: payload.params.bookName,
            thumbnail: this.selectedBook.book_thumbnail,
            element: payload.params.element,
            results: res.data.Results
          }
          this.$store.commit('setResults', data)

          this.showSuccess = true
          setTimeout(() => {
            this.showSuccess = false
          }, 2000)

          localStorage.setItem('lastTimeSearch', new Date())
          this.$store.commit('setLoading', false)
        })
        .catch(e => {
          this.invalidReason = e.response.data ? e.response.data : e.response
          setTimeout(() => {
            this.invalidReason = ''
          }, 10000)

          return this.$store.commit('setLoading', false)
        })
    },
    clearForm () {
      this.selectedBook = ''
      this.selectedDefaultSelector = ''
      this.customSelector = ''
    }
  },
  components: {
    Multiselect,
  },
  beforeCreate() {
    const config = {
      responseType: 'json'
    }

    axios.get('https://content-finder.herokuapp.com/BooksAvaliable', config)
      .then(res => {
        return this.booksList = res.data.Books
      })
      .catch(e => {
        return e
      })

    axios.get('https://content-finder.herokuapp.com/API/AvaliableSearchElements', config)
      .then(res => {
        return this.avaliableSearchElements = res.data.Elements
      })
      .catch(e => {
        return e
      })
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
