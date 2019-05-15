class InvoiceRouter {

    static getModels() {
        return require('./model');
    }

    static async get(req, res, next) {
        const invoice = InvoiceRouter.getModels().Invoice;
        const result = invoice
            .find()
            .exec();
        res.locals.setBody({invoices: result});
        next('route');
    }

    static async getById(req, res, next) {
        const invoice = InvoiceRouter.getModels().Invoice;
        const result = invoice
            .findOne({_id: req.params.id})
            .exec();
        res.locals.setBody({invoices: result});
        next('route');
    }

    static async getByInvoiceNo(req, res, next) {
        const invoice = InvoiceRouter.getModels().Invoice;
        const result = invoice
            .findOne({_id: req.params.invoiceNo})
            .exec();
        res.locals.setBody({invoices: result});
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
