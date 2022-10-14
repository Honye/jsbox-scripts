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
  
  const date = new Date()
  const afterDate = new Date(date.getTime() + 10 * 60000)
  const i = Math.floor(Math.random() * photos.length);
  $widget.setTimeline({
    entries: [
      { date },
    ],
    policy: { afterDate },
    render: (ctx) => {
      return {
        type: 'image',
        props: {
          image: $image(photos[i]),
          widgetURL:
            `jsbox://run?name=${$addin.current.name}&album=${album}`,
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