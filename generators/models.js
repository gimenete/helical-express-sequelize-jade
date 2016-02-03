require('dotenv').config()

var Sequelize = require('sequelize')
require('sequelize-sync-diff')(Sequelize)

var options = {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false,
}

var url = process.env.DATABASE_URL
if (url.indexOf('localhost') === -1) {
  options.dialectOptions = { ssl: true }
}
var sequelize = new Sequelize(url, options)

{% for entity in root.entities %}{#
#}var {{ entity.name }} = exports.{{ entity.name }} = sequelize.define('{{ entity.name | lower }}', {
{% for field in entity.fields %}  '{{ field.name }}': Sequelize.{{ field.type | upper }},
{% endfor %}
}, { underscored: true })

{% endfor %}

{% for entity in root.entities %}{#
#}{% for belongsTo in entity.belongsTo %}{{ entity.name }}.belongsTo({{ belongsTo.entity }})
{% endfor %}{#
#}{% for hasMany in entity.hasMany %}{{ entity.name }}.hasMany({{ hasMany.entity }}, { as: '{{ hasMany.as }}' })
{% endfor %}
{% endfor %}

Promise.resolve()
  .then(() => (
    process.env.DATABASE_URL_DUMMY
      ? sequelize.syncDiff(process.env.DATABASE_URL_DUMMY, {
          dialect: 'postgres',
          protocol: 'postgres',
          logging: false,
          dialectOptions: {
            ssl: false
          }
        })
      : sequelize.sync()
  ))
  .then(function(sql) {
    if (sql && sql.trim() > 0) {
      console.log('---------------------------------------------')
      console.log('-- Run these commands to sync the database --')
      console.log('---------------------------------------------')
      console.log()
      console.log(sql)
      console.log('---------------------------------------------')
    } else {
      console.log('Database schema synchronized')
    }

    if (module.id === require.main.id) {
      process.exit(0)
    }
  })
