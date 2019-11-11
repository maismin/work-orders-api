const mongoose = require('mongoose');

const options = {
  timestamps: true,
};

const WORKER_LIMIT = 5;

const arrayLimit = arr => arr && arr.length <= WORKER_LIMIT;

const workOrdersSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    deadline: {
      type: Date,
      min: new Date(),
      required: [true, 'Please add a deadline'],
    },
    workers: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Worker',
        },
      ],
      validate: [arrayLimit, '{PATH} exceeds the limit of 5'],
    },
  },
  options,
);

/* eslint-disable no-underscore-dangle, no-param-reassign */
workOrdersSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.createdAt;
    delete returnedObject.updatedAt;
  },
});
/* eslint-enable no-underscore-dangle, no-param-reassign */

module.exports = mongoose.model('WorkOrder', workOrdersSchema);
