const { sloarToLunar } = require('../libs/lunar');

const LunarDate = (ctx, { color }) => {
  const date = new Date();
  const lunarDate = sloarToLunar(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  );

  return {
    type: 'vstack',
    props: {
      spacing: 0,
      widgetURL: 'calshow://',
    },
    views: [
      {
        type: 'text',
        props: {
          text: new Intl.DateTimeFormat('en', {
            day: '2-digit',
          }).format(),
          color,
          font: $font(42),
        },
      },
      {
        type: 'text',
        props: {
          text: new Intl.DateTimeFormat('default', {
            year: 'numeric',
            month: 'short',
            weekday: 'short',
          }).format(),
          font: $font(16),
          color,
          padding: $insets(16, 0, 0, 0),
        },
      },
      {
        type: 'text',
        props: {
          text: `${lunarDate.lunarYear}${lunarDate.lunarMonth}月${lunarDate.lunarDay}`,
          font: $font(13),
          color,
          padding: $insets(6, 0, 0, 0),
        },
      },
    ],
  }
}

exports.LunarDate = LunarDate;
