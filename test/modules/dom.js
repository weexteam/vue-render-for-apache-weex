/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import dom from '../../src/modules/dom'
import helper from '../helper/main'

helper.initWithWeex('dom module', {
  plugins: [dom]
}, () => {
  const callback = sinon.spy()
  let domModule, node, vnode

  before(() => {
    node = document.createElement('div')
    document.body.appendChild(node)
    vnode = {
      $el: node
    }
    domModule = weex.requireModule('dom')
  })

  after(() => {
    node.parentElement.removeChild(node)
  })
  
  it('should scrollToElement be worked', (done) => {
    const {
      scrollToElement
    } = domModule
    const options = {
      offset: 100
    }
    node.style.height = '100px'
    node.style.width = '100px'
    node.style.backgroundColor = 'green'
    node.style['margin-top'] = '800px'
    expect(scrollToElement).to.be.a('function')
    scrollToElement([vnode], options)
    setTimeout(() => {
      expect(document.body.scrollTop).to.be.equal(0)
      scrollToElement(vnode, {
        animated: false
      })
      expect(document.body.scrollTop).to.be.equal(0)
      done()
    }, 500)
  })

  it('should getComponentRect be worked', () => {
    const {
      getComponentRect
    } = domModule
    const node = document.createElement('div')
    const vnode = {
      $el: node,
      $refs: {}
    }
    const rectKeys = ['width', 'height', 'top', 'bottom', 'left', 'right']
    let message
    const scale = window.weex.config.env.scale
    const recalc = (rect) => {
      const res = {}
      rectKeys.forEach(function (key) {
        res[key] = rect[key] / scale
      })
      return res
    }
    node.style.height = '100px'
    node.style.width = '100px'
    document.body.appendChild(node)
    expect(getComponentRect).to.be.a('function')
    // while node is an element
    message = getComponentRect([vnode], callback)
    expect(message.result).to.be.true
    expect(message.size.width).to.be.equal(recalc({
      width: 100
    }).width)
    expect(message.size.height).to.be.equal(recalc({
      height: 100
    }).height)
    expect(callback.callCount).to.be.equal(1)

    // while node is a viewport
    message = getComponentRect('viewport', callback)
    expect(message.result).to.be.true
    expect(message.size.width).to.be.equal(recalc({
      width: document.documentElement.clientWidth
    }).width)
    expect(message.size.right).to.be.equal(recalc({
      right: document.documentElement.clientWidth
    }).right)
    expect(message.size.height).to.be.equal(recalc({
      height: document.documentElement.clientHeight
    }).height)
    expect(message.size.bottom).to.be.equal(recalc({
      bottom: document.documentElement.clientHeight
    }).bottom)
    expect(callback.callCount).to.be.equal(2)
    document.body.removeChild(node)
  })

  it('should getLayoutDirection be worked', () => {
    const { getLayoutDirection } = domModule
    const node = document.createElement('div')
    const vnode = {
      $el: node,
      $refs: {}
    }
    let message
    node.style.height = '100px'
    node.style.width = '100px'
    node.style.direction = 'rtl'
    document.body.appendChild(node)
    expect(getLayoutDirection).to.be.a('function')
    // while node is an element
    message = getLayoutDirection([vnode], callback)
    expect(message).to.be.equal(node.style.direction)
    expect(callback.callCount).to.be.equal(3)

    // while node is a viewport
    message = getLayoutDirection('viewport', callback)
    expect(message).to.be.equal(
      window.getComputedStyle(document.documentElement)['direction']
    )
    expect(callback.callCount).to.be.equal(4)
    document.body.removeChild(node)
  })

  it('should addRule be worked', () => {
    const {
      addRule
    } = domModule
    const key = 'font-face'
    const styles = {
      'font-family': 'iconfont'
    }
    expect(addRule).to.be.a('function')
    addRule(key, styles)
    const styleElement = document.getElementById('dom-added-rules')
    expect(styleElement.innerText).to.be.equal('@font-face{font-family:iconfont;}')
  })
})
