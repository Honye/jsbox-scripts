exports.textSize = ({ text, font }) =>
  $text.sizeThatFits({
    text,
    width: Infinity,
    font,
  });
