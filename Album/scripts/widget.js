exports.render = (photos) => {
  const album = $widget.inputValue;
  let errMsg = ''
  if (!album) {
    errMsg = 'Widget Input Value is empty'
  } else if (!photos) {
    errMsg = `Album "${album}" is not exist`
  } else if (!photos.length) {
    errMsg = `Album "${album}" is empty`
  }
  
  if (errMsg) {
    $widget.setTimeline({
      render: (ctx) => ({
        type: 'text',
        props: {
          text: errMsg,
          color: $color('red'),
        },
      }),
    })
    return
  }
  
  const i = Math.floor(Math.random() * photos.length);
  $widget.setTimeline({
    render: (ctx) => {
      return {
        type: 'image',
        props: {
          image: $image(photos[i]),
          frame: {
            maxWidth: Infinity,
            maxHeight: Infinity,
          },
          resizable: true,
          scaledToFill: true,
        },
      };
    },
  });
};