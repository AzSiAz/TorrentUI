const { Router } = require('express')
const listEndpoints = require('express-list-endpoints')
const expressStatusMonitor = require('express-status-monitor')

const { catchErrors, ignoreErrors } = require('../utils/async')
const { basicAuth, isAuthenticated, populateUser } = require('../services/middleware')
const CTRL = require('./controller')

const router = Router()

router.get('/', (req, res) => res.json(listEndpoints(router)))

router.use('/status', basicAuth, expressStatusMonitor())
router.post('/login', catchErrors(CTRL.usersCtrl.login))
router.get('/logout', isAuthenticated, populateUser, catchErrors(CTRL.usersCtrl.logout))
router.post('/signup', catchErrors(CTRL.usersCtrl.createAccount))

router.get('/account/activate', catchErrors(CTRL.usersCtrl.activateAccount))
router.route('/account/password/reset')
  .post(catchErrors(CTRL.usersCtrl.forgetPassword.forgetPasswordPost))
  .get(catchErrors(CTRL.usersCtrl.forgetPassword.forgetPasswordGet))
router.route('/account/password/modify')
  .post(isAuthenticated, catchErrors(CTRL.usersCtrl.forgetPassword.forgetPasswordPost))


// router.route('/contact')
//   .post(catchErrors(CTRL.contactCtrl.postContact))

// router.route('/login')
//   .post(catchErrors(CTRL.usersCtrl.login))

// router.route('/logout')
//   .get(CTRL.usersCtrl.logout)

// router.route('/forgot')
//   .post(catchErrors(CTRL.forgotCtrl.postForgot))

// router.route('/reset/:token')
//   .get(catchErrors(CTRL.resetCtrl.getReset))
//   .post(catchErrors(CTRL.resetCtrl.postReset))

// router.route('/signup')
//   .get(catchErrors(CTRL.signupCtrl.getSignup))
//   .post(catchErrors(CTRL.signupCtrl.postSignup))

// router.route('/account')
//   .get(isAuthenticated, catchErrors(CTRL.accountCtrl.getAccount))

// router.route('/account/profile')
//   .post(isAuthenticated, catchErrors(CTRL.accountCtrl.postUpdateProfile))

// router.route('/account/password')
//   .post(isAuthenticated, catchErrors(CTRL.accountCtrl.postUpdatePassword))

// router.route('/account/delete')
//   .post(isAuthenticated, catchErrors(CTRL.accountCtrl.postDeleteAccount))

// router.route('/dashboard')
//   .get(isAuthenticated, catchErrors(CTRL.dashboardCtrl.getDashboard))

// router.route('/dashboard/torrents')
//   .get(isAuthenticated, catchErrors(CTRL.dashboardCtrl.getDashboardTorrents))

// router.route('/dashboard/torrents/:hash')
//   .get(isAuthenticated, catchErrors(CTRL.dashboardCtrl.getDashboardTorrents))


// router.get('/api/torrents', isAuthenticated, catchErrors(CTRL.transmissionCtrl.getAllTorrents))
// router.get('/api/torrents/public', isAuthenticated, catchErrors(CTRL.transmissionCtrl.getPublicTorrents))
// router.post('/api/torrent/add/file', isAuthenticated, upload.single('file'), catchErrors(CTRL.transmissionCtrl.addTorrentByFile))
// router.post('/api/torrent/add/', isAuthenticated, catchErrors(CTRL.transmissionCtrl.addTorrentByUrl))
// router.put('/api/torrent/start/:id', isAuthenticated, catchErrors(CTRL.transmissionCtrl.startTorrent))
// router.put('/api/torrent/stop/:id', isAuthenticated, catchErrors(CTRL.transmissionCtrl.stopTorrent))
// router.delete('/api/torrent/:id', isAuthenticated, catchErrors(CTRL.transmissionCtrl.deleteTorrent))
// router.get('/api/torrent/:id', isAuthenticated, catchErrors(CTRL.transmissionCtrl.getOneTorrent))

module.exports = router
