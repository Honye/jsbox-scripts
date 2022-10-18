if ($app.env === $env.widget) {
  const Clock = require('./scripts/widgets/clock.js');
  Clock.init();
} else {
  // const widget = require('./scripts/widget');
  // widget.init();
  const Clock = require('./scripts/widgets/clock');
  Clock.init();
}
