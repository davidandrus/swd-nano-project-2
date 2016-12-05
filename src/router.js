import VueRouter from 'vue-router';
import Nearby from './components/Nearby';
import StopDetails from './components/StopDetails';

const routes = [{
  component: Nearby,
  path: '/nearby'
}, {
  component: StopDetails,
  path: '/stop/:id'
}];

const router = new VueRouter({ routes });

export default router;
