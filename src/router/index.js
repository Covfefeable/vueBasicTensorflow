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
        component: () => import("../views/mathPredictLinear/mathPredictLinear.vue")
    },
    {
        path: "/mathPredictAbs",
        name: "mathPredictAbs",
        component: () => import("../views/mathPredictAbs/mathPredictAbs.vue")
    },
    {
        path: "/mathPredictSin",
        name: "mathPredictSin",
        component: () => import("../views/mathPredictSin/mathPredictSin.vue")
    },
    {
        path: "/PredictStockCurve",
        name: "PredictStockCurve",
        component: () => import("../views/PredictStockCurve/PredictStockCurve.vue")
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
