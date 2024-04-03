'use client';
import { DeepMapStore, atom, computed, deepMap, listenKeys } from 'nanostores';
import { useStore } from '@nanostores/react';
import { ReactNode, useEffect, useState } from 'react';

const initialState = {
  id: 'UDp7KNNtqoBFG_-VAgPHS',
  name: 'New Design1',
  sides: {
    back: {
      bgUrl:
        'https://dev-minio-api.busycube.net/coolprint-static/brazil_back-1689766239261.webp',
      objects: [
        {
          x: 194.5,
          y: 200,
          id: 'MfCP3sjO4m1YbssJB3y4E',
          url: '',
          fill: '#DBCAA7',
          name: 'groupable',
          text: 'Text here',
          type: 'text',
          align: 'left',
          shape: 'normal',
          width: 211,
          height: 50,
          scaleX: 1,
          scaleY: 1,
          opacity: 1,
          visible: true,
          fontSize: 50,
          rotation: 0,
          draggable: false,
          fontStyle: 'bold',
          resizable: true,
          fontFamily: 'Roboto CoolPrint',
          selectable: true,
          showInExport: true,
          letterSpacing: 0,
          shapeStrength: 10,
          fontFamilyName: '',
          shadowSettings: null,
          strokeSettings: null,
        },
      ],
      previewUrl:
        'https://dev-minio-api.busycube.net/coolprint-static/UDp7KNNtqoBFG_-VAgPHS_preview_back-1711526966635.png',
      printableArea: {
        size: {
          width: 250,
          height: 353.5,
        },
        position: {
          x: 175,
          y: 174.75,
        },
      },
    },
    front: {
      bgUrl:
        'https://dev-minio-api.busycube.net/coolprint-static/brazil_front_base-1689766239260.webp',
      objects: [
        {
          x: 192.49999999999972,
          y: 193.6811118084357,
          id: 'UXsArOdtb9vACr-gq6C58',
          url: 'https://dev-minio-api.busycube.net/coolprint-static/brazil_right_logo-1690547762698.png',
          fill: '',
          name: 'groupable',
          type: 'img',
          extra: {
            name: 'left logo',
            type: 'img',
          },
          width: 125,
          height: 125,
          scaleX: 0.4705681065668069,
          scaleY: 0.47056810656680675,
          opacity: 1,
          visible: true,
          fileName: 'Left Logo',
          rotation: 0,
          draggable: false,
          resizable: true,
          selectable: true,
          uploadable: false,
          showInExport: true,
        },
        {
          x: 317.5894933395746,
          y: 162.68111180843607,
          id: 'tJBVtY1T_JABpnpm4SqFa',
          url: 'https://dev-minio-api.busycube.net/coolprint-static/brazil_left_logo-1689766239260.png',
          fill: '',
          name: 'groupable',
          type: 'img',
          extra: {
            name: 'right logo',
            type: 'img',
          },
          width: 125,
          height: 125,
          scaleX: 0.850652751661124,
          scaleY: 0.8506527516611233,
          opacity: 1,
          visible: true,
          fileName: 'Right Logo',
          rotation: 0,
          draggable: false,
          resizable: true,
          selectable: true,
          uploadable: false,
          showInExport: true,
        },
        {
          x: 194.5,
          y: 288,
          id: 'tsWYh-Mf2cvjCaie51YUE',
          url: '',
          fill: '#FFFFFF',
          name: 'groupable',
          text: 'Text here',
          type: 'text',
          align: 'left',
          shape: 'normal',
          width: 211,
          height: 50,
          scaleX: 1,
          scaleY: 1,
          opacity: 1,
          visible: true,
          fontSize: 50,
          rotation: 0,
          draggable: false,
          fontStyle: 'bold',
          resizable: true,
          fontFamily: 'Roboto CoolPrint',
          selectable: true,
          showInExport: true,
          letterSpacing: 0,
          shapeStrength: 10,
          fontFamilyName: '',
          shadowSettings: null,
          strokeSettings: null,
        },
        {
          x: 262.5,
          y: 357,
          id: 'zg277XOI3jEpoBhnor9xO',
          url: 'https://dev-minio-api.busycube.net/cdn/artwork/20230818/stickers/GotThis.svg',
          fill: '',
          name: 'groupable',
          type: 'art',
          extra: {
            name: 'GotThis',
            type: 'art',
          },
          width: 75,
          height: 86,
          scaleX: 1,
          scaleY: 1,
          opacity: 1,
          visible: true,
          fileName: 'GotThis',
          rotation: 0,
          draggable: false,
          resizable: true,
          selectable: true,
          uploadable: false,
          showInExport: true,
        },
      ],
      previewUrl:
        'https://dev-minio-api.busycube.net/coolprint-static/UDp7KNNtqoBFG_-VAgPHS_preview_front-1711526965784.png',
      printableArea: {
        size: {
          width: 250,
          height: 353.5,
        },
        position: {
          x: 175,
          y: 174.75,
        },
      },
    },
  },
  width: 1200,
  height: 1406,
  customer: 'person',
  template: '',
  memberList: [],
  centerTeamObjects: true,
};

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

