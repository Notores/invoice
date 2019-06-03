class InvoiceRouter {

    static getModels() {
        return require('./model');
    }

    static getInvoiceModel() {
        return InvoiceRouter.getModels().Invoice.model;
    }

    static getContactModel() {
        return InvoiceRouter.getModels().Contact.model;
    }

    static async get(req, res, next) {
        const Invoice = InvoiceRouter.getInvoiceModel();
        const result = Invoice
            .find()
            .exec();
        res.locals.setBody({invoice: result});
        next('route');
    }

    static async getById(req, res, next) {
        const Invoice = InvoiceRouter.getInvoiceModel();
        const result = Invoice
            .findById(req.params.id)
            .exec();
        res.locals.setBody({invoice: result});
        next('route');
    }

    static async getByInvoiceNo(req, res, next) {
        const Invoice = InvoiceRouter.getInvoiceModel();
        const result = Invoice
            .findOne({invoiceNo: req.params.invoiceNo})
            .exec();
        res.locals.setBody({invoice: result});
        next('route');
    }

    static async post(req, res, next) {
        next('route');
    }

    static async delete(req, res, next) {
        next('route');
    }
}

module.exports = InvoiceRouter;
