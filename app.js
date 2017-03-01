'use strict'

const mulig = (promises, fn = () => {}, errorFn = (message) => {}) => 
  promises.map((item, index) => {
    item
      .then(value => fn(value, index))
      .catch(errorFn)
    return item    
  })

module.exports = mulig