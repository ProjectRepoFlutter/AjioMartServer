const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    user: {
        type: String, // Reference to the user
        required: true
    },
    name: {
        type: String,
        required: true
    },
    label: {
        type: String,  // e.g., 'Home', 'Office', 'Other'
        required: true
    },
    addressLine1: {
        type: String,
        required: true
    },
    addressLine2: {
        type: String
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    isDefault: {
        type: Boolean,
        default: false  // One address can be marked as default
    }
});

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;