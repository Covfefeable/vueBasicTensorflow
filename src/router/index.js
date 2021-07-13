import { createRouter, createWebHistory } from "vue-router";

const routes = [
    { path: "/", redirect: "/home" },
    {
        path: "/home",
        name: "home",
        component: () => import("../views/home.vue")
    },
    {
        path: "/mathPredict",
        name: "mathPredict",
        component: () => import("../views/mathPredict/mathPredict.vue")
    },
    {
        path: "/mathPredictAbs",
        name: "mathPredictAbs",
        component: () => import("../views/mathPredictAbs/mathPredictAbs.vue")
    },
    {
        path: "/stockPredict",
        name: "stockPredict",
        component: () => import("../views/mathPredictCurve/stockPredict.vue")
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
