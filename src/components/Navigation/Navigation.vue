<template>
  <nav>
    <ul>
      <li>
        <router-link to="/" :active="'active'">Home</router-link>
      </li>
    </ul>
  </nav>
</template>

<style lang="scss" scoped>
nav {
  height: 60px;
  border-bottom: 1px solid #ddd;
  text-align: left;
  margin-bottom: 50px;
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
</style>

