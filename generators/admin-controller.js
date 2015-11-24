var models = require('../../models')
var txain = require('txain')
var errors = require('node-errors')
var pagination = require('../pagination')

exports.configure = function(app) {

  app.get('/admin/{{ object.name | lower}}.list', pagination, function(req, res, next) {
    var id = req.query.id

    txain(function(callback) {
      return models.{{ object.name }}.findAndCountAll({
        limit: req.pagination.limit,
        offset: req.pagination.offset,
      })
    })
    .then(function(result, callback) {
      res.render('admin/{{ object.name | lower}}-list', {
        {{ object.name | lower}}s: result.rows,
        page: req.pagination.page,
        pages: req.pagination.pages(result.count),
      })
    })
    .end(next)
  })

  app.get('/admin/{{ object.name | lower}}.edit', function(req, res, next) {
    var id = req.query.id

    if (id) {
      txain(function(callback) {
        return models.{{ object.name }}.findById(id)
      })
      .then(function(obj, callback) {
        if (!obj) return callback(errors.notFound('{{ object.name }} with id %s not found', id))
        res.render('admin/{{ object.name | lower}}-edit', {
          {{ object.name | lower}}: obj,
        })
      })
      .end(next)
    } else {
      res.render('admin/{{ object.name | lower}}-edit', {
        {{ object.name | lower}}: {},
      })
    }
  })

  app.post('/admin/{{ object.name | lower}}.edit', function(req, res, next) {
    var obj = {
      {% for field in object.fields %}'{{ field.name }}': req.body['{{ field.name }}'],
      {% endfor %}
    }

    var id = req.body.id
    if (id) {
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
        res.redirect('/admin/{{ object.name | lower}}.list')
      })
      .end(next)
    } else {
      txain(function(callback) {
        return models.{{ object.name }}.create(obj)
      })
      .then(function(obj, callback) {
        res.redirect('/admin/{{ object.name | lower}}.list')
      })
      .end(next)
    }
  })

  app.get('/admin/{{ object.name | lower}}.delete', function(req, res, next) {
    var id = req.query.id

    txain(function(callback) {
      return models.{{ object.name }}.findById(id)
    })
    .then(function(obj, callback) {
      if (!obj) return callback(errors.notFound('{{ object.name }} with id %s not found', id))
      return obj.destroy()
    })
    .then(function(obj, callback) {
      res.redirect('/admin/{{ object.name | lower}}.list')
    })
    .end(next)
  })


  {% for action in object.actions %}
  app.{{ action.method }}('/admin/{{ object.name | lower}}.{{ action.name }}', function(req, res, next) {
    return callback(errors.internal('Not implemented'))
  })
  {% endfor %}

}
