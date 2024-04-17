'use client';
import { DeepMapStore, atom, computed, deepMap, listenKeys } from 'nanostores';
import { useStore } from '@nanostores/react';
import { ReactNode, useEffect, useState } from 'react';
import { initialState } from './data';
import { create } from 'mutative';

const state$ = deepMap(initialState);

const $currentObjectId = atom<string>('');

const objectText = computed(state$, (state) => state.sides.front.objects[2]);

// state$.setKey('sides.front.objects[2].text', 'Long');

const getValueFromPath = (
  obj: Record<string, any> | undefined,
  path: string | string[],
) => {
  if (obj === undefined) return undefined;
  if (typeof path === 'string') {
    path = path.split('.');
  }

  return (path as string[]).reduce((current: any, key: string) => {
    if (current === undefined) return undefined;

    if (key.endsWith(']')) {
      const [arrayKey, index] = key.slice(0, -1).split('[');
      return current[arrayKey]?.[Number(index)];
    }

    return current[key];
  }, obj);
};

type Command = (
  _targetPath: string,
  _value: string | number | boolean | Record<string, any>,
) => (_store: DeepMapStore<typeof initialState>) => {
  execute(): void;
  undo(): void;
};

type Store = DeepMapStore<typeof initialState>;

const updateByKey = (store: Store) => (key: string, value: any) =>
  store.setKey(key as keyof typeof initialState, value);

type Cb<T> = (_v: T) => any;

const createCommand =
  ({
    getPrev,
    execution,
    undo,
  }: {
    getPrev: Cb<Store>;
    execution: Cb<Store>;
    undo: (s: Store, prevValue: any) => void;
  }) =>
  (store: Store) => {
    const prevValue = getPrev(store);

    return {
      execute() {
        execution(store);
      },
      undo() {
        undo(store, prevValue);
      },
    };
  };

const changeTextCommand = (newValue: any) =>
  createCommand({
    getPrev(store) {
      return getValueFromPath(store.value, 'sides.front.objects[2].text');
    },
    execution: (store) => {
      store.setKey('sides.front.objects[2].text', newValue);
    },
    undo: (store, prevValue) => {
      store.setKey('sides.front.objects[2].text', prevValue);
    },
  });

const PositionControl = () => {
  const selectedObject = useStore(currentObjectSelector);

  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(0);

  useEffect(() => {
    if (!selectedObject) return;
    setPositionX(selectedObject.x);
    setPositionY(selectedObject.y);
  }, [selectedObject]);

  if (!selectedObject) return null;

  const _command = (newValue: { x: number; y: number }) => {
    return createCommand({
      getPrev(store) {
        return store.value;
      },
      execution: (store) => {
        const newState = create(store.value, (draft) => {
          if (!draft) return;
          const idx = draft.sides.front.objects.findIndex(
            (i) => i.id === selectedObject.id,
          );
          if (idx) {
            draft.sides.front.objects[idx].x = newValue.x;
            draft.sides.front.objects[idx].y = newValue.y;
          }
        });
        if (!newState) return;
        store.set(newState);
      },
      undo: (store, prevValue) => {
        store.set(prevValue);
      },
    });
  };

  return (
    <div>
      <input
        value={positionX}
        onChange={(e) => setPositionX(+e.target.value)}
      />
      <input
        value={positionY}
        onChange={(e) => setPositionY(+e.target.value)}
      />
      <button
        onClick={() =>
          studioCommandManager.doCommand(
            _command({ x: positionX, y: positionY }),
          )
        }
      >
        Update
      </button>
    </div>
  );
};

const createCommandManager = (target: DeepMapStore<typeof initialState>) => {
  let history: any[] = [null];
  let position = 0;

  return {
    doCommand(command: any) {
      if (position < history.length - 1) {
        history = history.slice(0, position + 1);
      }

      const concreteCommand = command(target);

      history.push(concreteCommand);
      position += 1;

      concreteCommand.execute();
      console.log('history', history);
    },

    undo() {
      if (position > 0) {
        history[position].undo();
        position -= 1;
      }
    },

    redo() {
      if (position < history.length - 1) {
        position += 1;
        history[position].execute();
      }
    },
  };
};

const studioCommandManager = createCommandManager(state$);

studioCommandManager.doCommand(changeTextCommand('Long'));

// a.doCommand(changeTextCommand('sides.front.objects[2].text', 'Long'));

const isSelectedObject = (id: string) =>
  computed($currentObjectId, (s) => s === id);

const objectSelector = (id: string) =>
  computed(state$, (s) => s.sides.front.objects.find((i) => i.id === id));

const currentObjectSelector = computed([state$, $currentObjectId], (s, id) =>
  s.sides.front.objects.find((i) => i.id === id),
);

const ObjectVisual = ({ id }: { id: string }) => {
  const _isSelect = useStore(isSelectedObject(id));
  const object = useStore(objectSelector(id));

  if (!object) return null;

  console.log(`object: ${id}, ${_isSelect}`);

  return (
    <div
      style={{
        padding: 10,
        border: 'dashed 2px',
        borderColor: _isSelect ? 'red' : 'green',
      }}
      onClick={() => $currentObjectId.set(id)}
    >
      {id.slice(0, 5)}-Position: {object.x.toFixed(2)}, {object.y.toFixed(2)}
    </div>
  );
};

const Control = ({ children }: { children: ReactNode }) => {
  return <div>{children}</div>;
};

const $objectsKeyComputed = computed(state$, (state) =>
  state.sides.front.objects.map((i) => i.id),
);

const Page = () => {
  const objText = useStore(objectText);
  const objectsKey = useStore($objectsKeyComputed);

  return (
    <div
      style={{ padding: 40, flexDirection: 'column', display: 'flex', gap: 30 }}
    >
      <input
        value={objText.text}
        onChange={(e) => {
          studioCommandManager.doCommand(changeTextCommand(e.target.value));
        }}
      />

      <div style={{ display: 'flex', gap: 40 }}>
        <button onClick={studioCommandManager.undo}>undo</button>
        <button onClick={studioCommandManager.redo}>redo</button>
      </div>

      <PositionControl />

      <div style={{ display: 'flex', gap: 20 }}>
        {objectsKey.map((id) => (
          <ObjectVisual key={id} id={id} />
        ))}
      </div>

      <pre>{JSON.stringify(objText, null, 4)}</pre>
    </div>
  );
};

export default Page;
