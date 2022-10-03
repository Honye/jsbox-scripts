const { ClockText } = require('./components/ClockText');

const DateView = (ctx) => {
  return {
    type: 'hstack',
    props: {},
    modifiers: [
      {
        layoutPriority: 1,
        background: $rgba(0, 0, 0, 0.3),
        padding: $insets(2, 3, 2, 3),
      },
      {
        cornerRadius: 6,
      },
    ],
    views: [
      {
        type: 'text',
        props: {
          text: new Date().toLocaleDateString('zh-CN').replace(/\//g, '-'),
          color: $color('#fff'),
        },
      },
    ],
  };
};

const WeekView = () => {
  const weekFormat = new Intl.DateTimeFormat([], { weekday: 'narrow' }).format;
  const now = new Date();
  const date = new Date();
  date.setDate(date.getDate() - date.getDay());
  const weeks = [];
  let i = 0;
  while (i < 7) {
    weeks.push({
      type: 'text',
      props: {
        text: weekFormat(date),
        color:
          date.getDay() === now.getDay()
            ? $color('#fff')
            : $rgba(255, 255, 255, 0.7),
      },
    });
    date.setDate(date.getDate() + 1);
    i++;
  }

  return {
    type: 'hstack',
    props: {
      spacing: 4,
    },
    modifiers: [
      {
        layoutPriority: 1,
        background: $rgba(0, 0, 0, 0.3),
        padding: $insets(2, 4, 2, 4),
      },
      {
        cornerRadius: 6,
      },
    ],
    views: weeks,
  };
};

const DateWeekView = (ctx) => {
  const size = ctx.displaySize;
  return {
    type: 'hstack',
    props: {
      frame: {
        width: size.width - 48,
      },
    },
    views: [DateView(), { type: 'spacer' }, WeekView()],
  };
};

const TimerWrapView = (ctx, { date, fontSize }) => {
  return {
    type: 'vstack',
    modifiers: [
      {
        frame: {
          width: ctx.displaySize.width - 48,
        },
        background: $rgba(0, 0, 0, 0.3),
      },
      {
        cornerRadius: 8,
      },
    ],
    views: [ClockText(ctx, { date, fontSize })],
  };
};

exports.init = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const expireDate = new Date(now.getTime() + 60 * 60 * 1000);

  $widget.setTimeline({
    policy: {
      afterDate: expireDate,
    },
    render: (ctx) => {
      const size = ctx.displaySize;
      const family = ctx.family;
      const fontSize = Math.floor((size.width - 60) / 5);

      return {
        type: 'zstack',
        props: {
          frame: {
            width: ctx.displaySize.width,
            height: ctx.displaySize.height,
            maxWidth: Infinity,
            maxHeight: Infinity,
          },
        },
        views: [
          {
            type: 'image',
            props: {
              image: $image({
                light: 'assets/medium_top.jpg',
                dark: 'assets/medium_top_dark.jpg',
              }),
              resizable: true,
              scaledToFill: true,
            },
          },
          {
            type: 'vstack',
            props: {
              frame: {
                width: size.width,
                height: size.height,
              },
            },
            views:
              family > 0
                ? [
                    DateWeekView(ctx),
                    TimerWrapView(ctx, {
                      date: now,
                      fontSize,
                    }),
                  ]
                : [
                    TimerWrapView(ctx, {
                      date: now,
                      fontSize,
                    }),
                  ],
          },
        ],
      };
    },
  });
};
