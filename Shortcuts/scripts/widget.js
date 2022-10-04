const { LunarDate } = require('./widgets/LunarDate');
const { Item } = require('./widgets/Item');

/** 支持 $image 和 $color */
const background = $image(
  'assets/middle_top_light.jpg'
);
const color = $color('#fff');
const itemBackground = $rgba(0, 0, 0, 0.15);
const list = [
  {
    symbol: 'qrcode.viewfinder',
    text: '支付宝',
    link:
      'alipays://platformapi/startapp?saId=10000007',
  },
  {
    symbol: 'barcode.viewfinder',
    text: '收/付款',
    link:
      'alipay://platformapi/startapp?appId=20000056',
  },
  {
    symbol: 'plus.viewfinder',
    text: '微信',
    link: 'weixin://scanqrcode',
  },
  {
    symbol: 'location.viewfinder',
    text: '健康码',
    link:
      'alipays://platformapi/startapp?appId=20000067&url=https%3A%2F%2F68687564.h5app.alipay.com%2Fwww%2Findex.html',
  },
];

const run = () => {
  $widget.setTimeline({
    render: (ctx) => {
      const family = ctx.family;
      const useImage = background instanceof $objc('UIImage').jsValue();

      const smallView = LunarDate(ctx, { color });
      const mediumView = {
        type: 'vgrid',
        props: {
          frame: {
            maxWidth: Infinity,
            maxHeight: Infinity,
          },
          columns: Array(2).fill({
            flexible: {
              minimum: 50,
              maximum: Infinity,
            },
          }),
          spacing: 10,
        },
        views: [
          LunarDate(ctx, { color }),
          {
            type: 'vgrid',
            props: {
              columns: Array(2).fill({
                flexible: {
                  minimum: 20,
                  maximum: Infinity,
                },
                spacing: 8,
              }),
              spacing: 8,
              padding: 10,
            },
            views: list.map((item) =>
              Item(ctx, {
                ...item,
                color,
                background: itemBackground,
              })
            ),
          },
        ],
      }

      return {
        type: 'zstack',
        props: {
          frame: {
            maxWidth: Infinity,
            maxHeight: Infinity,
          },
          background: useImage ? undefined : background,
        },
        views: [
          ...(useImage ? [
            {
              type: 'image',
              props: {
                image: background,
                resizable: true,
              },
            }
          ] : []),
          family === 0
          ? smallView
          : mediumView,
        ],
      };
    },
  });
};

module.exports = {
  run,
};
