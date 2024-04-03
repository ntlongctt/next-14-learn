'use client';

import { observable } from '@legendapp/state';
import { trackHistory } from '@legendapp/state/history';

const state$ = observable({
  profile: { name: 'Hello', age: 20, skill: ['react', 'ts'] },
});

// Track all changes to state
const history = trackHistory(state$);
state$.profile.name.set('Long');
state$.profile.age.set(21);
console.log(JSON.stringify(history, null, 2));

const Page = () => {
  return (
    <div>
      <h1>hello</h1>
    </div>
  );
};

export default Page;
