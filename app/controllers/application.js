import Ember from 'ember';

class Creature {
  shrink() {
    this.age--;
  }
}

class Person extends Creature {
  constructor() {
    super();
    return Object.assign(this, Ember.Object.create({age : 23}));
  }
  grow() {
    debugger;
    this['age']++;
  }
}

let person = new Person();
console.log(person);
export default Ember.Controller.extend({
  appName: 'Ember Twiddle',
  outlet: person,
  actions: {
    go: function() {
      let person = new Person();
      this.set('outlet', person);
      console.log(person);
      person.grow();
      console.log(person, 'works');
    }
  }
});
