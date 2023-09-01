import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';

Vue.use(VueRouter);
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject);
    return originalPush.call(this, location).catch((err) => err);
};

export const routes = [
    {
        path: '/index',
        name: 'Index',
        component: () => import('@/views/index'),
    },
];

export const router = new VueRouter({
    routes,
});
