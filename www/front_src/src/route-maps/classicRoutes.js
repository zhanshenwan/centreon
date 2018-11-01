import routeMap from "./route-map";
import Home from "../route-components/home";
import Module from "../route-components/module";
import CustomViews from "../route-components/customViews";

const classicRoutes = [
  {
    path: routeMap.home,
    comp: Home,
    exact: true
  },
  {
    path: routeMap.module,
    comp: Module,
    exact: true
  },
  {
    path: routeMap.customViews,
    comp: CustomViews,
    exact: true
  }
];

export default classicRoutes;
