import helper from '../main'

export const doneMixin = {
  methods: {
    done (subId = 'default', ...args) {
      const id = this.$root.$el.id
      console.log(id, subId)
      console.log(helper.data[id].done)
      console.log(helper.data[id].done[subId])
      const done = helper.data[id].done[subId]
      ; done(...args)
    }
  }
}
