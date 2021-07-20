import { createRouter, createWebHistory } from "vue-router";

const routes = [
    { path: "/", redirect: "/home" },
    {
        path: "/home",
        name: "home",
        component: () => import("../views/home.vue")
    },
    {
        path: "/mathPredictLinear",
        name: "mathPredictLinear",
        component: () => import("../views/Layers/mathPredictLinear.vue")
    },
    {
        path: "/mathPredictAbs",
        name: "mathPredictAbs",
        component: () => import("../views/Core/mathPredictAbs.vue")
    },
    {
        path: "/mathPredictAbs_Layers",
        name: "mathPredictAbs_Layers",
        component: () => import("../views/Layers/mathPredictAbs.vue")
    },
    {
        path: "/mathPredictSin",
        name: "mathPredictSin",
        component: () => import("../views/Core/mathPredictSin.vue")
    },
    {
        path: "/mathPredictSinAbs",
        name: "mathPredictSinAbs",
        component: () => import("../views/Core/mathPredictSinAbs.vue")
    },
    {
        path: "/PredictStockCurve",
        name: "PredictStockCurve",
        component: () => import("../views/Layers/PredictStockCurve.vue")
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
