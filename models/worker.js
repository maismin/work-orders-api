const mongoose = require('mongoose');

const options = {
  timestamps: true,
};

const workerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    companyName: {
      type: String,
      required: [true, 'Please add a company'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, // eslint-disable-line
        'Please add a valid email',
      ],
    },
    workOrders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WorkOrder',
      },
    ],
  },
  options,
);

/* eslint-disable no-underscore-dangle, no-param-reassign */
workerSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.createdAt;
    delete returnedObject.updatedAt;
  },
});
/* eslint-enable no-underscore-dangle, no-param-reassign */

module.exports = mongoose.model('Worker', workerSchema);
