(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                   //
// packages/pfafman:accounts-entry/server/entry.coffee.js                                            //
//                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function() {
  var AccountsEntry;
  Accounts.urls.resetPassword = function(token) {
    return Meteor.absoluteUrl('reset-password/' + token);
  };
  Accounts.urls.verifyEmail = function(token) {
    return Meteor.absoluteUrl('verify-email/' + token);
  };
  AccountsEntry = {
    settings: {},
    config: function(appConfig) {
      return this.settings = _.extend(this.settings, appConfig);
    }
  };
  this.AccountsEntry = AccountsEntry;
  return Meteor.methods({
    entryValidateSignupCode: function(signupCode) {
      check(signupCode, Match.OneOf(String, null, void 0));
      return !AccountsEntry.settings.signupCode || signupCode === AccountsEntry.settings.signupCode;
    },
    entryCreateUser: function(user) {
      var profile, userId;
      check(user, Object);
      profile = AccountsEntry.settings.defaultProfile || {};
      if (user.username) {
        userId = Accounts.createUser({
          username: user.username,
          email: user.email,
          password: user.password,
          profile: _.extend(profile, user.profile)
        });
      } else {
        userId = Accounts.createUser({
          email: user.email,
          password: user.password,
          profile: _.extend(profile, user.profile)
        });
      }
      if (user.email && Accounts._options.sendVerificationEmail) {
        this.unblock();
        return Accounts.sendVerificationEmail(userId, user.email);
      }
    }
  });
});
///////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                   //
// packages/pfafman:accounts-entry/shared/router.coffee.js                                           //
//                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                     //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var exclusions;

Router.map(function() {
  this.route("entrySignIn", {
    path: "/sign-in",
    onBeforeAction: function() {
      Session.set('entryError', void 0);
      return Session.set('buttonText', 'in');
    },
    onRun: function() {
      var pkgRendered, userRendered;
      console.log("onRun");
      Session.set('entryError', void 0);
      if (Meteor.userId()) {
        Router.go(AccountsEntry.settings.dashboardRoute);
      }
      if (AccountsEntry.settings.signInTemplate) {
        this.template = AccountsEntry.settings.signInTemplate;
        pkgRendered = Template.entrySignIn.rendered;
        userRendered = Template[this.template].rendered;
        if (userRendered) {
          Template[this.template].rendered = function() {
            pkgRendered.call(this);
            return userRendered.call(this);
          };
        } else {
          Template[this.template].rendered = pkgRendered;
        }
        Template[this.template].events(AccountsEntry.entrySignInEvents);
        return Template[this.template].helpers(AccountsEntry.entrySignInHelpers);
      }
    }
  });
  this.route("entrySignUp", {
    path: "/sign-up",
    onBeforeAction: function() {
      Session.set('entryError', void 0);
      return Session.set('buttonText', 'up');
    },
    onRun: function() {
      var pkgRendered, userRendered;
      if (AccountsEntry.settings.signUpTemplate) {
        this.template = AccountsEntry.settings.signUpTemplate;
        pkgRendered = Template.entrySignUp.rendered;
        userRendered = Template[this.template].rendered;
        if (userRendered) {
          Template[this.template].rendered = function() {
            pkgRendered.call(this);
            return userRendered.call(this);
          };
        } else {
          Template[this.template].rendered = pkgRendered;
        }
        Template[this.template].events(AccountsEntry.entrySignUpEvents);
        return Template[this.template].helpers(AccountsEntry.entrySignUpHelpers);
      }
    }
  });
  this.route("entryForgotPassword", {
    path: "/forgot-password",
    onBeforeAction: function() {
      return Session.set('entryError', void 0);
    }
  });
  this.route('entrySignOut', {
    path: '/sign-out',
    onBeforeAction: function(pause) {
      var _ref;
      Session.set('entryError', void 0);
      if ((typeof AccountsEntry !== "undefined" && AccountsEntry !== null ? (_ref = AccountsEntry.settings) != null ? _ref.homeRoute : void 0 : void 0) != null) {
        Meteor.logout(function() {
          return Router.go(AccountsEntry.settings.homeRoute);
        });
      }
      return pause();
    }
  });
  this.route('entryResetPassword', {
    path: 'reset-password/:resetToken',
    onBeforeAction: function() {
      Session.set('entryError', void 0);
      return Session.set('resetToken', this.params.resetToken);
    }
  });
  return this.route('entryVerifyEmail', {
    path: 'verify-email/:token',
    onBeforeAction: function(pause) {
      var e, _ref, _ref1;
      try {
        Accounts.verifyEmail(this.params.token, function() {
          var _ref;
          console.log("Email Verified");
          return typeof AccountsEntry !== "undefined" && AccountsEntry !== null ? (_ref = AccountsEntry.settings) != null ? typeof _ref.verifyEmailCallback === "function" ? _ref.verifyEmailCallback() : void 0 : void 0 : void 0;
        });
      } catch (_error) {
        e = _error;
        console.log("Email verify error", e);
        if (typeof AccountsEntry !== "undefined" && AccountsEntry !== null) {
          if ((_ref = AccountsEntry.settings) != null) {
            if (typeof _ref.verifyEmailCallback === "function") {
              _ref.verifyEmailCallback(e);
            }
          }
        }
      }
      if ((typeof AccountsEntry !== "undefined" && AccountsEntry !== null ? (_ref1 = AccountsEntry.settings) != null ? _ref1.homeRoute : void 0 : void 0) != null) {
        Router.go(AccountsEntry.settings.homeRoute);
      }
      return pause();
    }
  });
});

if (Meteor.isClient) {
  exclusions = [];
  _.each(Router.routes, function(route) {
    return exclusions.push(route.name);
  });
  Router.onStop(function() {
    if (!_.contains(exclusions, Router.current().route.name)) {
      return Session.set('fromWhere', Router.current().path);
    }
  });
}
///////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);
