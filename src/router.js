
import { createWebHistory, createRouter } from "vue-router";
import skinImage from '@/components/skinImage.vue'
import HomeView from '@/views/Home.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/skinImage',
        name: 'skinImage',
        component: skinImage
    }
    ],
    // router.js - this looks good already
    // In router.js
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
        return new Promise((resolve) => {
            setTimeout(() => {
            resolve({
                ...savedPosition,
                behavior: "instant"
            });
            }, 15);
        });
        }
        
        return { top: 0 };
    }
})

export default router