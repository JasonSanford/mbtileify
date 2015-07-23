var SetupApp = require('./setup_app')
var JobApp   = require('./job_app')

if (document.body.classList.contains('index')) {
  new SetupApp();
} else if (document.body.classList.contains('job')) {
  new JobApp();
}
