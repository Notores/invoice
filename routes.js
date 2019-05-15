const InvoiceRouter = require('./Router');
const {routeWithHandle, checkEmptyParams, checkParamIsObjectId} = require('@notores/core');

module.exports = () => {
    routeWithHandle(
        'notores-listinvoices',
        '/invoices',
        [
            InvoiceRouter.get,
        ],
        {
            accepts: ['html', 'json'],
            admin: true
        },
    );

    routeWithHandle(
        'notores-invoice',
        `/invoices/:id`,
        [
            checkParamIsObjectId,
            InvoiceRouter.getById,
        ],
        {
            accepts: ['html', 'json'],
            admin: true
        },
    );

    routeWithHandle(
        'notores-invoice-id',
        `/invoices/:invoiceNo`,
        [
            checkEmptyParams,
            InvoiceRouter.getByInvoiceNo,
        ],
        {
            accepts: ['html', 'json'],
            admin: true
        },
    );
};
