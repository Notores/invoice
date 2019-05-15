const {NotoresModule} = require('@notores/core');
class InvoiceModule extends NotoresModule {
    
    constructor(){
        super();
        const models = require('./model');
        this.setModel(models.Contact.modelName, models.Contact);
        this.setModel(models.Invoice.modelName, models.Invoice);
        models.Contact.loadModel();
        models.Invoice.loadModel();
    }

    init(){
        require('./routes')();
    }
}

module.exports = new InvoiceModule();
