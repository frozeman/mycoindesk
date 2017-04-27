(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/pfafman:accounts-entry/client/entry.coffee.js                                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var               
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

AccountsEntry = {
  settings: {
    wrapLinks: true,
    homeRoute: '/home',
    dashboardRoute: '/dashboard',
    passwordSignupFields: 'EMAIL_ONLY',
    emailToLower: true,
    usernameToLower: false,
    entrySignUp: '/sign-up',
    extraSignUpFields: [],
    showOtherLoginServices: true
  },
  routeNames: ["entrySignIn", "entrySignUp", "entryForgotPassword", "entrySignOut", 'entryResetPassword', 'entryVerifyEmail'],
  isStringEmail: function(email) {
    var emailPattern;
    emailPattern = /^([\w.-]+)@([\w.-]+)\.([a-zA-Z.]{2,6})$/i;
    if (email.match(emailPattern)) {
      return true;
    } else {
      return false;
    }
  },
  config: function(appConfig) {
    var signUpRoute;
    this.settings = _.extend(this.settings, appConfig);
    T9n.defaultLanguage = "en";
    if (appConfig.language) {
      T9n.language = appConfig.language;
    }
    if (appConfig.signUpTemplate) {
      signUpRoute = Router.routes['entrySignUp'];
      return signUpRoute.options.template = appConfig.signUpTemplate;
    }
  },
  signInRequired: function(router, pause, extraCondition) {
    var _ref, _ref1;
    if (extraCondition == null) {
      extraCondition = true;
    }
    if (!Meteor.loggingIn()) {
      if (!(Meteor.user() && extraCondition)) {
        if (_ref = (_ref1 = Router.current().route) != null ? _ref1.name : void 0, __indexOf.call(AccountsEntry.routeNames, _ref) < 0) {
          Session.set('fromWhere', router.path);
          Router.go('/sign-in');
          return pause();
        }
      }
    }
  }
};

this.AccountsEntry = AccountsEntry;

this.T9NHelper = (function() {
  function T9NHelper() {}

  T9NHelper.translate = function(code) {
    return T9n.get(code, "error.accounts");
  };

  T9NHelper.accountsError = function(err) {
    return Session.set('entryError', this.translate(err.reason));
  };

  return T9NHelper;

})();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/pfafman:accounts-entry/client/helpers.coffee.js                                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
UI.registerHelper("signedInAs", function(date) {
  if (Meteor.user().username) {
    return Meteor.user().username;
  } else if (Meteor.user().profile && Meteor.user().profile.name) {
    return Meteor.user().profile.name;
  } else if (Meteor.user().emails && Meteor.user().emails[0]) {
    return Meteor.user().emails[0].address;
  } else {
    return "Signed In";
  }
});

UI.registerHelper('accountButtons', function() {
  return Template.entryAccountButtons;
});

UI.registerHelper('capitalize', function(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
});

UI.registerHelper('signupClass', function() {
  if (AccountsEntry.settings.showOtherLoginServices && Accounts.oauth && Accounts.oauth.serviceNames().length > 0) {
    return "collapse";
  }
});

UI.registerHelper('signedIn', function() {
  if (Meteor.user()) {
    return true;
  }
});

UI.registerHelper('otherLoginServices', function() {
  return AccountsEntry.settings.showOtherLoginServices && Accounts.oauth && Accounts.oauth.serviceNames().length > 0;
});

UI.registerHelper('loginServices', function() {
  return Accounts.oauth.serviceNames();
});

UI.registerHelper('showSignupCode', function() {
  return AccountsEntry.settings.showSignupCode === true;
});

UI.registerHelper('passwordLoginService', function() {
  return !!Package['accounts-password'];
});

UI.registerHelper('showCreateAccountLink', function() {
  return !Accounts._options.forbidClientAccountCreation;
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/pfafman:accounts-entry/client/views/lib/template.processing.js                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
                                                                                                                      // 1
Template.__checkName("_accountsEntrySpinner");                                                                        // 2
Template["_accountsEntrySpinner"] = new Template("Template._accountsEntrySpinner", (function() {                      // 3
  var view = this;                                                                                                    // 4
  return HTML.DIV({                                                                                                   // 5
    "class": "accounts-entry-spinner"                                                                                 // 6
  }, "\n    ", HTML.DIV({                                                                                             // 7
    id: "spinner"                                                                                                     // 8
  }, "\n      ", Spacebars.include(view.lookupTemplate("spinner")), "\n    "), "\n  ");                               // 9
}));                                                                                                                  // 10
                                                                                                                      // 11
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/pfafman:accounts-entry/client/views/signIn/template.signIn.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
                                                                                                                      // 1
Template.__checkName("entrySignIn");                                                                                  // 2
Template["entrySignIn"] = new Template("Template.entrySignIn", (function() {                                          // 3
  var view = this;                                                                                                    // 4
  return HTML.DIV({                                                                                                   // 5
    "class": "container"                                                                                              // 6
  }, "\n    ", HTML.DIV({                                                                                             // 7
    "class": "row"                                                                                                    // 8
  }, "\n      ", Blaze.If(function() {                                                                                // 9
    return Spacebars.call(view.lookup("logo"));                                                                       // 10
  }, function() {                                                                                                     // 11
    return [ "\n        ", HTML.DIV({                                                                                 // 12
      "class": "entry-logo"                                                                                           // 13
    }, "\n            ", HTML.A({                                                                                     // 14
      href: "/"                                                                                                       // 15
    }, HTML.IMG({                                                                                                     // 16
      src: function() {                                                                                               // 17
        return Spacebars.mustache(view.lookup("logo"));                                                               // 18
      },                                                                                                              // 19
      alt: "logo"                                                                                                     // 20
    })), "\n        "), "\n      " ];                                                                                 // 21
  }), "\n      ", HTML.DIV({                                                                                          // 22
    "class": "entry col-md-4 col-md-offset-4"                                                                         // 23
  }, "\n        ", Blaze.If(function() {                                                                              // 24
    return Spacebars.call(view.lookup("otherLoginServices"));                                                         // 25
  }, function() {                                                                                                     // 26
    return [ "\n        ", HTML.DIV({                                                                                 // 27
      "class": "entry-social"                                                                                         // 28
    }, "\n          ", Blaze.Each(function() {                                                                        // 29
      return Spacebars.call(view.lookup("loginServices"));                                                            // 30
    }, function() {                                                                                                   // 31
      return [ "\n            ", Spacebars.include(view.lookupTemplate("entrySocial")), "\n          " ];             // 32
    }), "\n          ", Blaze.If(function() {                                                                         // 33
      return Spacebars.call(view.lookup("passwordLoginService"));                                                     // 34
    }, function() {                                                                                                   // 35
      return [ "\n          ", HTML.DIV({                                                                             // 36
        "class": "email-option"                                                                                       // 37
      }, "\n            ", HTML.STRONG({                                                                              // 38
        "class": "line-thru or-sign-in"                                                                               // 39
      }, Blaze.View(function() {                                                                                      // 40
        return Spacebars.mustache(view.lookup("t9n"), "OR");                                                          // 41
      })), "\n          "), "\n          " ];                                                                         // 42
    }), "\n        "), "\n        " ];                                                                                // 43
  }), "\n        ", Spacebars.include(view.lookupTemplate("entryError")), "\n        ", Blaze.Unless(function() {     // 44
    return Spacebars.call(view.lookup("otherLoginServices"));                                                         // 45
  }, function() {                                                                                                     // 46
    return [ "\n          ", HTML.DIV({                                                                               // 47
      "class": "email-option"                                                                                         // 48
    }, "\n            ", HTML.H3(Blaze.View(function() {                                                              // 49
      return Spacebars.mustache(view.lookup("t9n"), "signIn");                                                        // 50
    })), "\n          "), "\n        " ];                                                                             // 51
  }), "\n        ", Blaze.If(function() {                                                                             // 52
    return Spacebars.call(view.lookup("passwordLoginService"));                                                       // 53
  }, function() {                                                                                                     // 54
    return [ "\n          ", HTML.FORM({                                                                              // 55
      "class": "entry-form",                                                                                          // 56
      id: "signIn"                                                                                                    // 57
    }, "\n            ", HTML.DIV({                                                                                   // 58
      "class": "form-group"                                                                                           // 59
    }, "\n              ", HTML.INPUT({                                                                               // 60
      autofocus: "",                                                                                                  // 61
      name: "email",                                                                                                  // 62
      type: function() {                                                                                              // 63
        return Spacebars.mustache(view.lookup("emailInputType"));                                                     // 64
      },                                                                                                              // 65
      "class": "form-control",                                                                                        // 66
      value: function() {                                                                                             // 67
        return Spacebars.mustache(view.lookup("email"));                                                              // 68
      },                                                                                                              // 69
      placeholder: function() {                                                                                       // 70
        return Spacebars.mustache(view.lookup("emailPlaceholder"));                                                   // 71
      },                                                                                                              // 72
      autocorrect: "off",                                                                                             // 73
      autocapitalize: "off"                                                                                           // 74
    }), "\n            "), "\n            ", HTML.DIV({                                                               // 75
      "class": "form-group"                                                                                           // 76
    }, "\n              ", HTML.INPUT({                                                                               // 77
      name: "password",                                                                                               // 78
      type: "password",                                                                                               // 79
      "class": "form-control",                                                                                        // 80
      value: function() {                                                                                             // 81
        return Spacebars.mustache(view.lookup("password"));                                                           // 82
      },                                                                                                              // 83
      placeholder: function() {                                                                                       // 84
        return Spacebars.mustache(view.lookup("t9n"), "password");                                                    // 85
      }                                                                                                               // 86
    }), "\n            "), "\n            ", Blaze.Unless(function() {                                                // 87
      return Spacebars.call(view.lookup("isUsernameOnly"));                                                           // 88
    }, function() {                                                                                                   // 89
      return [ "\n              ", HTML.P(HTML.A({                                                                    // 90
        href: function() {                                                                                            // 91
          return Spacebars.mustache(view.lookup("pathFor"), "entryForgotPassword");                                   // 92
        }                                                                                                             // 93
      }, Blaze.View(function() {                                                                                      // 94
        return Spacebars.mustache(view.lookup("t9n"), "forgotPassword");                                              // 95
      }))), "\n              ", HTML.BUTTON({                                                                         // 96
        type: "submit",                                                                                               // 97
        "class": "submit btn btn-block btn-default"                                                                   // 98
      }, Blaze.View(function() {                                                                                      // 99
        return Spacebars.mustache(view.lookup("t9n"), "signIn");                                                      // 100
      })), "\n            " ];                                                                                        // 101
    }), "\n          "), "\n        " ];                                                                              // 102
  }), "\n        ", Blaze.If(function() {                                                                             // 103
    return Spacebars.call(view.lookup("showCreateAccountLink"));                                                      // 104
  }, function() {                                                                                                     // 105
    return [ "\n        ", HTML.P({                                                                                   // 106
      "class": "entry-signup-cta"                                                                                     // 107
    }, Blaze.View(function() {                                                                                        // 108
      return Spacebars.mustache(view.lookup("t9n"), "dontHaveAnAccount");                                             // 109
    }), " ", HTML.A({                                                                                                 // 110
      href: function() {                                                                                              // 111
        return Spacebars.mustache(view.lookup("pathFor"), "entrySignUp");                                             // 112
      }                                                                                                               // 113
    }, Blaze.View(function() {                                                                                        // 114
      return Spacebars.mustache(view.lookup("t9n"), "signUp");                                                        // 115
    }))), "\n        " ];                                                                                             // 116
  }), "\n      "), "\n    "), "\n  ");                                                                                // 117
}));                                                                                                                  // 118
                                                                                                                      // 119
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/pfafman:accounts-entry/client/views/signIn/signIn.coffee.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
AccountsEntry.entrySignInHelpers = {
  emailInputType: function() {
    if (AccountsEntry.settings.passwordSignupFields === 'EMAIL_ONLY') {
      return 'email';
    } else {
      return 'string';
    }
  },
  emailPlaceholder: function() {
    var fields;
    fields = AccountsEntry.settings.passwordSignupFields;
    if (_.contains(['USERNAME_AND_EMAIL', 'USERNAME_AND_OPTIONAL_EMAIL'], fields)) {
      return t9n("usernameOrEmail");
    } else if (fields === "USERNAME_ONLY") {
      return t9n("username");
    }
    return t9n("email");
  },
  logo: function() {
    return AccountsEntry.settings.logo;
  },
  isUsernameOnly: function() {
    return AccountsEntry.settings.passwordSignupFields === 'USERNAME_ONLY';
  }
};

AccountsEntry.entrySignInEvents = {
  'submit #signIn': function(event) {
    var email;
    console.log("sign in");
    event.preventDefault();
    email = $('input[name="email"]').val();
    if ((AccountsEntry.isStringEmail(email) && AccountsEntry.settings.emailToLower) || (!AccountsEntry.isStringEmail(email) && AccountsEntry.settings.usernameToLower)) {
      email = email.toLowerCase();
    }
    Session.set('email', email);
    Session.set('password', $('input[name="password"]').val());
    return Meteor.loginWithPassword(Session.get('email'), Session.get('password'), function(error) {
      Session.set('password', void 0);
      if (error) {
        return T9NHelper.accountsError(error);
      } else if (Session.get('fromWhere')) {
        Router.go(Session.get('fromWhere'));
        return Session.set('fromWhere', void 0);
      } else {
        return Router.go(AccountsEntry.settings.dashboardRoute);
      }
    });
  }
};

Template.entrySignIn.helpers(AccountsEntry.entrySignInHelpers);

Template.entrySignIn.events(AccountsEntry.entrySignInEvents);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/pfafman:accounts-entry/client/views/signUp/template.signUp.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
                                                                                                                      // 1
Template.__checkName("entrySignUp");                                                                                  // 2
Template["entrySignUp"] = new Template("Template.entrySignUp", (function() {                                          // 3
  var view = this;                                                                                                    // 4
  return [ Blaze.If(function() {                                                                                      // 5
    return Spacebars.call(view.lookup("processing"));                                                                 // 6
  }, function() {                                                                                                     // 7
    return [ " ", Spacebars.include(view.lookupTemplate("_accountsEntrySpinner")), " " ];                             // 8
  }), "\n  ", HTML.DIV({                                                                                              // 9
    "class": "container"                                                                                              // 10
  }, "\n    ", HTML.DIV({                                                                                             // 11
    "class": "row"                                                                                                    // 12
  }, "\n      ", Blaze.If(function() {                                                                                // 13
    return Spacebars.call(view.lookup("logo"));                                                                       // 14
  }, function() {                                                                                                     // 15
    return [ "\n        ", HTML.DIV({                                                                                 // 16
      "class": "entry-logo"                                                                                           // 17
    }, "\n            ", HTML.A({                                                                                     // 18
      href: "/"                                                                                                       // 19
    }, HTML.IMG({                                                                                                     // 20
      src: function() {                                                                                               // 21
        return Spacebars.mustache(view.lookup("logo"));                                                               // 22
      },                                                                                                              // 23
      alt: "logo"                                                                                                     // 24
    })), "\n        "), "\n      " ];                                                                                 // 25
  }), "\n      ", HTML.DIV({                                                                                          // 26
    "class": "entry col-md-4 col-md-offset-4"                                                                         // 27
  }, "\n        ", HTML.H3(Blaze.View(function() {                                                                    // 28
    return Spacebars.mustache(view.lookup("t9n"), "createAccount");                                                   // 29
  })), "\n        ", Blaze.If(function() {                                                                            // 30
    return Spacebars.call(view.lookup("otherLoginServices"));                                                         // 31
  }, function() {                                                                                                     // 32
    return [ "\n          ", HTML.P({                                                                                 // 33
      "class": "entry-signin-cta"                                                                                     // 34
    }, Blaze.View(function() {                                                                                        // 35
      return Spacebars.mustache(view.lookup("t9n"), "ifYouAlreadyHaveAnAccount");                                     // 36
    }), " ", HTML.A({                                                                                                 // 37
      href: function() {                                                                                              // 38
        return Spacebars.mustache(view.lookup("pathFor"), "entrySignIn");                                             // 39
      }                                                                                                               // 40
    }, Blaze.View(function() {                                                                                        // 41
      return Spacebars.mustache(view.lookup("t9n"), "signin");                                                        // 42
    })), "."), "\n          ", HTML.DIV({                                                                             // 43
      "class": "entry-social"                                                                                         // 44
    }, "\n            ", Blaze.Each(function() {                                                                      // 45
      return Spacebars.call(view.lookup("loginServices"));                                                            // 46
    }, function() {                                                                                                   // 47
      return [ "\n              ", Spacebars.include(view.lookupTemplate("entrySocial")), "\n            " ];         // 48
    }), "\n            ", Blaze.If(function() {                                                                       // 49
      return Spacebars.call(view.lookup("passwordLoginService"));                                                     // 50
    }, function() {                                                                                                   // 51
      return [ "\n              ", HTML.DIV({                                                                         // 52
        "class": "email-option"                                                                                       // 53
      }, "\n                ", HTML.STRONG({                                                                          // 54
        "class": "line-thru"                                                                                          // 55
      }, "OR"), "\n                ", HTML.A({                                                                        // 56
        "data-toggle": "collapse",                                                                                    // 57
        href: "#signUp"                                                                                               // 58
      }, "\n                  ", Blaze.View(function() {                                                              // 59
        return Spacebars.mustache(view.lookup("t9n"), "signUpWithYourEmailAddress");                                  // 60
      }), "\n                "), "\n              "), "\n            " ];                                             // 61
    }), "\n          "), "\n        " ];                                                                              // 62
  }, function() {                                                                                                     // 63
    return [ "\n            ", HTML.P({                                                                               // 64
      "class": "entry-signin-cta"                                                                                     // 65
    }, Blaze.View(function() {                                                                                        // 66
      return Spacebars.mustache(view.lookup("t9n"), "ifYouAlreadyHaveAnAccount");                                     // 67
    }), " ", HTML.A({                                                                                                 // 68
      href: function() {                                                                                              // 69
        return Spacebars.mustache(view.lookup("pathFor"), "entrySignIn");                                             // 70
      }                                                                                                               // 71
    }, Blaze.View(function() {                                                                                        // 72
      return Spacebars.mustache(view.lookup("t9n"), "signin");                                                        // 73
    })), "."), "\n        " ];                                                                                        // 74
  }), "\n        ", Spacebars.include(view.lookupTemplate("entryError")), "\n        ", Blaze.If(function() {         // 75
    return Spacebars.call(view.lookup("passwordLoginService"));                                                       // 76
  }, function() {                                                                                                     // 77
    return [ "\n          ", HTML.FORM({                                                                              // 78
      "class": function() {                                                                                           // 79
        return [ "entry-form ", Spacebars.mustache(view.lookup("signupClass")) ];                                     // 80
      },                                                                                                              // 81
      id: "signUp"                                                                                                    // 82
    }, "\n            ", Blaze.If(function() {                                                                        // 83
      return Spacebars.call(view.lookup("showUsername"));                                                             // 84
    }, function() {                                                                                                   // 85
      return [ "\n              ", HTML.DIV({                                                                         // 86
        "class": "form-group"                                                                                         // 87
      }, "\n                ", HTML.LABEL(Blaze.View(function() {                                                     // 88
        return Spacebars.mustache(view.lookup("t9n"), "username");                                                    // 89
      })), "\n                ", HTML.INPUT({                                                                         // 90
        autofocus: "",                                                                                                // 91
        name: "username",                                                                                             // 92
        type: "string",                                                                                               // 93
        "class": "form-control",                                                                                      // 94
        value: "",                                                                                                    // 95
        autocorrect: "off",                                                                                           // 96
        autocapitalize: "off"                                                                                         // 97
      }), "\n              "), "\n            " ];                                                                    // 98
    }), "\n\n            ", Blaze.If(function() {                                                                     // 99
      return Spacebars.call(view.lookup("showEmail"));                                                                // 100
    }, function() {                                                                                                   // 101
      return [ "\n              ", HTML.DIV({                                                                         // 102
        "class": "form-group"                                                                                         // 103
      }, "\n                ", HTML.LABEL(Blaze.View(function() {                                                     // 104
        return Spacebars.mustache(view.lookup("t9n"), "emailAddress");                                                // 105
      })), "\n                ", Blaze.If(function() {                                                                // 106
        return Spacebars.call(view.lookup("showUsername"));                                                           // 107
      }, function() {                                                                                                 // 108
        return [ "\n                  ", HTML.INPUT({                                                                 // 109
          type: "email",                                                                                              // 110
          "class": "form-control",                                                                                    // 111
          value: function() {                                                                                         // 112
            return Spacebars.mustache(view.lookup("emailAddress"));                                                   // 113
          }                                                                                                           // 114
        }), "\n                " ];                                                                                   // 115
      }, function() {                                                                                                 // 116
        return [ "\n                  ", HTML.INPUT({                                                                 // 117
          autofocus: "",                                                                                              // 118
          type: "email",                                                                                              // 119
          "class": "form-control",                                                                                    // 120
          value: function() {                                                                                         // 121
            return Spacebars.mustache(view.lookup("emailAddress"));                                                   // 122
          }                                                                                                           // 123
        }), "\n                " ];                                                                                   // 124
      }), "\n              "), "\n            " ];                                                                    // 125
    }), "\n\n            ", HTML.DIV({                                                                                // 126
      "class": "form-group"                                                                                           // 127
    }, "\n              ", HTML.LABEL(Blaze.View(function() {                                                         // 128
      return Spacebars.mustache(view.lookup("t9n"), "password");                                                      // 129
    })), "\n              ", HTML.INPUT({                                                                             // 130
      type: "password",                                                                                               // 131
      "class": "form-control",                                                                                        // 132
      value: "",                                                                                                      // 133
      "data-placement": "top",                                                                                        // 134
      rel: "tooltip",                                                                                                 // 135
      title: "Password must be at least 7 characters long and contain a number"                                       // 136
    }), "\n            "), "\n\n            ", Blaze.If(function() {                                                  // 137
      return Spacebars.call(view.lookup("showSignupCode"));                                                           // 138
    }, function() {                                                                                                   // 139
      return [ "\n              ", HTML.DIV({                                                                         // 140
        "class": "form-group"                                                                                         // 141
      }, "\n                ", HTML.LABEL(Blaze.View(function() {                                                     // 142
        return Spacebars.mustache(view.lookup("t9n"), "signupCode");                                                  // 143
      })), "\n                ", HTML.INPUT({                                                                         // 144
        name: "signupCode",                                                                                           // 145
        type: "string",                                                                                               // 146
        "class": "form-control",                                                                                      // 147
        value: "",                                                                                                    // 148
        autocorrect: "off",                                                                                           // 149
        autocapitalize: "off"                                                                                         // 150
      }), "\n              "), "\n            " ];                                                                    // 151
    }), "\n\n            ", Spacebars.include(view.lookupTemplate("entryExtraSignUpFields")), "\n            ", HTML.BUTTON({
      type: "submit",                                                                                                 // 153
      "class": "submit btn btn-block btn-default"                                                                     // 154
    }, Blaze.View(function() {                                                                                        // 155
      return Spacebars.mustache(view.lookup("t9n"), "signUp");                                                        // 156
    })), "\n          "), "\n        " ];                                                                             // 157
  }), "\n        ", Blaze.If(function() {                                                                             // 158
    return Spacebars.call(view.lookup("both"));                                                                       // 159
  }, function() {                                                                                                     // 160
    return [ "\n          ", HTML.P({                                                                                 // 161
      "class": "entry-agreement"                                                                                      // 162
    }, Blaze.View(function() {                                                                                        // 163
      return Spacebars.mustache(view.lookup("t9n"), "clickAgree");                                                    // 164
    }), "\n            ", HTML.A({                                                                                    // 165
      href: function() {                                                                                              // 166
        return Spacebars.mustache(view.lookup("privacyUrl"));                                                         // 167
      },                                                                                                              // 168
      target: "_blank"                                                                                                // 169
    }, Blaze.View(function() {                                                                                        // 170
      return Spacebars.mustache(view.lookup("t9n"), "privacyPolicy");                                                 // 171
    })), " ", Blaze.View(function() {                                                                                 // 172
      return Spacebars.mustache(view.lookup("t9n"), "and");                                                           // 173
    }), "\n            ", HTML.A({                                                                                    // 174
      href: function() {                                                                                              // 175
        return Spacebars.mustache(view.lookup("termsUrl"));                                                           // 176
      },                                                                                                              // 177
      target: "_blank"                                                                                                // 178
    }, Blaze.View(function() {                                                                                        // 179
      return Spacebars.mustache(view.lookup("t9n"), "terms");                                                         // 180
    })), ".\n          "), "\n        " ];                                                                            // 181
  }, function() {                                                                                                     // 182
    return [ "\n          ", Blaze.Unless(function() {                                                                // 183
      return Spacebars.call(view.lookup("neither"));                                                                  // 184
    }, function() {                                                                                                   // 185
      return [ "\n            ", HTML.P({                                                                             // 186
        "class": "entry-agreement"                                                                                    // 187
      }, Blaze.View(function() {                                                                                      // 188
        return Spacebars.mustache(view.lookup("t9n"), "clickAgree");                                                  // 189
      }), "\n              ", Blaze.If(function() {                                                                   // 190
        return Spacebars.call(view.lookup("privacyUrl"));                                                             // 191
      }, function() {                                                                                                 // 192
        return [ HTML.A({                                                                                             // 193
          href: function() {                                                                                          // 194
            return Spacebars.mustache(view.lookup("privacyUrl"));                                                     // 195
          },                                                                                                          // 196
          target: "_blank"                                                                                            // 197
        }, Blaze.View(function() {                                                                                    // 198
          return Spacebars.mustache(view.lookup("t9n"), "privacyPolicy");                                             // 199
        })), "." ];                                                                                                   // 200
      }), "\n              ", Blaze.If(function() {                                                                   // 201
        return Spacebars.call(view.lookup("termsUrl"));                                                               // 202
      }, function() {                                                                                                 // 203
        return [ HTML.A({                                                                                             // 204
          href: function() {                                                                                          // 205
            return Spacebars.mustache(view.lookup("termsUrl"));                                                       // 206
          },                                                                                                          // 207
          target: "_blank"                                                                                            // 208
        }, Blaze.View(function() {                                                                                    // 209
          return Spacebars.mustache(view.lookup("t9n"), "terms");                                                     // 210
        })), "." ];                                                                                                   // 211
      }), "\n            "), "\n          " ];                                                                        // 212
    }), "\n        " ];                                                                                               // 213
  }), "\n      "), "\n    "), "\n  ") ];                                                                              // 214
}));                                                                                                                  // 215
                                                                                                                      // 216
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/pfafman:accounts-entry/client/views/signUp/signUp.coffee.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
AccountsEntry.hashPassword = function(password) {
  return {
    digest: SHA256(password),
    algorithm: "sha-256"
  };
};

AccountsEntry.entrySignUpHelpers = {
  showEmail: function() {
    var fields;
    fields = AccountsEntry.settings.passwordSignupFields;
    return _.contains(['USERNAME_AND_EMAIL', 'USERNAME_AND_OPTIONAL_EMAIL', 'EMAIL_ONLY'], fields);
  },
  showUsername: function() {
    var fields;
    fields = AccountsEntry.settings.passwordSignupFields;
    return _.contains(['USERNAME_AND_EMAIL', 'USERNAME_AND_OPTIONAL_EMAIL', 'USERNAME_ONLY'], fields);
  },
  showSignupCode: function() {
    return AccountsEntry.settings.showSignupCode;
  },
  logo: function() {
    return AccountsEntry.settings.logo;
  },
  privacyUrl: function() {
    return AccountsEntry.settings.privacyUrl;
  },
  termsUrl: function() {
    return AccountsEntry.settings.termsUrl;
  },
  both: function() {
    return AccountsEntry.settings.privacyUrl && AccountsEntry.settings.termsUrl;
  },
  neither: function() {
    return !AccountsEntry.settings.privacyUrl && !AccountsEntry.settings.termsUrl;
  },
  emailIsOptional: function() {
    var fields;
    fields = AccountsEntry.settings.passwordSignupFields;
    return _.contains(['USERNAME_AND_OPTIONAL_EMAIL'], fields);
  },
  processing: function() {
    return Session.get('_accountsEntryProcessing');
  },
  emailAddress: function() {
    return Session.get('email');
  }
};

AccountsEntry.entrySignUpEvents = {
  'submit #signUp': function(event, t) {
    var email, emailRequired, extraFields, fields, filteredExtraFields, formValues, password, passwordErrors, signupCode, trimInput, username, usernameRequired;
    event.preventDefault();
    username = t.find('input[name="username"]') ? t.find('input[name="username"]').value.toLowerCase() : void 0;
    if (username && AccountsEntry.settings.usernameToLower) {
      username = username.toLowerCase();
    }
    signupCode = t.find('input[name="signupCode"]') ? t.find('input[name="signupCode"]').value : void 0;
    trimInput = function(val) {
      return val.replace(/^\s*|\s*$/g, "");
    };
    email = t.find('input[type="email"]') ? trimInput(t.find('input[type="email"]').value) : void 0;
    if (AccountsEntry.settings.emailToLower && email) {
      email = email.toLowerCase();
    }
    formValues = SimpleForm.processForm(event.target);
    extraFields = _.pluck(AccountsEntry.settings.extraSignUpFields, 'field');
    filteredExtraFields = _.pick(formValues, extraFields);
    password = t.find('input[type="password"]').value;
    fields = AccountsEntry.settings.passwordSignupFields;
    passwordErrors = (function(password) {
      var errMsg, msg;
      errMsg = [];
      msg = false;
      if (password.length < 7) {
        errMsg.push(t9n("error.minChar"));
      }
      if (password.search(/[a-z]/i) < 0) {
        errMsg.push(t9n("error.pwOneLetter"));
      }
      if (password.search(/[0-9]/) < 0) {
        errMsg.push(t9n("error.pwOneDigit"));
      }
      if (errMsg.length > 0) {
        msg = "";
        errMsg.forEach(function(e) {
          return msg = msg.concat("" + e + "\r\n");
        });
        Session.set('entryError', msg);
        return true;
      }
      return false;
    })(password);
    if (passwordErrors) {
      return;
    }
    emailRequired = _.contains(['USERNAME_AND_EMAIL', 'EMAIL_ONLY'], fields);
    usernameRequired = _.contains(['USERNAME_AND_EMAIL', 'USERNAME_ONLY'], fields);
    if (usernameRequired && username.length === 0) {
      Session.set('entryError', t9n("error.usernameRequired"));
      return;
    }
    if (username && AccountsEntry.isStringEmail(username)) {
      Session.set('entryError', t9n("error.usernameIsEmail"));
      return;
    }
    if (emailRequired && email.length === 0) {
      Session.set('entryError', t9n("error.emailRequired"));
      return;
    }
    if (AccountsEntry.settings.showSignupCode && signupCode.length === 0) {
      Session.set('entryError', t9n("error.signupCodeRequired"));
      return;
    }
    Session.set('_accountsEntryProcessing', true);
    return Meteor.call('entryValidateSignupCode', signupCode, function(err, valid) {
      var newUserData;
      if (valid) {
        newUserData = {
          username: username,
          email: email,
          password: AccountsEntry.hashPassword(password),
          profile: filteredExtraFields
        };
        return Meteor.call('entryCreateUser', newUserData, function(err, data) {
          var isEmailSignUp, userCredential;
          if (err) {
            console.log(err);
            T9NHelper.accountsError(err);
            Session.set('_accountsEntryProcessing', false);
            return;
          }
          isEmailSignUp = _.contains(['USERNAME_AND_EMAIL', 'EMAIL_ONLY'], AccountsEntry.settings.passwordSignupFields);
          userCredential = isEmailSignUp ? email : username;
          return Meteor.loginWithPassword(userCredential, password, function(error) {
            Session.set('_accountsEntryProcessing', false);
            if (error) {
              console.log(err);
              return T9NHelper.accountsError(error);
            } else if (Session.get('fromWhere')) {
              Router.go(Session.get('fromWhere'));
              return Session.set('fromWhere', void 0);
            } else {
              return Router.go(AccountsEntry.settings.dashboardRoute);
            }
          });
        });
      } else {
        console.log(err);
        Session.set('entryError', t9n("error.signupCodeIncorrect"));
        Session.set('_accountsEntryProcessing', false);
      }
    });
  }
};

Template.entrySignUp.rendered = function() {
  $('[rel="tooltip"]').tooltip();
  return $('[rel="popover"]').popover();
};

Template.entrySignUp.helpers(AccountsEntry.entrySignUpHelpers);

Template.entrySignUp.events(AccountsEntry.entrySignUpEvents);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/pfafman:accounts-entry/client/views/signUp/template.extraSignUpFields.js                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
                                                                                                                      // 1
Template.__checkName("entryExtraSignUpFields");                                                                       // 2
Template["entryExtraSignUpFields"] = new Template("Template.entryExtraSignUpFields", (function() {                    // 3
  var view = this;                                                                                                    // 4
  return Blaze.Each(function() {                                                                                      // 5
    return Spacebars.call(view.lookup("extraSignUpFields"));                                                          // 6
  }, function() {                                                                                                     // 7
    return [ "\n    ", Spacebars.include(view.lookupTemplate("_entryExtraSignUpField")), "\n    " ];                  // 8
  });                                                                                                                 // 9
}));                                                                                                                  // 10
                                                                                                                      // 11
Template.__checkName("_entryExtraSignUpField");                                                                       // 12
Template["_entryExtraSignUpField"] = new Template("Template._entryExtraSignUpField", (function() {                    // 13
  var view = this;                                                                                                    // 14
  return [ Blaze.If(function() {                                                                                      // 15
    return Spacebars.call(view.lookup("isTextField"));                                                                // 16
  }, function() {                                                                                                     // 17
    return [ "\n    ", HTML.DIV({                                                                                     // 18
      "class": "form-group"                                                                                           // 19
    }, "\n        ", Blaze.View(function() {                                                                          // 20
      return Spacebars.mustache(view.lookup("text_field"), view.lookup("field"), Spacebars.kw({                       // 21
        type: view.lookup("type"),                                                                                    // 22
        required: view.lookup("required"),                                                                            // 23
        label: view.lookup("label"),                                                                                  // 24
        placeholder: view.lookup("placeholder")                                                                       // 25
      }));                                                                                                            // 26
    }), "\n    "), "\n    " ];                                                                                        // 27
  }), "\n\n    ", Blaze.If(function() {                                                                               // 28
    return Spacebars.call(view.lookup("isCheckbox"));                                                                 // 29
  }, function() {                                                                                                     // 30
    return [ "\n    ", HTML.DIV({                                                                                     // 31
      "class": "checkbox"                                                                                             // 32
    }, "\n        ", Blaze.View(function() {                                                                          // 33
      return Spacebars.mustache(view.lookup("check_box"), view.lookup("name"), Spacebars.kw({                         // 34
        label: view.lookup("label"),                                                                                  // 35
        required: view.lookup("required")                                                                             // 36
      }));                                                                                                            // 37
    }), "\n    "), "\n    " ];                                                                                        // 38
  }) ];                                                                                                               // 39
}));                                                                                                                  // 40
                                                                                                                      // 41
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/pfafman:accounts-entry/client/views/signUp/extraSignUpFields.coffee.js                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Template.entryExtraSignUpFields.helpers({
  extraSignUpFields: function() {
    return AccountsEntry.settings.extraSignUpFields;
  }
});

Template._entryExtraSignUpField.helpers({
  isTextField: function() {
    return this.type !== "check_box";
  },
  isCheckbox: function() {
    return this.type === "check_box";
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/pfafman:accounts-entry/client/views/forgotPassword/template.forgotPassword.js                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
                                                                                                                      // 1
Template.__checkName("entryForgotPassword");                                                                          // 2
Template["entryForgotPassword"] = new Template("Template.entryForgotPassword", (function() {                          // 3
  var view = this;                                                                                                    // 4
  return [ Blaze.If(function() {                                                                                      // 5
    return Spacebars.call(view.lookup("processing"));                                                                 // 6
  }, function() {                                                                                                     // 7
    return [ " \n    ", Spacebars.include(view.lookupTemplate("_accountsEntrySpinner")), " \n  " ];                   // 8
  }), "\n  ", HTML.DIV({                                                                                              // 9
    "class": "container"                                                                                              // 10
  }, "\n    ", HTML.DIV({                                                                                             // 11
    "class": "row"                                                                                                    // 12
  }, "\n      ", Blaze.If(function() {                                                                                // 13
    return Spacebars.call(view.lookup("logo"));                                                                       // 14
  }, function() {                                                                                                     // 15
    return [ "\n        ", HTML.DIV({                                                                                 // 16
      "class": "entry-logo"                                                                                           // 17
    }, "\n            ", HTML.A({                                                                                     // 18
      href: "/"                                                                                                       // 19
    }, HTML.IMG({                                                                                                     // 20
      src: function() {                                                                                               // 21
        return Spacebars.mustache(view.lookup("logo"));                                                               // 22
      },                                                                                                              // 23
      alt: "logo"                                                                                                     // 24
    })), "\n        "), "\n      " ];                                                                                 // 25
  }), "\n      ", HTML.DIV({                                                                                          // 26
    "class": "entry col-md-4 col-md-offset-4"                                                                         // 27
  }, "\n        ", Blaze.If(function() {                                                                              // 28
    return Spacebars.call(view.lookup("error"));                                                                      // 29
  }, function() {                                                                                                     // 30
    return [ "\n          ", HTML.DIV({                                                                               // 31
      "class": "alert alert-danger"                                                                                   // 32
    }, Blaze.View(function() {                                                                                        // 33
      return Spacebars.mustache(view.lookup("error"));                                                                // 34
    })), "\n        " ];                                                                                              // 35
  }), "\n        ", HTML.H3(Blaze.View(function() {                                                                   // 36
    return Spacebars.mustache(view.lookup("t9n"), "forgotPassword");                                                  // 37
  })), "\n        ", HTML.FORM({                                                                                      // 38
    id: "forgotPassword"                                                                                              // 39
  }, "\n          ", HTML.DIV({                                                                                       // 40
    "class": "form-group"                                                                                             // 41
  }, "\n            ", HTML.INPUT({                                                                                   // 42
    type: "email",                                                                                                    // 43
    name: "forgottenEmail",                                                                                           // 44
    "class": "form-control",                                                                                          // 45
    placeholder: function() {                                                                                         // 46
      return Spacebars.mustache(view.lookup("t9n"), "emailAddress");                                                  // 47
    },                                                                                                                // 48
    value: ""                                                                                                         // 49
  }), "\n          "), "\n          ", HTML.BUTTON({                                                                  // 50
    type: "submit",                                                                                                   // 51
    "class": "btn btn-default"                                                                                        // 52
  }, Blaze.View(function() {                                                                                          // 53
    return Spacebars.mustache(view.lookup("t9n"), "emailResetLink");                                                  // 54
  })), "\n        "), "\n        ", Blaze.If(function() {                                                             // 55
    return Spacebars.call(view.lookup("showSignupCode"));                                                             // 56
  }, function() {                                                                                                     // 57
    return [ "\n          ", HTML.P({                                                                                 // 58
      "class": "entry-signup-cta"                                                                                     // 59
    }, Blaze.View(function() {                                                                                        // 60
      return Spacebars.mustache(view.lookup("t9n"), "dontHaveAnAccount");                                             // 61
    }), " ", HTML.A({                                                                                                 // 62
      href: function() {                                                                                              // 63
        return Spacebars.mustache(view.lookup("pathFor"), "entrySignUp");                                             // 64
      }                                                                                                               // 65
    }, Blaze.View(function() {                                                                                        // 66
      return Spacebars.mustache(view.lookup("t9n"), "signUp");                                                        // 67
    }))), "\n        " ];                                                                                             // 68
  }), "\n      "), "\n    "), "\n  ") ];                                                                              // 69
}));                                                                                                                  // 70
                                                                                                                      // 71
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/pfafman:accounts-entry/client/views/forgotPassword/forgotPassword.coffee.js                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Template.entryForgotPassword.helpers({
  error: function() {
    return t9n(Session.get('entryError'));
  },
  logo: function() {
    return AccountsEntry.settings.logo;
  },
  processing: function() {
    return Session.get('_accountsEntryProcessing');
  }
});

Template.entryForgotPassword.events({
  'submit #forgotPassword': function(event) {
    event.preventDefault();
    Session.set('email', $('input[name="forgottenEmail"]').val());
    if (Session.get('email').length === 0) {
      Session.set('entryError', 'Email is required');
      return;
    }
    Session.set('_accountsEntryProcessing', true);
    return Accounts.forgotPassword({
      email: Session.get('email')
    }, function(error) {
      if (error) {
        Session.set('entryError', error.reason);
      } else {
        CoffeeAlerts.success('An email was sent with a link to reset your password');
        Router.go(AccountsEntry.settings.homeRoute);
      }
      return Session.set('_accountsEntryProcessing', false);
    });
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/pfafman:accounts-entry/client/views/resetPassword/template.resetPassword.js                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
                                                                                                                      // 1
Template.__checkName("entryResetPassword");                                                                           // 2
Template["entryResetPassword"] = new Template("Template.entryResetPassword", (function() {                            // 3
  var view = this;                                                                                                    // 4
  return HTML.DIV({                                                                                                   // 5
    "class": "container"                                                                                              // 6
  }, "\n    ", HTML.DIV({                                                                                             // 7
    "class": "row"                                                                                                    // 8
  }, "\n      ", Blaze.If(function() {                                                                                // 9
    return Spacebars.call(view.lookup("logo"));                                                                       // 10
  }, function() {                                                                                                     // 11
    return [ "\n        ", HTML.DIV({                                                                                 // 12
      "class": "entry-logo"                                                                                           // 13
    }, "\n            ", HTML.A({                                                                                     // 14
      href: "/"                                                                                                       // 15
    }, HTML.IMG({                                                                                                     // 16
      src: function() {                                                                                               // 17
        return Spacebars.mustache(view.lookup("logo"));                                                               // 18
      },                                                                                                              // 19
      alt: "logo"                                                                                                     // 20
    })), "\n        "), "\n      " ];                                                                                 // 21
  }), "\n      ", HTML.DIV({                                                                                          // 22
    "class": "entry col-md-4 col-md-offset-4"                                                                         // 23
  }, "\n        ", Blaze.If(function() {                                                                              // 24
    return Spacebars.call(view.lookup("error"));                                                                      // 25
  }, function() {                                                                                                     // 26
    return [ "\n          ", HTML.DIV({                                                                               // 27
      "class": "alert alert-danger"                                                                                   // 28
    }, Blaze.View(function() {                                                                                        // 29
      return Spacebars.mustache(view.lookup("error"));                                                                // 30
    })), "\n        " ];                                                                                              // 31
  }), "\n        ", HTML.H3(Blaze.View(function() {                                                                   // 32
    return Spacebars.mustache(view.lookup("t9n"), "resetYourPassword");                                               // 33
  })), "\n        ", HTML.FORM({                                                                                      // 34
    id: "resetPassword"                                                                                               // 35
  }, "\n          ", HTML.Raw('<div class="form-group">\n            <input type="password" name="new-password" class="form-control" value="">\n          </div>'), "\n          ", HTML.BUTTON({
    type: "submit",                                                                                                   // 37
    "class": "btn btn-default"                                                                                        // 38
  }, Blaze.View(function() {                                                                                          // 39
    return Spacebars.mustache(view.lookup("t9n"), "updateYourPassword");                                              // 40
  })), "\n        "), "\n        ", Blaze.If(function() {                                                             // 41
    return Spacebars.call(view.lookup("showSignupCode"));                                                             // 42
  }, function() {                                                                                                     // 43
    return [ "\n          ", HTML.P({                                                                                 // 44
      "class": "entry-signup-cta"                                                                                     // 45
    }, Blaze.View(function() {                                                                                        // 46
      return Spacebars.mustache(view.lookup("t9n"), "dontHaveAnAccount");                                             // 47
    }), " ", HTML.A({                                                                                                 // 48
      href: function() {                                                                                              // 49
        return Spacebars.mustache(view.lookup("pathFor"), "entrySignUp");                                             // 50
      }                                                                                                               // 51
    }, Blaze.View(function() {                                                                                        // 52
      return Spacebars.mustache(view.lookup("t9n"), "signUp");                                                        // 53
    }))), "\n        " ];                                                                                             // 54
  }), "\n      "), "\n    "), "\n  ");                                                                                // 55
}));                                                                                                                  // 56
                                                                                                                      // 57
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/pfafman:accounts-entry/client/views/resetPassword/resetPassword.coffee.js                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Template.entryResetPassword.helpers({
  error: function() {
    return Session.get('entryError');
  },
  logo: function() {
    return AccountsEntry.settings.logo;
  }
});

Template.entryResetPassword.events({
  'submit #resetPassword': function(event) {
    var password, passwordErrors;
    event.preventDefault();
    password = $('input[type="password"]').val();
    passwordErrors = (function(password) {
      var errMsg, msg;
      errMsg = [];
      msg = false;
      if (password.length < 7) {
        errMsg.push(t9n("error.minChar"));
      }
      if (password.search(/[a-z]/i) < 0) {
        errMsg.push(t9n("error.pwOneLetter"));
      }
      if (password.search(/[0-9]/) < 0) {
        errMsg.push(t9n("error.pwOneDigit"));
      }
      if (errMsg.length > 0) {
        msg = "";
        errMsg.forEach(function(e) {
          return msg = msg.concat("" + e + "\r\n");
        });
        Session.set('entryError', msg);
        return true;
      }
      return false;
    })(password);
    if (passwordErrors) {
      return;
    }
    return Accounts.resetPassword(Session.get('resetToken'), password, function(error) {
      if (error) {
        return Session.set('entryError', error.reason || "Unknown error");
      } else {
        Session.set('resetToken', null);
        return Router.go(AccountsEntry.settings.dashboardRoute);
      }
    });
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/pfafman:accounts-entry/client/views/social/template.social.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
                                                                                                                      // 1
Template.__checkName("entrySocial");                                                                                  // 2
Template["entrySocial"] = new Template("Template.entrySocial", (function() {                                          // 3
  var view = this;                                                                                                    // 4
  return HTML.BUTTON({                                                                                                // 5
    "class": "btn",                                                                                                   // 6
    id: function() {                                                                                                  // 7
      return [ "entry-", Spacebars.mustache(view.lookup(".")) ];                                                      // 8
    },                                                                                                                // 9
    name: function() {                                                                                                // 10
      return Spacebars.mustache(view.lookup("."));                                                                    // 11
    }                                                                                                                 // 12
  }, "\n    ", Blaze.If(function() {                                                                                  // 13
    return Spacebars.call(view.lookup("unconfigured"));                                                               // 14
  }, function() {                                                                                                     // 15
    return [ "\n      ", HTML.I({                                                                                     // 16
      "class": function() {                                                                                           // 17
        return [ "fa fa-", Spacebars.mustache(view.lookup("icon")) ];                                                 // 18
      }                                                                                                               // 19
    }), " ", Blaze.View(function() {                                                                                  // 20
      return Spacebars.mustache(view.lookup("t9n"), "configure");                                                     // 21
    }), " ", Blaze.View(function() {                                                                                  // 22
      return Spacebars.mustache(view.lookup("capitalize"), view.lookup("."));                                         // 23
    }), "\n    " ];                                                                                                   // 24
  }, function() {                                                                                                     // 25
    return [ "\n      ", HTML.I({                                                                                     // 26
      "class": function() {                                                                                           // 27
        return [ "fa fa-", Spacebars.mustache(view.lookup("icon")) ];                                                 // 28
      }                                                                                                               // 29
    }), " ", Blaze.View(function() {                                                                                  // 30
      return Spacebars.mustache(view.lookup("buttonText"));                                                           // 31
    }), " ", Blaze.View(function() {                                                                                  // 32
      return Spacebars.mustache(view.lookup("t9n"), "with");                                                          // 33
    }), " ", Blaze.View(function() {                                                                                  // 34
      return Spacebars.mustache(view.lookup("capitalize"), view.lookup("."));                                         // 35
    }), "\n    " ];                                                                                                   // 36
  }), "\n  ");                                                                                                        // 37
}));                                                                                                                  // 38
                                                                                                                      // 39
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/pfafman:accounts-entry/client/views/social/social.coffee.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var capitalize;

Template.entrySocial.helpers({
  buttonText: function() {
    var buttonText;
    buttonText = Session.get('buttonText');
    if (buttonText === 'up') {
      return t9n('signUp');
    } else {
      return t9n('signIn');
    }
  },
  unconfigured: function() {
    return ServiceConfiguration.configurations.find({
      service: this.toString()
    }).fetch().length === 0;
  },
  google: function() {
    if (this[0] === 'g' && this[1] === 'o') {
      return true;
    }
  },
  icon: function() {
    switch (this.toString()) {
      case 'google':
        return 'google-plus';
      case 'meteor-developer':
        return 'rocket';
      default:
        return this;
    }
  }
});

Template.entrySocial.events({
  'click .btn': function(event) {
    var callback, loginWithService, options, serviceName;
    event.preventDefault();
    serviceName = $(event.target).attr('id').replace('entry-', '');
    callback = function(err) {
      if (!err) {
        if (Session.get('fromWhere')) {
          Router.go(Session.get('fromWhere'));
          return Session.set('fromWhere', void 0);
        } else {
          return Router.go(AccountsEntry.settings.dashboardRoute);
        }
      } else if (err instanceof Accounts.LoginCancelledError) {

      } else if (err instanceof ServiceConfiguration.ConfigError) {
        return Accounts._loginButtonsSession.configureService(serviceName);
      } else {
        return Accounts._loginButtonsSession.errorMessage(err.reason || t9n("error.unknown"));
      }
    };
    if (serviceName === 'meteor-developer') {
      loginWithService = Meteor["loginWithMeteorDeveloperAccount"];
    } else {
      loginWithService = Meteor["loginWith" + capitalize(serviceName)];
    }
    options = {};
    if (Accounts.ui._options.requestPermissions[serviceName]) {
      options.requestPermissions = Accounts.ui._options.requestPermissions[serviceName];
    }
    if (Accounts.ui._options.requestOfflineToken && Accounts.ui._options.requestOfflineToken[serviceName]) {
      options.requestOfflineToken = Accounts.ui._options.requestOfflineToken[serviceName];
    }
    return loginWithService(options, callback);
  }
});

capitalize = function(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/pfafman:accounts-entry/client/views/error/template.error.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
                                                                                                                      // 1
Template.__checkName("entryError");                                                                                   // 2
Template["entryError"] = new Template("Template.entryError", (function() {                                            // 3
  var view = this;                                                                                                    // 4
  return Blaze.If(function() {                                                                                        // 5
    return Spacebars.call(view.lookup("error"));                                                                      // 6
  }, function() {                                                                                                     // 7
    return [ "\n  ", HTML.DIV({                                                                                       // 8
      "class": "alert alert-danger"                                                                                   // 9
    }, Blaze.View(function() {                                                                                        // 10
      return Spacebars.mustache(view.lookup("error"));                                                                // 11
    })), "\n  " ];                                                                                                    // 12
  });                                                                                                                 // 13
}));                                                                                                                  // 14
                                                                                                                      // 15
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/pfafman:accounts-entry/client/views/error/error.coffee.js                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Template.entryError.helpers({
  error: function() {
    console.log("entryError", Session.get('entryError'));
    return Session.get('entryError');
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/pfafman:accounts-entry/client/views/accountButtons/template.accountButtons.js                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
                                                                                                                      // 1
Template.__checkName("entryAccountButtons");                                                                          // 2
Template["entryAccountButtons"] = new Template("Template.entryAccountButtons", (function() {                          // 3
  var view = this;                                                                                                    // 4
  return Blaze.If(function() {                                                                                        // 5
    return Spacebars.call(view.lookup("currentUser"));                                                                // 6
  }, function() {                                                                                                     // 7
    return [ "\n    ", Spacebars.include(view.lookupTemplate("signedInTemplate")), "\n  " ];                          // 8
  }, function() {                                                                                                     // 9
    return [ "\n\n    ", Spacebars.include(view.lookupTemplate("wrapLinksLi"), function() {                           // 10
      return [ "\n      ", HTML.A({                                                                                   // 11
        href: function() {                                                                                            // 12
          return Spacebars.mustache(view.lookup("pathFor"), "entrySignIn");                                           // 13
        }                                                                                                             // 14
      }, Blaze.View(function() {                                                                                      // 15
        return Spacebars.makeRaw(Spacebars.mustache(view.lookup("beforeSignIn")));                                    // 16
      }), Blaze.View(function() {                                                                                     // 17
        return Spacebars.mustache(view.lookup("t9n"), "signIn");                                                      // 18
      })), "\n    " ];                                                                                                // 19
    }), "\n\n    ", Blaze.Unless(function() {                                                                         // 20
      return Spacebars.call(view.lookup("wrapLinks"));                                                                // 21
    }, function() {                                                                                                   // 22
      return [ "\n      ", HTML.SPAN("or"), "\n    " ];                                                               // 23
    }), "\n\n    ", Blaze.If(function() {                                                                             // 24
      return Spacebars.call(view.lookup("showCreateAccountLink"));                                                    // 25
    }, function() {                                                                                                   // 26
      return [ "\n      ", Spacebars.include(view.lookupTemplate("wrapLinksLi"), function() {                         // 27
        return [ "\n        ", HTML.A({                                                                               // 28
          href: function() {                                                                                          // 29
            return Spacebars.mustache(view.lookup("entrySignUp"));                                                    // 30
          }                                                                                                           // 31
        }, Blaze.View(function() {                                                                                    // 32
          return Spacebars.makeRaw(Spacebars.mustache(view.lookup("beforeSignUp")));                                  // 33
        }), Blaze.View(function() {                                                                                   // 34
          return Spacebars.mustache(view.lookup("t9n"), "signUp");                                                    // 35
        })), "\n      " ];                                                                                            // 36
      }), "\n    " ];                                                                                                 // 37
    }), "\n  " ];                                                                                                     // 38
  });                                                                                                                 // 39
}));                                                                                                                  // 40
                                                                                                                      // 41
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/pfafman:accounts-entry/client/views/accountButtons/template._wrapLinks.js                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
                                                                                                                      // 1
Template.__checkName("wrapLinks");                                                                                    // 2
Template["wrapLinks"] = new Template("Template.wrapLinks", (function() {                                              // 3
  var view = this;                                                                                                    // 4
  return HTML.LI("\n  ", Blaze._InOuterTemplateScope(view, function() {                                               // 5
    return Spacebars.include(function() {                                                                             // 6
      return Spacebars.call(view.templateContentBlock);                                                               // 7
    });                                                                                                               // 8
  }), "\n");                                                                                                          // 9
}));                                                                                                                  // 10
                                                                                                                      // 11
Template.__checkName("noWrapLinks");                                                                                  // 12
Template["noWrapLinks"] = new Template("Template.noWrapLinks", (function() {                                          // 13
  var view = this;                                                                                                    // 14
  return Blaze._InOuterTemplateScope(view, function() {                                                               // 15
    return Spacebars.include(function() {                                                                             // 16
      return Spacebars.call(view.templateContentBlock);                                                               // 17
    });                                                                                                               // 18
  });                                                                                                                 // 19
}));                                                                                                                  // 20
                                                                                                                      // 21
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/pfafman:accounts-entry/client/views/accountButtons/template.signedIn.js                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
                                                                                                                      // 1
Template.__checkName("entrySignedIn");                                                                                // 2
Template["entrySignedIn"] = new Template("Template.entrySignedIn", (function() {                                      // 3
  var view = this;                                                                                                    // 4
  return [ Blaze.If(function() {                                                                                      // 5
    return Spacebars.call(view.lookup("profileUrl"));                                                                 // 6
  }, function() {                                                                                                     // 7
    return [ "\n  ", Spacebars.include(view.lookupTemplate("wrapLinksLi"), function() {                               // 8
      return [ "\n    ", HTML.A({                                                                                     // 9
        "class": "profileLink",                                                                                       // 10
        href: function() {                                                                                            // 11
          return Spacebars.mustache(view.lookup("profileUrl"));                                                       // 12
        }                                                                                                             // 13
      }, Blaze.View(function() {                                                                                      // 14
        return Spacebars.makeRaw(Spacebars.mustache(view.lookup("beforeSignedInAs")));                                // 15
      }), Blaze.View(function() {                                                                                     // 16
        return Spacebars.mustache(view.lookup("signedInAs"));                                                         // 17
      })), "\n  " ];                                                                                                  // 18
    }), "\n" ];                                                                                                       // 19
  }, function() {                                                                                                     // 20
    return [ "\n  ", Spacebars.include(view.lookupTemplate("wrapLinksLi"), function() {                               // 21
      return [ "\n    ", HTML.P({                                                                                     // 22
        "class": "navbar-text"                                                                                        // 23
      }, Blaze.View(function() {                                                                                      // 24
        return Spacebars.makeRaw(Spacebars.mustache(view.lookup("beforeSignedInAs")));                                // 25
      }), Blaze.View(function() {                                                                                     // 26
        return Spacebars.mustache(view.lookup("signedInAs"));                                                         // 27
      })), "\n  " ];                                                                                                  // 28
    }), "\n" ];                                                                                                       // 29
  }), "\n\n", Spacebars.include(view.lookupTemplate("wrapLinksLi"), function() {                                      // 30
    return [ "\n  ", HTML.A({                                                                                         // 31
      href: function() {                                                                                              // 32
        return Spacebars.mustache(view.lookup("pathFor"), "entrySignOut");                                            // 33
      }                                                                                                               // 34
    }, Blaze.View(function() {                                                                                        // 35
      return Spacebars.makeRaw(Spacebars.mustache(view.lookup("beforeSignOut")));                                     // 36
    }), Blaze.View(function() {                                                                                       // 37
      return Spacebars.mustache(view.lookup("t9n"), "signOut");                                                       // 38
    })), "\n" ];                                                                                                      // 39
  }) ];                                                                                                               // 40
}));                                                                                                                  // 41
                                                                                                                      // 42
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/pfafman:accounts-entry/client/views/accountButtons/accountButtons.coffee.js                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var entryAccountButtonsHelpers;

entryAccountButtonsHelpers = {
  profileUrl: function() {
    if (!AccountsEntry.settings.profileRoute) {
      return false;
    }
    return AccountsEntry.settings.profileRoute;
  },
  wrapLinksLi: function() {
    if (AccountsEntry.settings.wrapLinks) {
      return Template.wrapLinks;
    } else {
      return Template.noWrapLinks;
    }
  },
  wrapLinks: function() {
    return AccountsEntry.settings.wrapLinks;
  },
  beforeSignIn: function() {
    return AccountsEntry.settings.beforeSignIn;
  },
  beforeSignUp: function() {
    return AccountsEntry.settings.beforeSignUp;
  },
  beforeSignOut: function() {
    return AccountsEntry.settings.beforeSignOut;
  },
  beforeSignedInAs: function() {
    return AccountsEntry.settings.beforeSignedInAs;
  },
  entrySignUp: function() {
    return AccountsEntry.settings.entrySignUp;
  },
  profile: function() {
    return Meteor.user().profile;
  }
};

Template.entryAccountButtons.helpers(entryAccountButtonsHelpers);

Template.entryAccountButtons.helpers({
  signedInTemplate: function() {
    if (AccountsEntry.settings.signedInTemplate) {
      Template[AccountsEntry.settings.signedInTemplate].helpers(entryAccountButtonsHelpers);
      return Template[AccountsEntry.settings.signedInTemplate];
    } else {
      return Template.entrySignedIn;
    }
  }
});

Template.entrySignedIn.helpers(entryAccountButtonsHelpers);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/pfafman:accounts-entry/client/t9n/english.coffee.js                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var en;

en = {
  signIn: "Sign In",
  signin: "sign in",
  signOut: "Sign Out",
  signUp: "Register",
  OR: "OR",
  forgotPassword: "Forgot your password?",
  emailAddress: "Email Address",
  emailResetLink: "Email Reset Link",
  dontHaveAnAccount: "Don't have an account?",
  resetYourPassword: "Reset your password",
  updateYourPassword: "Update your password",
  password: "Password",
  usernameOrEmail: "Username or email",
  email: "Email",
  ifYouAlreadyHaveAnAccount: "If you already have an account",
  signUpWithYourEmailAddress: "Register with your email address",
  username: "Username",
  optional: "Optional",
  signupCode: "Registration Code",
  clickAgree: "By clicking Register, you agree to our",
  privacyPolicy: "Privacy Policy",
  terms: "Terms of Use",
  sign: "Sign",
  configure: "Configure",
  "with": "with",
  createAccount: "Create an Account",
  and: "and",
  "Match failed": "Match failed",
  "User not found": "User not found",
  error: {
    minChar: "7 character minimum password.",
    pwOneLetter: "Password requires 1 letter.",
    pwOneDigit: "Password must have at least one digit.",
    usernameRequired: "Username is required.",
    emailRequired: "Email is required.",
    signupCodeRequired: "Registration code is required.",
    signupCodeIncorrect: "Registration code is incorrect.",
    signInRequired: "You must be signed in to do that.",
    usernameIsEmail: "Username cannot be an email address."
  }
};

T9n.map("en", en);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/pfafman:accounts-entry/client/t9n/french.coffee.js                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var fr;

fr = {
  signIn: "Se Connecter",
  signin: "se connecter",
  signOut: "Se Deconnecter",
  signUp: "S'enregistrer",
  OR: "OU",
  forgotPassword: "Vous avez oublié votre mot de passe ?",
  emailAddress: "Adresse Email",
  emailResetLink: "Adresse pour reinitialiser votre mot de passe",
  dontHaveAnAccount: "Vous n'avez pas de compte ?",
  resetYourPassword: "Reinitialiser votre mot de passe",
  updateYourPassword: "Mettre à jour le mot de passe",
  password: "Mot de passe",
  usernameOrEmail: "Nom d'utilisateur ou email",
  email: "Email",
  ifYouAlreadyHaveAnAccount: "Si vous avez déjà un compte",
  signUpWithYourEmailAddress: "S'enregistrer avec votre adresse email",
  username: "Nom d'utilisateur",
  optional: "Optionnel",
  signupCode: "Code d'inscription",
  clickAgree: "En cliquant sur S'enregistrer, vous acceptez notre",
  privacyPolicy: "Politique de confidentialité",
  terms: "Conditions d'utilisation",
  sign: "S'enregistrer",
  configure: "Configurer",
  "with": "avec",
  createAccount: "Créer un compte",
  and: "et",
  error: {
    minChar: "Votre mot de passe doit contenir au minimum 7 caractères.",
    pwOneLetter: "Votre mot de passe doit contenir au moins une lettre.",
    pwOneDigit: "Votre mot de passe doit contenir au moins un chiffre.",
    usernameRequired: "Un nom d'utilisateur est requis.",
    emailRequired: "Un email est requis.",
    signupCodeRequired: "Un code d'inscription est requis.",
    signupCodeIncorrect: "Le code d'enregistrement est incorrect.",
    signInRequired: "Vous devez être connecté pour continuer.",
    usernameIsEmail: "Le nom d'utilisateur ne peut être le même que l'adresse email."
  }
};

T9n.map("fr", fr);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/pfafman:accounts-entry/client/t9n/german.coffee.js                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var de;

de = {
  signIn: "Anmelden",
  signin: "anmelden",
  signOut: "Abmelden",
  signUp: "Registrieren",
  OR: "ODER",
  forgotPassword: "Passwort vergessen?",
  emailAddress: "E-Mail Adresse",
  emailResetLink: "Senden",
  dontHaveAnAccount: "Noch kein Konto?",
  resetYourPassword: "Passwort zurücksetzen",
  updateYourPassword: "Passwort aktualisieren",
  password: "Passwort",
  usernameOrEmail: "Benutzername oder E-Mail",
  email: "E-Mail",
  ifYouAlreadyHaveAnAccount: "Falls Sie ein Konto haben, bitte hier",
  signUpWithYourEmailAddress: "Mit E-Mail registrieren",
  username: "Benutzername",
  optional: "Optional",
  signupCode: "Registrierungscode",
  clickAgree: "Durch die Registrierung akzeptieren Sie unsere",
  privacyPolicy: "Datenschutzerklärung",
  terms: "Geschäftsbedingungen",
  sign: "Anmelden",
  configure: "Konfigurieren",
  "with": "mit",
  createAccount: "Konto erzeugen",
  and: "und",
  error: {
    minChar: "Passwort muss mindesten 7 Zeichen lang sein.",
    pwOneLetter: "Passwort muss mindestens einen Buchstaben enthalten.",
    pwOneDigit: "Passwort muss mindestens eine Ziffer enthalten.",
    usernameRequired: "Benutzername benötigt.",
    emailRequired: "E-Mail benötigt.",
    signupCodeRequired: "Registrierungscode benötigt.",
    signupCodeIncorrect: "Registrierungscode ungültig.",
    signInRequired: "Sie müssen sich anmelden.",
    usernameIsEmail: "Benutzername kann nicht eine E-Mail."
  }
};

T9n.map("de", de);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/pfafman:accounts-entry/client/t9n/italian.coffee.js                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var it;

it = {
  signIn: "Accedi",
  signin: "accedi",
  signOut: "Esci",
  signUp: "Registrati",
  OR: "OPPURE",
  forgotPassword: "Hai dimenticato la password?",
  emailAddress: "Indirizzo Email",
  emailResetLink: "Invia Link di Reset",
  dontHaveAnAccount: "Non hai un account?",
  resetYourPassword: "Reimposta la password",
  updateYourPassword: "Aggiorna la password",
  password: "Password",
  usernameOrEmail: "Nome utente o email",
  email: "Email",
  ifYouAlreadyHaveAnAccount: "Se hai già un account",
  signUpWithYourEmailAddress: "Registrati con il tuo indirizzo email",
  username: "Username",
  optional: "Opzionale",
  signupCode: "Codice di Registrazione",
  clickAgree: "Cliccando Registrati, accetti la nostra",
  privacyPolicy: "Privacy Policy",
  terms: "Termini di Servizio",
  sign: "Accedi",
  configure: "Configura",
  "with": "con",
  createAccount: "Crea un Account",
  and: "e",
  "Match failed": "Riscontro fallito",
  "User not found": "Utente non trovato",
  error: {
    minChar: "Password di almeno 7 caratteri.",
    pwOneLetter: "La Password deve contenere 1 lettera.",
    pwOneDigit: "La Password deve contenere almeno un numero.",
    usernameRequired: "Il Nome utente è obbligatorio.",
    emailRequired: "L'Email è obbligatoria.",
    signupCodeRequired: "Il Codice di Registrazione è obbligatorio.",
    signupCodeIncorrect: "Codice di Registrazione errato.",
    signInRequired: "Per fare questo devi accedere.",
    usernameIsEmail: "Il Nome Utente non può essere un indirizzo email."
  }
};

T9n.map("it", it);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/pfafman:accounts-entry/client/t9n/polish.coffee.js                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var pl;

pl = {
  signIn: "Zaloguj się",
  signin: "zaloguj się",
  signOut: "Wyloguj się",
  signUp: "Zarejestruj się",
  OR: "LUB",
  forgotPassword: "Zapomniałeś hasła?",
  emailAddress: "Adres email",
  emailResetLink: "Wyślij email z linkiem do zmiany hasła",
  dontHaveAnAccount: "Nie masz konta?",
  resetYourPassword: "Ustaw nowe hasło",
  updateYourPassword: "Zaktualizuj swoje hasło",
  password: "Hasło",
  usernameOrEmail: "Nazwa użytkownika lub email",
  email: "Email",
  ifYouAlreadyHaveAnAccount: "Jeżeli już masz konto",
  signUpWithYourEmailAddress: "Zarejestruj się używając adresu email",
  username: "Nazwa użytkownika",
  optional: "Nieobowiązkowe",
  signupCode: "Kod rejestracji",
  clickAgree: "Klikając na Zarejestruj się zgadzasz się z naszą",
  privacyPolicy: "polityką prywatności",
  terms: "warunkami korzystania z serwisu",
  sign: "Podpisz",
  configure: "Konfiguruj",
  "with": "z",
  createAccount: "Utwórz konto",
  and: "i",
  error: {
    minChar: "7 znaków to minimalna długość hasła.",
    pwOneLetter: "Hasło musi zawierać 1 literę.",
    pwOneDigit: "Hasło musi zawierać przynajmniej jedną cyfrę.",
    usernameRequired: "Wymagana jest nazwa użytkownika.",
    emailRequired: "Wymagany jest adres email.",
    signupCodeRequired: "Wymagany jest kod rejestracji.",
    signupCodeIncorrect: "Kod rejestracji jest nieprawidłowy.",
    signInRequired: "Musisz być zalogowany, aby to zrobić.",
    usernameIsEmail: "Nazwa użytkownika nie może być adres e-mail."
  }
};

T9n.map("pl", pl);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/pfafman:accounts-entry/client/t9n/spanish.coffee.js                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var es;

es = {
  signIn: "Entrar",
  signOut: "Salir",
  signUp: "Suscribir",
  OR: "O",
  forgotPassword: "Contraseña olvidada?",
  emailAddress: "Dirección de Email",
  emailResetLink: "Reiniciar Email",
  dontHaveAnAccount: "No tenés una cuenta?",
  resetYourPassword: "Resetear tu contraseña",
  updateYourPassword: "Actualizar tu contraseña",
  password: "Contraseña",
  usernameOrEmail: "Usuario o email",
  email: "Email",
  ifYouAlreadyHaveAnAccount: "Si ya tenés una cuenta",
  signUpWithYourEmailAddress: "Suscribir con tu email",
  username: "Usuario",
  optional: "Opcional",
  signupCode: "Codigo para suscribir",
  clickAgree: "Si haces clic en Sucribir estas de acuerdo con la",
  privacyPolicy: "Póliza de Privacidad",
  terms: "Terminos de Uso",
  sign: "Ingresar",
  configure: "Disposición",
  "with": "con",
  createAccount: "Crear cuenta",
  and: "y",
  error: {
    minChar: "7 carácteres mínimo.",
    pwOneLetter: "mínimo una letra.",
    pwOneDigit: "mínimo un dígito.",
    usernameRequired: "Usuario es necesario.",
    emailRequired: "Email es necesario.",
    signupCodeRequired: "Código para suscribir es necesario.",
    signupCodeIncorrect: "Código para suscribir no coincide.",
    signInRequired: "Debes iniciar sesión para hacer eso.",
    usernameIsEmail: "Usuario no puede ser Email."
  }
};

T9n.map("es", es);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/pfafman:accounts-entry/client/t9n/swedish.coffee.js                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var sv;

sv = {
  signIn: "Logga in",
  signin: "logga in",
  signOut: "Logga ut",
  signUp: "Skapa konto",
  OR: "ELLER",
  forgotPassword: "Glömt din e-postadress?",
  emailAddress: "E-postadress",
  emailResetLink: "E-post återställningslänk",
  dontHaveAnAccount: "Har du inget konto?",
  resetYourPassword: "Återställ ditt lösenord",
  updateYourPassword: "Uppdatera ditt lösenord",
  password: "Lösenord",
  usernameOrEmail: "Användarnamn eller e-postadress",
  email: "E-postadress",
  ifYouAlreadyHaveAnAccount: "Om du redan har ett konto",
  signUpWithYourEmailAddress: "Skapa ett konto med din e-postadress",
  username: "Användarnamn",
  optional: "Valfri",
  signupCode: "Registreringskod",
  clickAgree: "När du väljer att skapa ett konto så godkänner du också vår",
  privacyPolicy: "integritetspolicy",
  terms: "användarvilkor",
  sign: "Logga",
  configure: "Konfigurera",
  "with": "med",
  createAccount: "Skapa ett konto",
  and: "och",
  "Match failed": "Matchning misslyckades",
  "User not found": "Användaren hittades inte",
  error: {
    minChar: "Det krävs minst 7 tecken i ditt lösenord.",
    pwOneLetter: "Lösenordet måste ha minst 1 bokstav.",
    pwOneDigit: "Lösenordet måste ha minst 1 siffra.",
    usernameRequired: "Det krävs ett användarnamn.",
    emailRequired: "Det krävs ett lösenord.",
    signupCodeRequired: "Det krävs en registreringskod.",
    signupCodeIncorrect: "Registreringskoden är felaktig.",
    signInRequired: "Inloggning krävs här.",
    usernameIsEmail: "Användarnamnet kan inte vara en e-postadress."
  }
};

T9n.map("sv", sv);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/pfafman:accounts-entry/client/t9n/portuguese.coffee.js                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var pt;

pt = {
  signIn: "Entrar",
  signin: "Entrar",
  signOut: "Sair",
  signUp: "Registrar",
  OR: "OU",
  forgotPassword: "Esqueceu sua senha?",
  emailAddress: "Endereço de e-mail",
  emailResetLink: "Gerar nova senha",
  dontHaveAnAccount: "Não tem conta?",
  resetYourPassword: "Gerar nova senha",
  updateYourPassword: "Atualizar senha",
  password: "Senha",
  usernameOrEmail: "Usuario ou e-mail",
  email: "E-mail",
  ifYouAlreadyHaveAnAccount: "Se você já tem uma conta",
  signUpWithYourEmailAddress: "Entre usando seu endereço de e-mail",
  username: "Nome de usuário",
  optional: "Opcional",
  signupCode: "Código de acesso",
  clickAgree: "Ao clicar em Entrar, você aceita nosso",
  privacyPolicy: "Política de Privacidade",
  terms: "Termos de Uso",
  sign: "Entrar",
  configure: "Configurar",
  "with": "com",
  createAccount: "Criar Conta",
  and: "e",
  "Match failed": "Usuário ou senha não encontrado",
  "User not found": "Usuário não encontrado",
  error: {
    minChar: "Senha requer um mínimo de 7 caracteres.",
    pwOneLetter: "Senha deve conter pelo menos uma letra.",
    pwOneDigit: "Senha deve conter pelo menos um digito.",
    usernameRequired: "Nome de usuário é obrigatório.",
    emailRequired: "E-mail é obrigatório.",
    signupCodeRequired: "É necessário um código de acesso.",
    signupCodeIncorrect: "Código de acesso incorreto.",
    signInRequired: "Você precisa estar logado para fazer isso.",
    usernameIsEmail: "Nome de usuário não pode ser um endereço de e-mail."
  }
};

T9n.map("pt", pt);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/pfafman:accounts-entry/client/t9n/slovene.coffee.js                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var sl;

sl = {
  signIn: "Prijava",
  signin: "se prijavi",
  signOut: "Odjava",
  signUp: "Registracija",
  OR: "ALI",
  forgotPassword: "Pozabljeno geslo?",
  emailAddress: "Email naslov",
  emailResetLink: "Pošlji ponastavitveno povezavo",
  dontHaveAnAccount: "Nisi registriran(a)?",
  resetYourPassword: "Ponastavi geslo",
  updateYourPassword: "Spremeni geslo",
  password: "Geslo",
  usernameOrEmail: "Uporabniško ime ali email",
  email: "Email",
  ifYouAlreadyHaveAnAccount: "Če si že registriran(a),",
  signUpWithYourEmailAddress: "Prijava z email naslovom",
  username: "Uporabniško ime",
  optional: "Po želji",
  signupCode: "Prijavna koda",
  clickAgree: "S klikom na Registracija se strinjaš",
  privacyPolicy: "z našimi pogoji uporabe",
  terms: "Pogoji uporabe",
  sign: "Prijava",
  configure: "Nastavi",
  "with": "z",
  createAccount: "Nova registracija",
  and: "in",
  "Match failed": "Prijava neuspešna",
  "User not found": "Uporabnik ne obstaja",
  "Incorrect password": "Napačno geslo",
  "Email already exists.": "Email že obstaja.",
  "Email is required": "Email je obvezen podatek",
  error: {
    minChar: "Geslo mora imeti vsaj sedem znakov.",
    pwOneLetter: "V geslu mora biti vsaj ena črka.",
    pwOneDigit: "V geslu mora biti vsaj ena številka.",
    usernameRequired: "Uporabniško ime je obvezen vnos.",
    emailRequired: "Email je obvezen vnos.",
    signupCodeRequired: "Prijavna koda je obvezen vnos.",
    signupCodeIncorrect: "Prijavna koda je napačna.",
    signInRequired: "Za to moraš biti prijavljen(a).",
    usernameIsEmail: "Uporabniško ime ne more biti email naslov."
  }
};

T9n.map("sl", sl);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/pfafman:accounts-entry/client/t9n/russian.coffee.js                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var ru;

ru = {
  signIn: "Войти",
  signin: "Войти",
  signOut: "Выйти",
  signUp: "Регистрация",
  OR: "ИЛИ",
  forgotPassword: "Забыли пароль?",
  emailAddress: "Email",
  emailResetLink: "Отправить ссылку для сброса",
  dontHaveAnAccount: "Нет аккаунта?",
  resetYourPassword: "Сбросить пароль",
  updateYourPassword: "Обновить пароль",
  password: "Пароль",
  usernameOrEmail: "Имя пользователя или email",
  email: "Email",
  ifYouAlreadyHaveAnAccount: "Если у вас уже есть аккаунт",
  signUpWithYourEmailAddress: "Зарегистрируйтесь с вашим email адресом",
  username: "Имя пользователя",
  optional: "Необязательно",
  signupCode: "Регистрационный код",
  clickAgree: "Нажав на Регистрация вы соглашаетесь с условиями",
  privacyPolicy: "Политики безопасности",
  terms: "Условиями пользования",
  sign: "Подпись",
  configure: "Конфигурировать",
  "with": "с",
  createAccount: "Создать аккаунт",
  and: "и",
  "Match failed": "Не совпадают",
  "User not found": "Пользователь не найден",
  error: {
    minChar: "Минимальное кол-во символов для пароля 7.",
    pwOneLetter: "В пароле должна быть хотя бы одна буква.",
    pwOneDigit: "В пароле должна быть хотя бы одна цифра.",
    usernameRequired: "Имя пользователя обязательно.",
    emailRequired: "Email обязательно.",
    signupCodeRequired: "Необходим регистрациооный код.",
    signupCodeIncorrect: "Неправильный регистрационный код.",
    signInRequired: "Необходимо войти для чтобы продолжить.",
    usernameIsEmail: "Имя пользователя не может быть адресом email."
  }
};

T9n.map("ru", ru);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/pfafman:accounts-entry/client/t9n/arabic.coffee.js                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var ar;

ar = {
  signIn: "تسجيل الدخول",
  signin: "تسجيل الدخول",
  signOut: "تسجيل الخروج",
  signUp: "افتح حساب جديد",
  OR: "او",
  forgotPassword: "نسيت كلمة السر؟",
  emailAddress: "البريد الالكترونى",
  emailResetLink: "اعادة تعيين البريد الالكترونى",
  dontHaveAnAccount: "ليس عندك حساب؟",
  resetYourPassword: "اعادة تعيين كلمة السر",
  updateYourPassword: "جدد كلمة السر",
  password: "كلمة السر",
  usernameOrEmail: "اسم المستخدم او البريد الالكترونى",
  email: "البريد الالكترونى",
  ifYouAlreadyHaveAnAccount: "اذا كان عندك حساب",
  signUpWithYourEmailAddress: "سجل ببريدك الالكترونى",
  username: "اسم المستخدم",
  optional: "اختيارى",
  signupCode: "رمز التسجيل",
  clickAgree: "بفتح حسابك انت توافق على",
  privacyPolicy: "سياسة الخصوصية",
  terms: "شروط الاستخدام",
  sign: "تسجيل",
  configure: "تعديل",
  "with": "مع",
  createAccount: "افتح حساب جديد",
  and: "و",
  "Match failed": "المطابقة فشلت",
  "User not found": "اسم المستخدم غير موجود",
  error: {
    minChar: "سبعة حروف هو الحد الادنى لكلمة السر",
    pwOneLetter: "كلمة السر تحتاج الى حرف اخر",
    pwOneDigit: "كلمة السر يجب ان تحتوى على رقم واحد على الاقل",
    usernameRequired: "اسم المستخدم مطلوب",
    emailRequired: "البريد الالكترونى مطلوب",
    signupCodeRequired: "رمز التسجيل مطلوب",
    signupCodeIncorrect: "رمز التسجيل غير صحيح",
    signInRequired: "عليك بتسجبل الدخول لفعل ذلك",
    usernameIsEmail: "اسم المستخدم لا يمكن ان يكون بريد الكترونى"
  }
};

T9n.map("ar", ar);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/pfafman:accounts-entry/shared/router.coffee.js                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);
