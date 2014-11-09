Template.entryForgotPassword.helpers
  error: -> 
    t9n(Session.get('entryError'))

  logo: ->
    AccountsEntry.settings.logo

  processing: ->
    Session.get('_accountsEntryProcessing')


Template.entryForgotPassword.events
  'submit #forgotPassword': (event) ->
    event.preventDefault()
    Session.set('email', $('input[name="forgottenEmail"]').val())

    if Session.get('email').length is 0
      Session.set('entryError', 'Email is required')
      return

    Session.set('_accountsEntryProcessing', true)
    
    Accounts.forgotPassword({
      email: Session.get('email')
      }, (error)->
        if error
          Session.set('entryError', error.reason)
        else
          CoffeeAlerts.success('An email was sent with a link to reset your password')
          Router.go AccountsEntry.settings.homeRoute
        Session.set('_accountsEntryProcessing', false)
    )
