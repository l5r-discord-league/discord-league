exports.up = function(knex) {
  return Promise.all([
    knex('role_types').select('id', 'name'),
    knex('elements').select('id', 'name'),
  ]).then(([roleTypes, elements]) => {
    const roles = []
    roleTypes.forEach(({ id: role_type_id, name: roleName }) => {
      if (roleName === 'Support of') {
        roles.push(
          { role_type_id, name: 'Support of the Crab' },
          { role_type_id, name: 'Support of the Crane' },
          { role_type_id, name: 'Support of the Dragon' },
          { role_type_id, name: 'Support of the Lion' },
          { role_type_id, name: 'Support of the Phoenix' },
          { role_type_id, name: 'Support of the Scorpion' },
          { role_type_id, name: 'Support of the Unicorn' }
        )
      } else {
        elements.forEach(({ id: element_id, name: elementName }) => {
          roles.push({
            role_type_id,
            element_id,
            name: `${roleName} ${elementName === 'Void' ? 'of the' : 'of'} ${elementName}`,
          })
        })
      }
    })

    return knex('roles').insert(roles)
  })
}

exports.down = function(knex) {
  return knex('roles').truncate()
}
