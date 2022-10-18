exports.AlbumTemplate = ({ width }) => {
  return {
    props: {},
    views: [
      {
        type: 'image',
        props: {
          id: 'image',
          cornerRadius: 4,
          bgcolor: $color('#eee'),
        },
        layout: (make, view) => {
          make.left.top.inset(10);
          make.width.height.equalTo(width - 20);
        },
      },
      {
        type: 'label',
        props: {
          id: 'name',
          font: $font(18),
        },
        layout: (make, view) => {
          make.left.right.equalTo(view.prev);
          make.top.equalTo(view.prev.bottom);
          make.height.equalTo(26);
        },
      },
      {
        type: 'label',
        props: {
          id: 'count',
          textColor: $color('#999'),
        },
        layout: (make, view) => {
          make.left.right.equalTo(view.prev);
          make.top.equalTo(view.prev.bottom);
          make.height.equalTo(20);
        },
      },
    ],
    layout: (make) => {
      make.insets($insets(10,10,10,10));
    },
  }
};
