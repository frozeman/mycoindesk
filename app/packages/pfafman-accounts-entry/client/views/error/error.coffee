Template.entryError.helpers
  error: ->
    console.log("entryError", Session.get('entryError'))
    Session.get('entryError')
