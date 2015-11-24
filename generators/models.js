var Sequelize = require('sequelize')

var options = {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false,
}

var url = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost/{{ root.projectName }}'
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

sequelize.sync().then(function() {
  console.log('Database schema synchronized')
})
