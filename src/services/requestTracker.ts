type Listener = (activeRequests: number) => void;

let activeRequests = 0;
const listeners = new Set<Listener>();

const notify = () => listeners.forEach((l) => l(activeRequests));

export const requestTracker = {
  start() {
    activeRequests += 1;
    notify();
  },
  end() {
    activeRequests = Math.max(0, activeRequests - 1);
    notify();
  },
  getCount() {
    return activeRequests;
  },
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    listener(activeRequests);
    return () => {
      listeners.delete(listener);
    };
  },
};
