import Ember from 'ember';

export default Ember.Route.extend({
  model(){
    let organization = this.modelFor('organization');

    return Ember.RSVP.hash({
      roles: organization.get('roles'),
      stacks: this.store.findStacksFor(organization)
    });
  },

  afterModel(model){
    return Ember.RSVP.hash({
      users: Ember.RSVP.all(model.roles.map(r => r.get('users'))),
      // Preloading stack permissions for speedier rendering
      // Permissions are embedded in stacks#index
      permissions: Ember.RSVP.all(model.stacks.map(s => s.get('permissions')))
    });
  },

  setupController(controller, model){
    controller.set('model', model.roles);
    controller.set('stacks', model.stacks);
    controller.set('organization', this.modelFor('organization'));
  }
});
