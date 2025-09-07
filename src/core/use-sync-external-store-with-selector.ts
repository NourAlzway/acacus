import { useRef } from 'react';
import { useSyncExternalStore } from 'react';

type Subscribe = (onStoreChange: () => void) => () => void;

export function useSyncExternalStoreWithSelector<TState, TSelected>(
  subscribe: Subscribe,
  getSnapshot: () => TState,
  getServerSnapshot: (() => TState) | undefined,
  selector: (state: TState) => TSelected,
  isEqual: (a: TSelected, b: TSelected) => boolean = Object.is
): TSelected {
  const latestSelectorRef = useRef(selector);
  latestSelectorRef.current = selector;

  const latestIsEqualRef = useRef(isEqual);
  latestIsEqualRef.current = isEqual;

  const selectedRef = useRef<TSelected>(selector(getSnapshot()));

  const getSelectedSnapshot = (): TSelected => {
    const nextSelected = latestSelectorRef.current(getSnapshot());
    if (!latestIsEqualRef.current(selectedRef.current, nextSelected)) {
      selectedRef.current = nextSelected;
    }
    return selectedRef.current;
  };

  const getSelectedServerSnapshot = getServerSnapshot
    ? (): TSelected => latestSelectorRef.current(getServerSnapshot())
    : getSelectedSnapshot;

  const subscribeWithSelector: Subscribe = notify => {
    let prevSelected = selectedRef.current;
    return subscribe(() => {
      const nextSelected = latestSelectorRef.current(getSnapshot());
      if (!latestIsEqualRef.current(prevSelected, nextSelected)) {
        prevSelected = nextSelected;
        selectedRef.current = nextSelected;
        notify();
      }
    });
  };

  return useSyncExternalStore(
    subscribeWithSelector,
    getSelectedSnapshot,
    getSelectedServerSnapshot
  );
}
