import { Route, Router, Switch, useRoute } from 'wouter-preact';
import { useHashLocation } from 'wouter-preact/use-hash-location';
import { resumeGame } from '../state/game-logic';
import { GamePage } from './GamePage';
import { TopicPicker } from './TopicPicker';

function RouteHandler() {
  const [match, params] = useRoute('/topic/:id');

  if (match && params?.id) {
    resumeGame(params.id);
  }
  return null;
}

export function App() {
  return (
    <Router hook={useHashLocation}>
      <RouteHandler />
      <Switch>
        <Route path="/" component={TopicPicker} />
        <Route path="/topic/:id" component={GamePage} />
        {/* Fallback to TopicPicker for unknown routes */}
        <Route component={TopicPicker} />
      </Switch>
    </Router>
  );
}
