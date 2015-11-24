var models = require('../../models')
var txain = require('txain')
var errors = require('node-errors')
var pagination = require('../pagination')

exports.configure = function(app) {

  app.get('/api/{{ object.name | lower}}.list', pagination, function(req, res, next) {
    var id = req.query.id

    txain(function(callback) {
      return models.{{ object.name }}.all({
        limit: pagination.limit,
        offset: pagination.offset,
      })
    })
    .then(function(list, callback) {
      res.json({ list: list })
    })
    .end(next)
  })

  app.get('/api/{{ object.name | lower}}.show', function(req, res, next) {
    var id = req.query.id

    txain(function(callback) {
      return models.{{ object.name }}.findById(id)
    })
    .then(function(obj, callback) {
      if (!obj) return callback(errors.notFound('{{ object.name }} with id %s not found', id))
      res.json(obj)
    })
    .end(next)
  })

  app.post('/api/{{ object.name | lower}}.create', function(req, res, next) {
    var obj = {
      {% for field in object.fields %}'{{ field.name }}': req.body['{{ field.name }}'],
      {% endfor %}
    }

    txain(function(callback) {
      return models.{{ object.name }}.create(obj)
    })
    .then(function(obj, callback) {
      res.json(obj)
    })
    .end(next)
  })

  app.put('/api/{{ object.name | lower}}.update', function(req, res, next) {
    var id = req.query.id

    txain(function(callback) {
      return models.{{ object.name }}.findById(id)
    })
    .then(function(obj, callback) {
      if (!obj) return callback(errors.notFound('{{ object.name }} with id %s not found', id))
      var changes = {}
      {% for field in object.fields %}changes.{{ field.name }} = req.body['{{ field.name }}']
      {% endfor %}
      return obj.update(changes)
    })
    .then(function(obj, callback) {
      res.json(obj)
    })
    .end(next)
  })

  app.delete('/api/{{ object.name | lower}}.delete', function(req, res, next) {
    var id = req.query.id

    txain(function(callback) {
      return models.{{ object.name }}.findById(id)
    })
    .then(function(obj, callback) {
      if (!obj) return callback(errors.notFound('{{ object.name }} with id %s not found', id))
      return obj.destroy()
    })
    .then(function(obj, callback) {
      res.json(obj)
    })
    .end(next)
  })


  {% for action in object.actions %}
  app.{{ action.method }}('/{{ object.name | lower}}.{{ action.name }}', function(req, res, next) {
    res.send({ 'error': 'Not implemented' })
  })
  {% endfor %}

}
