import App from './App';
import { StoreProvider } from './lib/store';

/** Everything behind sign-in: loaded as its own chunk so the landing and login screens open fast. */
export default function Shell({ userId }: { userId: string }) {
  return (
    <StoreProvider userId={userId}>
      <App />
    </StoreProvider>
  );
}
