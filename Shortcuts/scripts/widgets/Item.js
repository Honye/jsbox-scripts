const Item = (ctx, {
  symbol,
  text,
  link,
  color,
  background,
}) => {
  const size = ctx.displaySize;
  const width = (size.width / 2 - 30) / 2;
  const height = (size.height - 30) / 2;

  return {
    type: 'vstack',
    props: {
      spacing: 2,
    },
    modifiers: [
      {
        link,
        frame: {
          width,
          height,
        },
        background,
      },
      {
        cornerRadius: 10,
      },
    ],
    views: [
      {
        type: 'image',
        props: {
          symbol: {
            glyph: symbol,
            size: 32,
            weight: 'light',
          },
          color,
        },
      },
      {
        type: 'text',
        props: {
          text,
          color,
          font: $font(12),
        },
      },
    ],
  };
};

module.exports = { Item };
