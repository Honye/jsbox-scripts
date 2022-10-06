const { screen } = $device.info;
const columns = 3;
const spacing = 4;
const itemWidth = (screen.width - spacing * (columns - 1)) / 3;

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
      }
    },
  });
};

/**
 * @param {object} params
 * @param {string[]} params.photos
 */
exports.Photos = ({ name, photos }) => {
  return {
    props: {
      title: name,
      navButtons: [
        {
          symbol: 'camera.on.rectangle',
          handler: (sender) => {
            choosePhotos({
              album: name,
            });
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
                title: 'Delete',
                symbol: 'trash',
                destructive: true,
                handler: (sender, indexPath) => {
                  $file.delete(photos[indexPath.row]);
                  $('matrix').delete(indexPath);
                },
              },
            ],
          },
        },
        layout: (make) => {
          make.top.left.bottom.right.equalTo(0);
        },
        events: {
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
