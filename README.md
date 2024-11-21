# browser-fs-readdir

Read contents of a directory with the File System Access API.

Live demo: [browser-fs-readdir.prin.studio](https://browser-fs-readdir.prin.studio) ([source code](https://github.com/prinsss/browser-fs-readdir/tree/main/src/demo.tsx))

# Installation

```bash
npm install browser-fs-readdir
```

# Usage

```ts
import readdir from 'browser-fs-readdir';

// Use with showDirectoryPicker
const directoryHandle = await window.showDirectoryPicker();
const files = await readdir(directoryHandle, { recursive: true });
console.log(files.map((file) => file.webkitRelativePath));

// Use with DataTransferItem
const items = event.dataTransfer.items;
const directoryHandle = await items[0].getAsFileSystemHandle();
const files = await readdir(directoryHandle);
console.log(files.map((file) => file.webkitRelativePath));
```

# Browser Compatibility

Chrome 86+ on desktop is supported.

- [FileSystemDirectoryHandle](https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryHandle)
- [window.showDirectoryPicker()](https://developer.mozilla.org/en-US/docs/Web/API/Window/showDirectoryPicker)
- [DataTransferItem.getAsFileSystemHandle()](https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItem/getAsFileSystemHandle)

# Acknowledgements

[browser-fs-access](https://github.com/GoogleChromeLabs/browser-fs-access) (Apache-2.0)

## License

[MIT](LICENSE)
