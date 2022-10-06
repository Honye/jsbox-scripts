const app = require('./scripts/app');
const widget = require('./scripts/widget');

const albumsPath = './albums/';
if (!$file.exists(albumsPath)) {
  $file.mkdir(albumsPath)
}
const directories = $file.list(albumsPath);
/** @type {{ name: string; photos: string[] }} */
const albums = [];
/** @type {Map<string, string[]>} */
const albumsMap = new Map();
for (const name of directories) {
  const dirPath = `./albums/${name}/`;
  const files = $file.list(dirPath)
    .map((filename) => `${dirPath}${filename}`);
  albums.push({
    name,
    photos: files,
  })
  albumsMap.set(name, files);
}

if ($app.env === $env.widget) {
  const album = $widget.inputValue;
  const photos = albumsMap.get(album);
  widget.render(photos);
} else {
  app.init(albums);
}