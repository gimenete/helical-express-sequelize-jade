var models = require('../../models')
var errors = require('node-errors')
var pagination = require('../pagination')

exports.configure = function(app) {

  app.get('/admin/{{ object.name | lower}}.list', pagination, function(req, res, next) {
    var id = req.query.id

    models.{{ object.name }}.findAndCountAll({
      limit: req.pagination.limit,
      offset: req.pagination.offset,
    })
    .then((result) => {
      res.render('admin/{{ object.name | lower}}/list', {
        {{ object.name | lower}}s: result.rows,
        page: req.pagination.page,
        pages: req.pagination.pages(result.count),
      })
    })
    .catch(next)
  })

  app.get('/admin/{{ object.name | lower}}.edit', function(req, res, next) {
    var id = req.query.id

    if (id) {
      models.{{ object.name }}.findById(id)
        .then((obj) => {
          if (!obj) return next(errors.notFound('{{ object.name }} with id %s not found', id))
          res.render('admin/{{ object.name | lower}}-edit', {
            {{ object.name | lower}}: obj,
          })
        })
        .catch(next)
    } else {
      res.render('admin/{{ object.name | lower}}/edit', {
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
      models.{{ object.name }}.findById(id)
        .then((obj) =>  {
          if (!obj) return next(errors.notFound('{{ object.name }} with id %s not found', id))
          var changes = {}
          {% for field in object.fields %}changes.{{ field.name }} = req.body['{{ field.name }}']
          {% endfor %}
          return obj.update(changes)
        })
        .then((obj) => {
          res.redirect('/admin/{{ object.name | lower}}.list')
        })
        .catch(next)
    } else {
      models.{{ object.name }}.create(obj)
        .then((obj) => {
          res.redirect('/admin/{{ object.name | lower}}.list')
        })
        .catch(next)
    }
  })

  app.get('/admin/{{ object.name | lower}}.delete', function(req, res, next) {
    var id = req.query.id

    models.{{ object.name }}.findById(id)
      .then((obj) => {
        if (!obj) return next(errors.notFound('{{ object.name }} with id %s not found', id))
        return obj.destroy()
      })
      .then((obj) => {
        res.redirect('/admin/{{ object.name | lower}}.list')
      })
      .catch(next)
  })


  {% for action in object.actions %}
  app.{{ action.method }}('/admin/{{ object.name | lower}}.{{ action.name }}', function(req, res, next) {
    return next(errors.internal('Not implemented'))
  })
  {% endfor %}

}
