const fontSize = 14;
/**
 * 每项最多显示行数。正整数或者 NaN
 *
 * - 0 和 负数: 不支持
 * - NaN: 无限制
 */
const lineLimit = 2;
const gap = 5.2;
const paddingVertical = gap;
const iconSize = 12;
/**
 * Logo 显示样式
 *
 * 0: 不显示
 * 1: 右下角占位
 * 2: 作为半透明背景不占位
 */
let logoStyle = 1;
const logoSize = 30;
/**
 * 更新时间显示样式
 *
 * 0: 不显示
 * 1: 右上角横向排列
 * 2: 右上角竖向排列
 */
let timeStyle = 1;
/**
 * 自定义跳转
 *
 * search：热搜词会追加到末尾
 * @type {{ main: string; search: string }}
 */
const customScheme = null;
const configs = ($widget.inputValue || '')
  .split(';')
  .map((item) => item.trim());
const conf = {
  client: configs[0] || 'h5',
};
timeStyle = configs[1] || timeStyle;
logoStyle = configs[2] || logoStyle;

/** 微博国际版页面 */
const InternationalScheme = {
  hotSearch: () => 'weibointernational://hotsearch',
  search: (keyword) =>
    `weibointernational://search?keyword=${encodeURIComponent(
      keyword
    )}`,
};

/** 微博 H5 应用页面 */
const H5Page = {
  hotSearch: () =>
    `https://m.weibo.cn/p/index?containerid=${encodeURIComponent(
      '106003&filter_type=realtimehot'
    )}`,
  search: (keyword) =>
    `https://m.weibo.cn/search?containerid=${encodeURIComponent(
      '100103type=1&t=10&q=' + keyword
    )}`,
};

const Pages = (() => {
  if (customScheme) {
    return {
      hotSearch: () => customScheme.main,
      search: (keyword) =>
        `${customScheme.search}${encodeURIComponent(
          keyword
        )}`,
    };
  }
  switch (conf.client) {
    case 'international':
      return InternationalScheme;
    case 'h5':
      return H5Page;
  }
})();

const fetchData = async () => {
  const url =
    'https://weibointl.api.weibo.cn/portal.php?ct=feed&a=search_topic';
  try {
    const data = await new Promise(
      (resolve, reject) => {
        $http.get({
          url,
          handler: ({ error, data }) => {
            if (error) {
              reject(error);
            } else {
              resolve(data);
            }
          },
        });
      }
    );
    const time = new Date()
      .toLocaleTimeString('zh-CN')
      .slice(0, 5);
    const result = {
      data,
      updatedAt: time,
    };
    $cache.set('cache', result);
    return result;
  } catch (e) {
    const result = $cache.get('cache');
    return result;
  }
};

const UpdateTime = (ctx, { text, font, color }) => {
  const size = ctx.displaySize;
  const textSize = $text.sizeThatFits({
    text,
    font,
    width: Infinity,
  });
  return {
    type: 'hstack',
    props: {
      rotationEffect: Math.PI * 0.5,
      offset: $point(
        -(size.height / 2) + textSize.width / 2 + 14,
        -size.width / 2 + textSize.height / 2
      ),
    },
    views: [
      {
        type: 'text',
        props: {
          text,
          font,
          color,
        },
      },
    ],
  };
};

const itemView = (ctx, data, { indexWidth } = {}) => {
  const [, queryString] = data.scheme.split('?');
  const query = {};
  queryString.split('&').forEach((item) => {
    const [key, value] = item.split('=');
    query[key] = value;
  });

  return {
    type: 'hstack',
    props: {
      frame: {
        maxWidth: Infinity,
        alignment: $widget.alignment.leading,
      },
      spacing: 4,
      padding: $insets(gap / 2, 0, gap / 2, 0),
      alignment:
        $widget.verticalAlignment.firstTextBaseline,
      link:
        ctx.family > 0
          ? Pages.search(query.keyword)
          : undefined,
    },
    views: [
      {
        type: 'text',
        props: {
          text: `${data.pic_id}`,
          color:
            data.pic_id > 3
              ? $color('#f5c94c')
              : $color('#fe4f67'),
          font: $font('bold', fontSize),
          frame: {
            width: indexWidth,
          },
        },
      },
      {
        type: 'text',
        props: {
          text: data.title,
          font: { size: fontSize },
          lineLimit: isNaN(lineLimit)
            ? undefined
            : lineLimit,
        },
      },
      ...(data.icon
        ? [
            {
              type: 'image',
              props: {
                image: $image(data.icon),
                resizable: true,
                frame: {
                  width: iconSize,
                  height: iconSize,
                },
                offset: $point(0, 1),
              },
            },
          ]
        : []),
    ],
  };
};

