# whatwg-streams-fns

An utility library for [WHATWG Streams][whatwg/streams].

[whatwg/streams]: https://github.com/whatwg/streams

## Installation

```
npm install whatwg-streams-fns
```

## Usage

```javascript
import { WritableStream } from 'whatwg-streams-b';
import { filter } from 'whatwg-streams-fns/filter';
import { from } from 'whatwg-streams-fns/from';
import { map } from 'whatwg-streams-fns/map';

from([1, 2, 3, 4, 5])
  .pipeThrough(filter((i) => i % 2 === 1))
  .pipeThrough(map((i) => i * 2))
  .pipeTo(new WritableStream({
    write(chunk) {
      console.log(chunk); // 2, 6, 10
    }
  }));
```

## Functions

- [`filter`](src/filter.ts)
- [`fold`](src/fold.ts)
- [`fork`](src/fork.ts)
- [`from`](src/from.ts)
- [`map`](src/map.ts)
- [`merge`](src/merge.ts)

## Badges

[![Travis CI][travis-ci-badge]][travis-ci]

[travis-ci-badge]: https://img.shields.io/travis/bouzuya/whatwg-streams-fns.svg
[travis-ci]: https://travis-ci.org/bouzuya/whatwg-streams-fns

## License

[MIT](LICENSE) (bouzuya)

## Author

[bouzuya][user] &lt;[m@bouzuya.net][email]&gt; ([http://bouzuya.net][url])

[user]: https://github.com/bouzuya
[email]: mailto:m@bouzuya.net
[url]: http://bouzuya.net
