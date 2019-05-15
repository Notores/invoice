const {MongoSchema, getModule} = require('@notores/core');
const {Schema} = require('mongoose');
const SharedModels = getModule('@notores/shared-models');
const Address = SharedModels.models.Address;

const netherlandsTerms = ['the netherlands', 'netherlands'];

const contactSchema = new Schema({
    company: {type: String, required: false},
    firstName: {type: String, required: false},
    lastName: {type: String, required: false},
    address: {type: Address.schema, required: true},
    vatNumber: {type: String, required: false},
    chamberOfCommerceNumber: {type: String, required: false}
}, {
    minimize: false,
    strict: false,
    timestamps: {createdAt: 'createdAt', updatedAt: 'updatedAt'}
});

contactSchema.pre('validate', function(next) {
    const client = this;

    const hasName = client.company || client.lastName;
    if(!hasName)
        return next(new Error('Contact requires either a company or last name'));

    const dutchCompanyRequirements = client.company ?
        netherlandsTerms.indexOf(this.address.country.toLowerCase()) === -1 ||
        (client.chamberOfCommerceNumber && client.vatNo) :
        true;
    if(!dutchCompanyRequirements)
        return next(new Error('Dutch companies require Chamber of Commerce registration number and VAT number'));
    return next();
});

const Contact = new MongoSchema('Contact', contactSchema);

module.exports = Contact;
