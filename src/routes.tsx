import Documentation from './pages/Documentation';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Documentação',
    path: '/',
    element: <Documentation />
  }
];

export default routes;
