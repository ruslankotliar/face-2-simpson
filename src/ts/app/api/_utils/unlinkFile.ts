import fs from 'fs';

export const unlinkFile = async function (
  path: string | undefined
): Promise<void> {
  if (!path) throw Error('Path to delete file not provided.');
  console.log(`Deleting: ${path}`)
  fs.unlink(path, function (e) {
    if (e) {
      console.log(`Error in deleting the file: ${e}.`);
    } else {
      console.log(`Successfully deleted the file.`);
    }
  });
};
