const express = require("express");
const passport = require("passport");
const router = express.Router();

if (process.env.NODE_ENV === "development") {
  router.get("/mock", passport.authenticate("mock"));
}

// Perform the login, after login Auth0 will redirect to callback
router.get(
  "/login",
  passport.authenticate("auth0", {
    scope: "openid email profile",
  }),
  function (req, res) {
    res.redirect("/");
  }
);
// Perform the final stage of authentication and redirect to previously requested URL or '/user'
router.get("/callback", function (req, res, next) {
  passport.authenticate("auth0", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("/login");
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      const returnTo = req.session.returnTo;
      delete req.session.returnTo;
      res.redirect(returnTo || "/auth/success");
    });
  })(req, res, next);
});

router.get("/success", (req, res) => {
  res.status(200).send(`
    <html>
      <head>
        <title>Authorized</title>
      </head>
      <body>
      <p>Authorized</p>
      <p>You can close this window now</p>
      <script>
        window.onload = window.close();
        let originUrl = window.location.origin;
        if (window.location.hostname === 'localhost') {
          originUrl = 'http://localhost:3000'
        }
        window.opener.postMessage('success', originUrl);
      </script>
      </body>
    </html>
  `);
});

module.exports = router;
