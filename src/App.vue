<template>
  <div class="search-container">
    <input 
      type="text" 
      v-model="searchQuery" 
      placeholder="Search champions..." 
      class="search-input"
      @input="searchChampions"
    />
    <div v-if="searchResults.length > 0" class="search-results">
      <div 
        v-for="result in searchResults" 
        :key="result.name" 
        class="search-result-item"
        @click="scrollToChampion(result)"
      >
        {{ result.name }}
      </div>
    </div>
  </div>
  <ul>
    <li v-for="(champion, index) in champions" 
    :key="index"
    :ref="`${champion.name}`">
      <h2 id="champName">{{ champion.name }}</h2>
      <h3 id="champTitle">{{ champion.title }}</h3>
      <p id="champLore">{{ champion.lore }}</p>
      <img :src="require(`@/assets/championImages/${champion.image.full}`)" id="champIcon"/>
      <h2>Skins:</h2>
      <ul>
        <li 
          v-for="skin in champion.skins" 
          :key="skin.id" 
          id="champSkins"
          @mouseenter="showSkinHover(skin)"
          @mouseleave="hideSkinHover"
          class="skin-item relative"
        >
          {{ skin.name }}
          <div 
            v-if="hoveredSkin === skin" 
            class="skin-hover-window"
          >
            <img 
              :src="getSkinImage(champion.id, skin.num)" 
              :alt="`${skin.name}`" 
              class="skin-preview-image"
            
            />
          </div>
        </li>
      </ul>
    </li>
  </ul>
</template>


<script>
export default {
  data() {
    return {
      champions: [],
      hoveredSkin: null,
      searchQuery: '',
      searchResults: []
    }
  },
  created() {
    this.loadChampionData();
  },
  methods: {
    loadChampionData() {
      const context = require.context('@/assets/champions', false, /\.json$/);

      const loadedChampions = [];

      context.keys().forEach((fileName) => {
        const championData = context(fileName);
        const championKey = fileName.replace('./', '').replace('.json', ''); // Extract champion name
        const championInfo = championData.data[championKey]; // Extract champion data

        if (championInfo) {
          loadedChampions.push(championInfo); // Push to array
        }
      });

      this.champions = loadedChampions; // Update champions data
    },
    showSkinHover(skin) {
      this.hoveredSkin = skin;
    },
    hideSkinHover() {
      this.hoveredSkin = null;
    },
    getSkinImage(championId, skinNum) {
      return require(`@/assets/championSkins/${championId+"_"+skinNum}.jpg`);
    },
    searchChampions() {
      // If search query is empty, clear results
      if (!this.searchQuery) {
        this.searchResults = [];
        return;
      }

      const query = this.searchQuery.toLowerCase();

      // Search algorithm
      const searchResults = this.champions
        .map(champion => {
          const name = champion.name.toLowerCase();
          let matchScore = 0;
          let matchType = 'none';

          // Exact match
          if (name === query) {
            matchScore = 100;
            matchType = 'exact';
          }
          // Starts with
          else if (name.startsWith(query)) {
            matchScore = 90;
            matchType = 'starts-with';
          }
          // Contains
          else if (name.includes(query)) {
            matchScore = 70;
            matchType = 'contains';
          }

          return {
            ...champion,
            matchScore,
            matchType
          };
        })
        // Filter out non-matches
        .filter(champion => champion.matchScore > 0)
        // Sort by match quality
        .sort((a, b) => b.matchScore - a.matchScore)
        // Take top 5 results
        .slice(0, 5);

      this.searchResults = searchResults;
    },
    scrollToChampion(champion) {
      // Find the DOM element for the champion
      const championEls = this.$refs[`${champion.name}`];
      
      if (championEls && championEls.length > 0) {
        const championEl = championEls[0];
        
        // Smooth scroll to the champion
        championEl.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start'
        });

        championEl.classList.add('highlight');
        setTimeout(() => {
          championEl.classList.remove('highlight');
        }, 2000);

        // Clear search input and results
        this.searchQuery = '';
        this.searchResults = [];
      }
    }
  }
};

</script>

<style>
* {
  margin: 0;
  padding: 0;
}

li.highlight {
  animation: highlight 2s ease;
}

h2 {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 10px 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-image: url("./assets/be822b18246a6b79e41692cb890b1916.jpg")
}

.search-container {
  margin-left:300px;
  margin-right:auto;
  width: 300px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.search-input {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 2px solid #000000;
  border-radius: 8px;
  outline: none;
  transition: all 0.3s ease;
}

.search-input:focus {
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}

.search-results {
  position: absolute;
  margin-left:10px;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background-color: white;
  border: 1px solid #ddd;
  border-top: none;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 100;
}

.search-result-item {
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.search-result-item:hover {
  background-color: #cfcfcf;
}

.skin-item {
  position: relative;
  background-color: #ecf0f1;
  border-radius: 6px;
  transition: background-color 0.3s ease;
  cursor: pointer;
}

.skin-item:hover {
  background-color: #3498db;
  color: white;
}

.skin-name {
  display: block;
  text-align: center;
}

.skin-hover-window {
  position: absolute;
  width: 300px;
  height: 177px;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  box-shadow: 0 4px 6px rgba(0,0,0,0.2);
  border-radius: 5px;
  overflow: hidden;
  animation: fadeIn 0.3s ease;
  pointer-events: none;
  margin-bottom: 0px;
}

.skin-preview-image {
  width: 100%;
  height: auto;
  object-fit: cover;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Ensure no bullet points for the list */
ul {
  list-style-type: none;
  padding: 0;
  margin: 0px;
}

/* Style for each list item (each champion) */
li {
  background-color: #f8f8f8;
  border-radius: 10px;
  padding: 20px;
  margin: 15px 0;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

/* Hover effect for list item */
#champSkins:hover {
  background-color: #e2e2e2;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.322);
}

#champSkins {
  width: 200px;
  padding: 10px;
  font-size: 20px;
  font-style: italic;
  font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  font-weight: bold;
  object-fit: cover;
  border:#000000;
  border-style: solid;
  border-radius: 7px;
  box-shadow: 4 4px 10px rgba(0, 0, 0, 0.1);
  color: #555;
  user-select: none;
}

/* Style for champion name */
#champName {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 10px 0;
}

/* Style for champion title */
#champTitle {
  font-size: 18px;
  font-style: italic;
  color: #555;
  margin: 5px 0;
}

/* Style for lore text */
#champLore {
  font-size: 14px;
  color: #777;
  line-height: 1.5;
  max-width: 600px;
  margin: 10px 0;
}

/* Style for the champion image */
#champIcon {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-top: 15px;
  border: 3px solid #ddd;
}
</style>
