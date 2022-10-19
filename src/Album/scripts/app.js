const { readAlbums, mapAlbumsData } = require('./common')
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

exports.init = () => {
  const { query } = $context
  const albums = readAlbums()
  const { screen } = $device.info;
  const columns = 2;
  const spacing = 0;
  const itemWidth = (screen.width - 20 - spacing * (columns + 1)) / columns;

  const { album, filename } = query;
  if (album) {
    $ui.render(Photos({ album, filename }))
    return
  }

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
      title: $l10n('Albums'),
      navButtons: [
        {
          symbol: 'rectangle.stack.badge.plus',
          menu: {
            asPrimary: true,
            items: [
              {
                title: $l10n('New Album'),
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
          data: mapAlbumsData(albums),
          menu: {
            items: [
              {
                title: $l10n('Copy Album Name'),
                symbol: 'doc.on.doc',
                handler: (sender, indexPath, data) => {
                  $clipboard.text = data.name.text;
                  $ui.toast('Copied');
                },
              },
              {
                title: $l10n('Copy URL Scheme'),
                symbol: 'link',
                handler: (sender, indexPath, data) => {
                  const album = data.name.text
                  $clipboard.copy({
                    text: `jsbox://run?name=${encodeURIComponent(
                      $addin.current.name
                    )}&album=${encodeURIComponent(
                      album
                    )}`
                  })
                }
              },
              {
                title: $l10n('Delete Album'),
                symbol: 'trash',
                destructive: true,
                handler: (sender, indexPath, data) => {
                  const name = data.name.text;
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
          didSelect: (sender, indexPath, data) => {
            $ui.push(
              Photos({
                album: data.name.text,
              })
            );
          },
        },
      },
    ],
  });
};
