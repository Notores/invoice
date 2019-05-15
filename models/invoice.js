const {MongoSchema} = require('@notores/core');
const {Schema} = require('mongoose');
const _ = require('lodash');

async function createinvoiceNo(model) {
    const latest = await model.findOne({dateSend: { $exists: 1 } }).sort({dateSend: -1}).limit(1).exec();
    if (latest) {
        return latest.invoiceNo + 1;
    }
    return (Date.now.getFullYear() * 10000) + 1;
}

const invoiceSchema = new Schema(
    {
        createdOn: {type: Date, required: true, default: Date.now},
        dateSend: {type: Date},
        dateDue: {type: Date},
        datePaid: {type: Date},
        contact: {type: Schema.Types.ObjectId, ref: 'Contact', required: true},
        invoiceNo: {type: String, required: true},

        statusUpdates: [
            {
                status: {type: 'String', required: true, default: 'Created'},
                date: {type: Date, required: true, default: Date.now},
                comment: {type: 'String', required: false, default: ''},
                updateBy: {type: Schema.Types.ObjectId, ref: 'User', required: false}
            }
        ],


        currency: {type: String, required: true, default: 'EUR'},

        invoiceLines: [
            {
                item: {type: String, required: true, default: 'Item'},
                amount: {type: Number, required: true, default: 0.00},
                unitPrice: {type: Number, required: true, default: 0.00},
                vatPercentage: {type: Number, required: true, default: 0}, // Percentage is in numbers, not decimals, so 21% would be 21, not .21
            }
        ]
    },
    {
        minimize: false,
        strict: false,
        timestamps: {createdAt: 'createdAt', updatedAt: 'updatedAt'}
    }
);

invoiceSchema.statics.createStatusUpdate = function (status = 'Created', date = Date.now, comment, updateBy) {
    return {
        status,
        date,
        comment,
        updateBy
    }
};

invoiceSchema.methods.setSend = function (daysToPay = 30, updateBy) {
    this.dateSend = Date.now;
    this.dateDue = Date.now.addDays(daysToPay);
    this.statusUpdates.push(invoiceSchema.createStatusUpdate('Send', Date.now, '', updateBy));
    this.invoiceNo = createinvoiceNo(invoiceSchema);
};

invoiceSchema.virtual('status')
    .get(function () {
        return this.statusUpdates[this.statusUpdates.length - 1] || {};
    })
    .set(function () {

    });
invoiceSchema.virtual('totalExVat')
    .get(function () {
        return this.invoiceLines.reduce((total, current) => total + (current.amount * current.unitPrice), 0);
    })
    .set(function () {
    });
invoiceSchema.virtual('totalVat')
    .get(function () {
        return this.invoiceLines.reduce((total, current) => total + _.round((current.amount * current.unitPrice) * (current.vatPercentage / 100), 2), 0);
    })
    .set(function () {
    });


const populateContact = function(next) {
    this.populate('contact');
    next();
};

invoiceSchema
    .pre('findOne', populateContact)
    .pre('find', populateContact);


const Invoice = new MongoSchema('Invoice', invoiceSchema);

module.exports = Invoice;