// const changeObjectPositionCommand: Command = (targetPath, value) => (store) => {
//   const prevValue = getValueFromPath(store.value, targetPath);
//   return {
//     execute() {
//       updateByKey(store)(targetPath, value);
//     },
//     undo() {
//       updateByKey(store)(targetPath, prevValue);
//     },
//   };
// };

const changeTextCommand =
  (targetPath: string, value: string) =>
  (store: DeepMapStore<typeof initialState>) => {
    const prevValue = getValueFromPath(store.value, targetPath);

    return {
      execute() {
        state$.setKey(targetPath as keyof typeof initialState, value);
      },
      undo() {
        state$.setKey(targetPath as keyof typeof initialState, prevValue);
      },
    };
  };

type Cb<T> = (_v: T) => any;

const commandShell =
  ({
    getPrev,
    execution,
    undo,
  }: {
    getPrev: Cb<Store>;
    execution: (s: Store) => void;
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

const command1 = (newValue: any) =>
  commandShell({
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

const createCommandManager = (target: DeepMapStore<typeof initialState>) => {
  let history: any[] = [null];
  let position = 0;

  return {
    doCommand(command: ReturnType<typeof changeTextCommand>) {
      if (position < history.length - 1) {
        history = history.slice(0, position + 1);
      }

      const concreteCommand = command(target);

      history.push(concreteCommand);
      position += 1;

      concreteCommand.execute();
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

studioCommandManager.doCommand(command1('Long'));

// a.doCommand(changeTextCommand('sides.front.objects[2].text', 'Long'));

const test = (id: string) => computed($currentObjectId, (s) => s === id);
const objectSelector = (id: string) =>
  computed(state$, (s) => s.sides.front.objects.find((i) => i.id === id));

const currentObjectSelector = computed([state$, $currentObjectId], (s, id) =>
  s.sides.front.objects.find((i) => i.id === id),
);

const ObjectVisual = ({ id }: { id: string }) => {
  const _isSelect = useStore(test(id));
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

const registerCommand = (
  commandKey: string,
  execute: () => void,
  undo: () => void,
) => {};

const ObjectAlignment = () => {
  const object = useStore(currentObjectSelector);

  const [position, setPosition] = useState({ x: object?.x, y: object?.y });

  useEffect(() => {
    setPosition({ x: object?.x, y: object?.y });
  }, [object]);

  const handleChangePosition = () => {
    if (!object) return;
    // studioCommandManager.doCommand({});
    // studioCommandManager.doCommand(
    //   changeObjectPositionCommand(
    //     `sides.front.objects[${object.id}].x`,
    //     position.x,
    //   ),
    // );
    // studioCommandManager.doCommand(
    //   changeObjectPositionCommand(
    //     `sides.front.objects[${object.id}].y`,
    //     position.y,
    //   ),
    // );
  };

  if (!object) return null;

  return (
    <div style={{ display: 'flex', gap: 20 }}>
      <input value={position.x} />
      <input value={position.y} />
      <button onClick={handleChangePosition}>Update</button>
    </div>
  );
};

const $objectsKeyComputed = computed(state$, (state) =>
  state.sides.front.objects.map((i) => i.id),
);

const Page = () => {
  const store = useStore(objectText);
  const objectsKey = useStore($objectsKeyComputed);

  return (
    <div
      style={{ padding: 40, flexDirection: 'column', display: 'flex', gap: 30 }}
    >
      <input
        value={store.text}
        onChange={(e) => {
          studioCommandManager.doCommand(command1(e.target.value));
        }}
      />
      <div style={{ display: 'flex', gap: 40 }}>
        <button onClick={studioCommandManager.undo}>undo</button>
        <button onClick={studioCommandManager.redo}>redo</button>
      </div>
      <ObjectAlignment />

      <div style={{ display: 'flex', gap: 20 }}>
        {objectsKey.map((id) => (
          <ObjectVisual key={id} id={id} />
        ))}
      </div>
      <pre>{JSON.stringify(store, null, 4)}</pre>
    </div>
  );
};

export default Page;
