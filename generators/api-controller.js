var models = require('../../models')
var errors = require('node-errors')
var pagination = require('../pagination')

exports.configure = function(app) {

  app.get('/api/{{ object.name | lower}}.list', pagination, function(req, res, next) {
    var id = req.query.id

    models.{{ object.name }}.all({
      limit: pagination.limit,
      offset: pagination.offset,
    })
    .then(() => {
      res.json({ list: list })
    })
    .catch(next)
  })

  app.get('/api/{{ object.name | lower}}.show', function(req, res, next) {
    var id = req.query.id

    models.{{ object.name }}.findById(id)
      .then((obj) => {
        if (!obj) return next(errors.notFound('{{ object.name }} with id %s not found', id))
        res.json(obj)
      })
      .catch(next)
  })

  app.post('/api/{{ object.name | lower}}.create', function(req, res, next) {
    var obj = {
      {% for field in object.fields %}'{{ field.name }}': req.body['{{ field.name }}'],
      {% endfor %}
    }

    models.{{ object.name }}.create(obj)
      .then((obj) => {
        res.json(obj)
      })
      .catch(next)
  })

  app.put('/api/{{ object.name | lower}}.update', function(req, res, next) {
    var id = req.query.id

    models.{{ object.name }}.findById(id)
      .then((obj) => {
        if (!obj) return next(errors.notFound('{{ object.name }} with id %s not found', id))
        var changes = {}
        {% for field in object.fields %}changes.{{ field.name }} = req.body['{{ field.name }}']
        {% endfor %}
        return obj.update(changes)
      })
      .then((obj) => {
        res.json(obj)
      })
      .catch(next)
  })

  app.delete('/api/{{ object.name | lower}}.delete', function(req, res, next) {
    var id = req.query.id

    models.{{ object.name }}.findById(id)
      .then((obj) => {
        if (!obj) return next(errors.notFound('{{ object.name }} with id %s not found', id))
        return obj.destroy()
      })
      .then((obj) => {
        res.json(obj)
      })
      .catch(next)
  })

  {% for action in object.actions %}
  app.{{ action.method }}('/{{ object.name | lower}}.{{ action.name }}', function(req, res, next) {
    res.send({ 'error': 'Not implemented' })
  })
  {% endfor %}

}
