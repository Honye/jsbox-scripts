const app = require('./scripts/app');
const widget = require('./scripts/widget');
const { albumsPath } = require('./scripts/common')

if (!$file.exists(albumsPath)) {
  $file.mkdir(albumsPath);
}

const directories = $file.list(albumsPath);
/** @type {{ name: string; value: string }[]} */
const widgetOptions = [];
/** @type {Map<string, string[]>} */
const albumsMap = new Map();
for (const name of directories) {
  const dirPath = `${albumsPath}${name}/`;
  const files = $file
    .list(dirPath)
    .map((filename) => `${dirPath}${filename}`);
  
  albumsMap.set(name, files);
  widgetOptions.push({
    name,
    value: name,
  });
}

$file.write({
  data: $data({
    string: JSON.stringify(widgetOptions, null, 2)
  }),
  path: 'widget-options.json',
})

if ($app.env === $env.widget) {
  const album = ($widget.inputValue || '').trim();
  const photos = albumsMap.get(album);
  widget.render(photos);
} else {
  app.init();
}
