import { useState } from 'react';
import readdir from './lib';

function App() {
  const [result, setResult] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState('');

  return (
    <div className="flex flex-col items-center py-8">
      <p className="text-center mb-8">All files is processed in the local browser.</p>

      <div
        className={
          'w-96 h-48 border-2 border-dashed border-gray-400 flex justify-center items-center cursor-pointer' +
          (dragging ? ' bg-gray-200' : '')
        }
        onClick={async () => {
          setProgress('');
          const handle = await window.showDirectoryPicker();

          const files = await readdir(handle, {
            recursive: true,
            onProgress: (progress) => setProgress(`${progress.loaded}/${progress.total}`),
          });

          setResult(files);
        }}
        onDrop={async (e) => {
          e.preventDefault();
          setDragging(false);

          const handle = await e.dataTransfer.items[0].getAsFileSystemHandle();
          const files = await readdir(handle as FileSystemDirectoryHandle, { recursive: true });
          setResult(files);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={() => setDragging(true)}
        onDragLeave={() => setDragging(false)}
      >
        {progress ? `Read: ${progress}` : 'Click or Drop Directory Here'}
      </div>

      <table className="mt-4">
        <thead>
          <tr className="text-left">
            <th>Path</th>
            <th className="px-8">Size</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {result.map((file, index) => (
            <tr key={index}>
              <td>{file.webkitRelativePath}</td>
              <td className="px-8">{(file.size / 1024).toFixed(2)} KB</td>
              <td>
                <button
                  className="mr-2"
                  onClick={async () => {
                    const content = await file.text();
                    console.log(content);

                    const truncated = content.slice(0, 200) + '...';
                    alert('Check console logs for full content.\n\n' + truncated);
                  }}
                >
                  Read
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
