import Ember from 'ember';
import mixinify from 'ember-mixinify-class';


const {get,set} = Ember;

const $isProxy = Symbol();
const $target = Symbol();

const handler = {
	has() {
	},
	get(target, property/*, receiver*/) {
		if(property === $isProxy) {
			return true;
		}

		if(property === $target) {
			return target;
		}

		const value = get(target, property);
		if(typeof value !== 'function' && value instanceof Object) {
			return proxify(value);
		}

		return value;
	},
	set(target, property, value/*, receiver*/) {
		let val = isProxy(value) && value[$target] || value;
		set(target, property, val);
	},
};

function proxifyFunction(func) {
	return function proxyWrapper(...args) {
		func.apply(proxify(this), args.map(arg => proxify(arg)));
	};
}

export function proxify(target) {
	// if(arguments.length === 0 && typeof this === 'function') {
	// 	return proxifyFunction(this);
	// }

	if(typeof target === 'function') {
		return proxifyFunction(target);
	}

	if(target instanceof Object && !isProxy(target)) {
		return new Proxy(target, handler);
	}

	return target;
}

export function isProxy(target) {
	return target[$isProxy] || false;
}





class Creature {
  shrink() {
    this.age--;
  }
}

class Person extends Creature {
  grow() {
    debugger;
    this['age']++;
  }
}

Ember.Object.reopenClass({
  extend(...args) {
    let last = args.pop();

    Object.keys(last).forEach(key => {
      last[key] = proxify(last[key]);
    });

    return this._super(...args, last);
  }
});

const EmberPerson = Ember.Object.extend(mixinify(Person)).create({age:23});
EmberPerson.age++;
EmberPerson.age++;
EmberPerson.grow.call(EmberPerson);
EmberPerson.grow();
console.log(EmberPerson);
const proxy = Ember.ObjectProxy.create({
  content: EmberPerson
});

export default Ember.Controller.extend({
  appName: 'Ember Twiddle',
  outlet: {age : 55}, //EmberPerson kills it
  actions: {
    go: function() {
      console.log(EmberPerson)
			EmberPerson.age++;
      EmberPerson.grow();
    }
  }
});
