<template>
<div class="app">
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
        <img v-if="result.id != 'FiddleSticks'" class="search-icon" :src="require('@/assets/championImages/'+result.id+'.png')">
        <img class="search-icon" v-else :src="require('@/assets/championImages/'+'Fiddlesticks.png')">
        {{ result.name }}
        </div>
    </div>
    </div>
    <button class="sidebar-button" @click="showHideSidebar"></button>
    <div class="sidebar-left" v-show="showSidebar">
        <ul>
            <button v-for="(champion) in champions" @click="scrollToChampion(champion)">
                {{ champion.name }}
            </button>
        </ul>
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
        <button
            @click="switchToSkinImage(champion.id, skin.num)"    
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
    </button>
        </ul>
    </li>
    </ul>
</div>
</template>


<script>
import router from '@/router';


export default {
    data() {
    return {
        champions: [],
        hoveredSkin: null,
        searchQuery: '',
        searchResults: [],
        showSidebar: false
    }
    },
    created() {
    this.loadChampionData();
    
    const savedSidebarState = sessionStorage.getItem('sidebarOpen');
    if (savedSidebarState != null) {
        this.showSidebar = savedSidebarState == 'true';
        
        this.$nextTick(() => {
            const sideBarButton = document.getElementsByClassName('sidebar-button');
            const sideBar = document.getElementsByClassName('sidebar-left');
            if (this.showSidebar) {
                sideBarButton[0].style.left = '630px';
                sideBar[0].style.maxWidth = '626px';
            } else {
                sideBarButton[0].style.left = '0px';
                sideBar[0].style.maxWidth = '0px';
            }
        });
    }

    window.addEventListener('beforeunload', this.resetSidebarState);
},
    methods: {
    loadChampionData() {
        const context = require.context('@/assets/champions', false, /\.json$/);

        const loadedChampions = [];

        context.keys().forEach((fileName) => {
        const championData = context(fileName);
        const championKey = fileName.replace('./', '').replace('.json', '');
        const championInfo = championData.data[championKey];

        if (championInfo) {
            loadedChampions.push(championInfo);
        }
        });

        this.champions = loadedChampions;
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
        if (!this.searchQuery) {
        this.searchResults = [];
        return;
        }

        const query = this.searchQuery.toLowerCase();

        const searchResults = this.champions
        .map(champion => {
            let name = champion.name.toLowerCase();
            let matchScore = 0;
            
            if (name === query) {
            matchScore = 100;
            }

            else if (name.startsWith(query)) {
            matchScore = 90;
            }
            
            else if (name.includes(query)) {
            matchScore = 70;
            }

            return {
            ...champion,
            matchScore
            };
        })
        .filter(champion => champion.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 5);

        this.searchResults = searchResults;
        console.log(searchResults)
    },
    scrollToChampion(champion) {
        const championEls = this.$refs[`${champion.name}`];
        
        if (championEls && championEls.length > 0) {
        const championEl = championEls[0];
        
        championEl.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start'
        });

        championEl.classList.add('highlight');
        setTimeout(() => {
            championEl.classList.remove('highlight');
        }, 2000);

        this.searchQuery = '';
        this.searchResults = [];
        }
    },
    switchToSkinImage(championId, skinNum) {
        router.push({
        path: '/skinImage',
        query: { 
        championId: championId,
        skinNum: skinNum
        },
        replace: false
     });
    },
    showHideSidebar() {
        this.showSidebar = !this.showSidebar

        sessionStorage.setItem('sidebarOpen', this.showSidebar);

        const sideBarButton = document.getElementsByClassName('sidebar-button')
        const sideBar = document.getElementsByClassName('sidebar-left')
        if (this.showSidebar == true) {
            sideBarButton[0].style.left = '630px'
            sideBar[0].style.maxWidth = '626px'
        }
        else {
            sideBarButton[0].style.left = '0px'
            sideBar[0].style.maxWidth = '0px'
        }
    },
    resetSidebarState() {
        sessionStorage.removeItem('sidebarOpen');
    },
    beforeDestroy() {
        window.removeEventListener('beforeunload', this.resetSidebarState);
    }
}
};

</script>

<style>
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
    background-image: url("/src/assets/be822b18246a6b79e41692cb890b1916.jpg")
}

.search-container {
    left: 300px;
    width: 300px;
    position: fixed;
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
    font-size: 20px;
    padding: 5px;
    height: 40px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.search-result-item:hover {
    background-color: #cfcfcf;
}

.search-icon {
    position: absolute;
    left: 45px;
    width: 40px;
    height: 40px;
}

.skin-item {
    position: relative;
    background-color: #ecf0f1;
    border-radius: 6px;
    transition: background-color 0.3s ease;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin: 10px
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

ul {
    list-style-type: none;
    padding: 1px;
    margin: 0px;
}

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

#champName {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin: 10px 0;
}

#champTitle {
    font-size: 18px;
    font-style: italic;
    color: #555;
    margin: 5px 0;
}

#champLore {
    font-size: 14px;
    color: #777;
    line-height: 1.5;
    max-width: 600px;
    margin: 10px 0;
}

#champIcon {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    margin-top: 15px;
    border: 3px solid #ddd;
}

.sidebar-left {
    background-color: rgba(24, 24, 24, 0.9);
    position: fixed;
    margin: 0;
    max-width: 0;
    left: 0;
    top: 292px;
    height: 465px;
    padding: 2px;
    padding-top: 3px;
    z-index: 200;
    transition: max-width 0.4s;
}

.sidebar-left button {
    background: none;
    color: #305070;
    display: grid;
    float: left;
    width: 100px;
    height: 3px;
    margin: 2px;
    padding: 4px;
    padding-right: 0px;
    padding-bottom: 8px;
    font-size: small;
    text-align: left;
    overflow: hidden;
    text-wrap: nowrap;
    line-height: 0px;
    border:1;
    border-color: rgb(24, 24, 24);
    border-width: 0;
}

.sidebar-left button:hover {
    color: #3498db;
    cursor: pointer
}

.sidebar-button {
    position: fixed;
    background: transparent;
    left: 0;
    width: 12px;
    height: 7px;
    top: 293px;
    cursor: pointer;
    border-left: 30px solid #3498db;
    border-right: 20px solid transparent;
    border-bottom: 20px solid transparent;
    border-top: 20px solid transparent;
    clip-path: polygon(0% 0%, 0% 100%, 100% 50%);
    transition-property: left, filter;
    transition-duration: 0.4s;
}

.sidebar-button:hover {
    filter:brightness(150%) drop-shadow(0px 0px 1px #27a3f5);
}
</style>