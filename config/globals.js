/**
 * Global Variable Configuration
 * (sails.config.globals)
 *
 * Configure which global variables which will be exposed
 * automatically by Sails.
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.globals.html
 */
module.exports.globals = {

  /****************************************************************************
  *                                                                           *
  * Expose the lodash installed in Sails core as a global variable. If this   *
  * is disabled, like any other node module you can always run npm install    *
  * lodash --save, then var _ = require('lodash') at the top of any file.     *
  *                                                                           *
  ****************************************************************************/

	// _: true,

  /****************************************************************************
  *                                                                           *
  * Expose the async installed in Sails core as a global variable. If this is *
  * disabled, like any other node module you can always run npm install async *
  * --save, then var async = require('async') at the top of any file.         *
  *                                                                           *
  ****************************************************************************/

	// async: true,

  /****************************************************************************
  *                                                                           *
  * Expose the sails instance representing your app. If this is disabled, you *
  * can still get access via req._sails.                                      *
  *                                                                           *
  ****************************************************************************/

	// sails: true,

  /****************************************************************************
  *                                                                           *
  * Expose each of your app's services as global variables (using their       *
  * "globalId"). E.g. a service defined in api/models/NaturalLanguage.js      *
  * would have a globalId of NaturalLanguage by default. If this is disabled, *
  * you can still access your services via sails.services.*                   *
  *                                                                           *
  ****************************************************************************/

	// services: true,

  /****************************************************************************
  *                                                                           *
  * Expose each of your app's models as global variables (using their         *
  * "globalId"). E.g. a model defined in api/models/User.js would have a      *
  * globalId of User by default. If this is disabled, you can still access    *
  * your models via sails.models.*.                                           *
  *                                                                           *
  ****************************************************************************/

	// models: true

  /*
   * To decide if we want to mandate the TrashPic or not. Set to true if we want to enforce
   */
  trashPicMandatory: false,

    /*
     * The Below list is the JSON required for creating activity log.
     * To add a new Activity log, just add a JSON at the end of this,
     * and start emitting that event from anywhere in the project.
     * No additional code is required.
     * To see how it is implemented, look at services/EventManager.js
     */
  eventObjects: [
       {event_id:'TrashCreated',description: 'A New Trash is reported', module: 'Trash'},
       {event_id:'TrashStatusUpdated',description: 'A Trash Status is Updated', module: 'Trash'},
       {description:'A Trash Noise is updated', module:'Trash',event_id:'TrashNoiseUpdated'},
       {description:'A Trash is cleared',module:'Trash',event_id:'TrashCleared'},
       {description: 'A New User signed up', module: 'User',event_id:'UserCreate'},
       {description:'A User is logged in', module: 'User',event_id:'UserLogin'},
       {description:'A User Logged out',module:'User',event_id:'UserLogout'}

  ],

  webApp:"TrashMapW",
  clientApp:"TrashMapC"




};
