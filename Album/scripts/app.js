const { AlbumTemplate } = require('./template');
const { Photos } = require('./photos');

const createAlbum = (name) => {
  const albumsPath = 'albums/';
  const albumPath = `${albumsPath}${name}/`;
  if ($file.exists(albumPath)) {
    const msg = `Album "${name}" already exists`;
    throw new Error(msg);
  }

  $file.mkdir(albumPath);
}

/**
 * @param {object} option
 * @param {string} option.name
 * @param {unknown} option.value
 */
const addWidgetOption = (option) => {
  const options = JSON.parse(
    $file.read('widget-options.json').string
  );
  options.push(option);
  $file.write({
    data: $data({
      string: JSON.stringify(options, null, 2),
    }),
    path: 'widget-options.json',
  });
};

const removeWidgetOption = (value) => {
  const options = JSON.parse(
    $file.read('widget-options.json').string
  )
  options.splice(
    options.findIndex((opt) => opt.value === value),
    1
  )
  $file.write({
    data: $data({
      string: JSON.stringify(options, null, 2)
    }),
    path: 'widget-options.json'
  })
}

/**
 * @param {{ name: string; photos: string[] }[]} albums 
 */
exports.init = (albums) => {
  const { screen } = $device.info;
  const columns = 2;
  const spacing = 0;
  const itemWidth = (screen.width - 20 - spacing * (columns + 1)) / columns;

  const createAlbumHandler = () => {
    $input.text({
      type: $kbType.default,
      placeholder: 'Enter a name for this album',
      handler: (text) => {
        const name = text.replace(/\//g, '-');
        try {
          createAlbum(name);
        } catch(e) {
          $ui.error(e.message);
          return;
        }
        addWidgetOption({
          name,
          value: name,
        });
        
        const item = {
          name,
          photos: [],
        };
        albums.unshift(item);
        $('albums').insert({
          indexPath: $indexPath(0, 0),
          value: {
            image: {
              source: {
                placeholder: 'icon_014.png',
              },
            },
            name: { text: item.name },
            count: { text: `${item.photos.length}` },
          },
        });
      },
    });
  };

  $ui.render({
    props: {
      title: 'Albums',
      navButtons: [
        {
          symbol: 'rectangle.stack.badge.plus',
          menu: {
            asPrimary: true,
            items: [
              {
                title: 'New Album',
                symbol: 'rectangle.stack.badge.plus',
                handler: createAlbumHandler,
              },
            ],
          },
        },
      ],
    },
    views: [
      {
        type: 'matrix',
        props: {
          id: 'albums',
          columns,
          spacing,
          itemHeight: itemWidth + 20 + 20,
          template: AlbumTemplate({ width: itemWidth }),
          data: albums.map((item) => ({
            image: { src: item.photos[0] },
            name: { text: item.name },
            count: { text: `${item.photos.length}` },
          })),
          menu: {
            items: [
              {
                title: 'Copy Name',
                symbol: 'doc.on.doc',
                handler: (sender, indexPath) => {
                  $clipboard.text = albums[indexPath.row].name;
                  $ui.toast('Copied');
                },
              },
              {
                title: 'Delete Album',
                symbol: 'trash',
                destructive: true,
                handler: (sender, indexPath) => {
                  const name = albums[indexPath.row].name;
                  $file.delete(`albums/${name}/`);
                  removeWidgetOption(name)
                  albums.splice(indexPath.row, 1);
                  $('albums').delete(indexPath);
                },
              },
            ],
          },
        },
        layout: (make) => {
          make.top.bottom.equalTo(0);
          make.left.right.inset(10);
        },
        events: {
          didSelect: (sender, indexPath) => {
            $ui.push(
              Photos(albums[indexPath.row])
            );
          },
        },
      },
    ],
  });

};