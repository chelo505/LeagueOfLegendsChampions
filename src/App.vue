<template>
<keep-alive>
<div class="app">
  <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
  </router-view>
</div>
</keep-alive>
</template>


<script>
export default {
  name: 'App'
};

</script>

<style>
* {
  margin: 0;
  padding: 0;
  scrollbar-width: none;
}
</style>
