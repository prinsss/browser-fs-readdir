import { FileWithDirectoryAndFileHandle, getFiles } from './fs';

/**
 * Reads the contents of a directory.
 *
 * @param dirHandle The directory to read. Could be the handle returned by `window.showDirectoryPicker()` or `DataTransferItem.getAsFileSystemHandle()`.
 * @param options Options for reading the directory.
 * @param options.recursive Whether to read the directory recursively.
 * @param options.skipDirectory A function to determine whether to skip a directory.
 * @returns Files in the directory.
 */
export async function readdir(
  dirHandle: FileSystemDirectoryHandle,
  options?: {
    recursive?: boolean;
    skipDirectory?: (entry: FileSystemDirectoryHandle) => boolean;
  },
): Promise<FileWithDirectoryAndFileHandle[]> {
  return await getFiles(dirHandle, options?.recursive, undefined, options?.skipDirectory);
}

export * from './fs';
export default readdir;
