/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Credit: https://github.com/GoogleChromeLabs/browser-fs-access/blob/main/src/fs-access/directory-open.mjs

export interface FileWithDirectoryAndFileHandle extends File {
  directoryHandle?: FileSystemDirectoryHandle;
  handle?: FileSystemFileHandle;
}

/**
 * Read contents in a directory from disk using the File System Access API.
 *
 * @license © 2020 Google LLC. Licensed under the Apache License, Version 2.0.
 * @returns Contained files.
 */
export async function getFiles(
  dirHandle: FileSystemDirectoryHandle,
  recursive = false,
  path = dirHandle.name,
  skipDirectory?: (entry: FileSystemDirectoryHandle) => boolean,
  progress?: { loaded: number; total: number },
  onProgress?: (event: ProgressEvent) => void,
): Promise<FileWithDirectoryAndFileHandle[]> {
  const dirs: ReturnType<typeof getFiles>[] = [];
  const files: Promise<FileWithDirectoryAndFileHandle>[] = [];

  progress = progress || { loaded: 0, total: 0 };

  for await (const entry of dirHandle.values()) {
    const nestedPath = `${path}/${entry.name}`;
    if (entry.kind === 'file') {
      progress.total += 1;
      files.push(
        entry.getFile().then((f) => {
          const file = f as FileWithDirectoryAndFileHandle;
          file.directoryHandle = dirHandle;
          file.handle = entry;

          // Update progress
          progress.loaded += 1;
          onProgress?.(new ProgressEvent('progress', { lengthComputable: true, ...progress }));

          return Object.defineProperty(file, 'webkitRelativePath', {
            configurable: true,
            enumerable: true,
            get: () => nestedPath,
          });
        }),
      );
    } else if (
      entry.kind === 'directory' &&
      recursive &&
      (!skipDirectory || !skipDirectory(entry))
    ) {
      dirs.push(getFiles(entry, recursive, nestedPath, skipDirectory, progress, onProgress));
    }
  }

  return [...(await Promise.all(dirs)).flat(), ...(await Promise.all(files))];
}
