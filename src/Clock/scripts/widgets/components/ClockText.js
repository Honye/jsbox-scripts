const { textSize } = require('../../utils');

const ClockText = (ctx, { date, fontSize }) => {
  // `textSize()` 不支持使用 font JS 对象
  let font = {
    // 使用等宽字体
    //name: 'Courier-Bold',
    name: 'Menlo-Bold',
    monospaced: true,
    size: fontSize,
    bold: true,
  };
  font = $font('Menlo-Bold', fontSize);

  const _textSize = textSize({
    text: '00:00:00',
    font: $font('Menlo-Bold', fontSize),
  });

  const textProps = {
    font,
    color: $color('#fff'),
    lineLimit: 1,
    minimumScaleFactor: 0.1,
  };
  const diff = Date.now() - date;

  return {
    type: 'hstack',
    props: {
      spacing: 0,
    },
    modifiers: [
      {
        frame: {
          maxWidth: Math.ceil(_textSize.width),
          alignment: $widget.alignment.center,
        },
      },
    ],
    views: [
      ...// 小于 10 分钟
      (diff < 10 * 60 * 1000
        ? [
            {
              type: 'text',
              props: {
                ...textProps,
                text: '00:0',
              },
            },
          ]
        : // 小于 1 小时
        diff < 60 * 60 * 1000
        ? [
            {
              type: 'text',
              props: {
                ...textProps,
                text: '00:',
              },
            },
          ]
        : // 小于 10 小时
        diff < 10 * 60 * 60 * 1000
        ? [
            {
              type: 'text',
              props: {
                ...textProps,
                text: '0',
              },
            },
          ]
        : []),
      {
        type: 'text',
        props: {
          ...textProps,
          date,
          style: 'timer',
        },
      },
    ],
  };
};

module.exports = {
  ClockText,
};
