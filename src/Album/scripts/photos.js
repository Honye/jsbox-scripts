const { albumsPath, readAlbums, mapAlbumsData, readPhotos } = require('./common')

const { screen } = $device.info;
const columns = 3;
const spacing = 4;
const itemWidth = (screen.width - spacing * (columns - 1)) / 3;

/**
 * @param {object} params
 * @param {string} params.album 相册名
 * @param {string} [params.filename] 图片文件名
 */
exports.Photos = ({ album, filename }) => {
  const photos = readPhotos(album);

  const choosePhotos = ({ album }) => {
    $photo.pick({
      mediaTypes: $mediaType.image,
      quality: $imgPicker.quality.medium,
      multi: true,
      selectionLimit: 9,
      handler: ({ status, results }) => {
        if (!status) return;

        for (const { image, filename } of results) {
          const path = `albums/${album}/${filename}.jpg`;
          $file.write({
            data: image.jpg(0.8),
            path,
          });
          $('matrix').insert({
            indexPath: $indexPath(0, 0),
            value: {
              image: {
                src: path,
              },
            },
          });
          photos.unshift(path);
          $('albums').data = mapAlbumsData(
            readAlbums()
          );
        }
      },
    });
  };

  return {
    props: {
      title: album,
      navButtons: [
        {
          symbol: 'camera.on.rectangle',
          handler: (sender) => {
            choosePhotos({ album });
          },
        },
      ],
    },
    views: [
      {
        type: 'matrix',
        props: {
          id: 'matrix',
          columns,
          spacing,
          itemHeight: itemWidth,
          template: {
            views: [
              {
                type: 'image',
                props: {
                  id: 'image',
                  bgcolor: $color('#eee'),
                  cornerRadius: 4,
                },
                layout: (make) => {
                  make.top.left.bottom.right.equalTo(0);
                },
              },
            ],
          },
          data: photos.map((item) => ({
            image: {
              src: item,
            },
          })),
          menu: {
            items: [
              {
                title: $l10n('Copy URL Scheme'),
                symbol: 'link',
                handler: (sender, indexPath) => {
                  const filePath =
                    photos[indexPath.row];
                  const filename = filePath.match(
                    /[^\\/:*?"<>|\r\n]+$/
                  )[0];
                  $clipboard.copy({
                    text: `jsbox://run?name=${encodeURIComponent(
                      $addin.current.name
                    )}&album=${encodeURIComponent(
                      album
                    )}&filename=${encodeURIComponent(
                      filename
                    )}`,
                  });
                },
              },
              {
                title: $l10n('Delete'),
                symbol: 'trash',
                destructive: true,
                handler: (sender, indexPath) => {
                  $file.delete(photos[indexPath.row]);
                  $('matrix').delete(indexPath);
                  $('albums').data = mapAlbumsData(readAlbums())
                },
              },
            ],
          },
        },
        layout: (make) => {
          make.top.left.bottom.right.equalTo(0);
        },
        events: {
          ready() {
            if (filename) {
              const image = $image(`${albumsPath}${album}/${filename}`);
              $quicklook.open({ image });
            }
          },
          didSelect: (sender, indexPath) => {
            const image = $image(
              photos[indexPath.row]
            );
            $quicklook.open({ image });
          },
        },
      },
    ],
  };
};
