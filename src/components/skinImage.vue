<template>
<div class="app">
    <div class="imageContainer">
    <img :src="require(`@/assets/championSkins/${this.championId}_${this.skinNum}.jpg`)" class="skinImage">
    </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      championId: null,
      skinNum: null
    }
  },
  created() {
    this.championId = this.$route.query.championId;
    this.skinNum = this.$route.query.skinNum;
  },
  
}
</script>


<style>
body {
  background-color: rgb(24, 24, 24);
}

.imageContainer {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.skinImage {
    margin-top: 15.5px;
    width: 1518.75px;
    height: 896.25px;
    overflow: hidden;
}
</style>