const init = async () => {
  const { data, updatedAt } = await fetchData();
  const font = $font(fontSize);
  const singleLineHeight = $text.sizeThatFits({
    text: 'Jun 哥',
    font,
    width: Infinity,
  }).height;

  $widget.setTimeline({
    render: (ctx) => {
      const size = ctx.displaySize;
      const items = [];
      const heightList = [];
      let height = 0;
      const indexSize = $text.sizeThatFits({
        text: '24',
        font: $font('bold', fontSize),
        width: fontSize * 2,
      });
      for (const item of data.data) {
        let titleMaxWidth =
          size.width -
          (12 + 14) -
          4 -
          indexSize.width;
        if (item.icon) {
          titleMaxWidth -= 4 + iconSize;
        }
        const titleSize = $text.sizeThatFits({
          text: item.title,
          font,
          width: titleMaxWidth,
        });
        const titleMaxHeight = isNaN(lineLimit)
          ? Infinity
          : singleLineHeight * lineLimit;
        const itemHeight =
          gap +
          Math.min(titleSize.height, titleMaxHeight);
        height += itemHeight;
        if (
          height + paddingVertical * 2 <=
          size.height
        ) {
          items.push(item);
          heightList.push(itemHeight);
        } else {
          break;
        }
      }
      const indexWidth =
        items.length > 9
          ? indexSize.width
          : undefined;
      const Item = (data) =>
        itemView(ctx, data, { indexWidth });

      let logoLines = 0;
      if (logoStyle == 1) {
        let lHeight = 0;
        while (logoLines < heightList.length) {
          logoLines += 1;
          const itemHeight =
            heightList[heightList.length - logoLines];
          lHeight += itemHeight;
          if (lHeight >= logoSize) break;
        }
      }

      return {
        type: 'zstack',
        props: {
          background: $color({
            light: '#fff',
            dark: '#242426',
          }),
        },
        views: [
          ...(logoStyle == 2
            ? [
                {
                  type: 'image',
                  props: {
                    frame: {
                      width: size.height * 0.5,
                      height: size.height * 0.5,
                      alignment: 'center',
                    },
                    image: $image(
                      'https://www.sinaimg.cn/blog/developer/wiki/LOGO_64x64.png'
                    ),
                    resizable: true,
                    scaledToFit: true,
                    opacity: 0.2,
                  },
                },
              ]
            : []),

          ...(timeStyle == 2
            ? [
                UpdateTime(ctx, {
                  text: `@ ${updatedAt}`,
                  font: $font(10),
                  color: $color('#666'),
                }),
              ]
            : []),

          {
            type: 'vstack',
            props: {
              frame: {
                maxWidth: Infinity,
                maxHeight: Infinity,
              },
              spacing: 0,
              alignment:
                $widget.horizontalAlignment.leading,
              padding: $insets(
                paddingVertical,
                12,
                paddingVertical,
                14
              ),
              widgetURL: Pages.hotSearch(),
            },
            views: [
              ...(timeStyle == 1
                ? [
                    {
                      type: 'hstack',
                      props: {
                        alignment:
                          $widget.verticalAlignment
                            .top,
                      },
                      views: [
                        Item(items.splice(0, 1)[0]),
                        {
                          type: 'text',
                          props: {
                            text: `更新于 ${updatedAt}`,
                            color: $color('#666'),
                            font: {
                              size: 10,
                            },
                          },
                        },
                      ],
                    },
                  ]
                : []),

              ...items
                .slice(0, items.length - logoLines)
                .map((item) =>
                  itemView(ctx, item, { indexWidth })
                ),
              ...(logoStyle == 1
                ? [
                    {
                      type: 'hstack',
                      props: {
                        alignment: 'bottom',
                      },
                      views: [
                        {
                          type: 'vstack',
                          props: {
                            spacing: 0,
                          },
                          views: items
                            .slice(-logoLines)
                            .map((item) =>
                              Item(item)
                            ),
                        },
                        {
                          type: 'image',
                          props: {
                            image: $image(
                              'https://www.sinaimg.cn/blog/developer/wiki/LOGO_64x64.png'
                            ),
                            frame: {
                              width: logoSize,
                              height: logoSize,
                            },
                            resizable: true,
                            scaledToFit: true,
                          },
                        },
                      ],
                    },
                  ]
                : []),
            ],
          },
        ],
      };
    },
  });
};

init();
