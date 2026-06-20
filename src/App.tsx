import { Route, Router, Switch } from 'wouter-preact';
import { useHashLocation } from 'wouter-preact/use-hash-location';
import { Game } from './screens/Game';
import { Home } from './screens/Home';
import { Results } from './screens/Results';
import { Setup } from './screens/Setup';

export function App() {
  return (
    <Router hook={useHashLocation}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/setup" component={Setup} />
        <Route path="/game" component={Game} />
        <Route path="/results" component={Results} />
        <Route component={Home} />
      </Switch>
    </Router>
  );
}
