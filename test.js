'use strict'

const chai = require('chai')
const expect = require('chai').expect
const checkChai = require('check-chai')
chai.use(checkChai)
const check = chai.check

const mulig = require('./app')

/**
 * Makes promises for tests
 */
const getPromise = (value, time, doFail = false) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if(doFail){
        return reject(new Error('failing'))
      }
      return resolve(value)
    }, time)
    
  })

describe('mulig: mulig', () => {

  it('result function is called 4 times', (done) => {
    let result = 0
    const promises = [
      getPromise(1, 5), 
      getPromise(1, 20), 
      getPromise(1, 10), 
      getPromise(1, 30),
    ]

    mulig(promises, 
      (value) => {
        result += value

        if(result === 4){
          check(done, () => 
            expect(result).to.equal(4))
        }
      },
      () => {}
    )
  })

  it('error function is called once', (done) => {
    const promises = [
      getPromise(1, 10), 
      getPromise(1, 20, true),
    ]

    mulig(promises, 
      () => {},
      (error) => {
        check(done, () =>
          expect(true).to.equal((error instanceof Error)))
      })
  })
})


describe('mulig: queue', () => {

  it('promises should resolve in order', (done) => {
    const promises = [
      getPromise(1, 10), 
      getPromise(1, 20),
      getPromise(1, 5),
    ]
    const order = []
    const orderExpect = [0, 1, 2]

    Promise.all(
      mulig.queue(promises, 
        (value, index) => {
          order.push(index)
        },
        () => {}
      )
    )
    .then(() => 
      check(done, () =>
        expect(order).to.deep.equal(orderExpect)
    ))
    .catch(() => {})
  }) 
})