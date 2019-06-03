const {NotoresModule} = require('@notores/core');

class InvoiceModule extends NotoresModule {
    
    init(){
        super.init();

        const {Contact, Invoice}= require('./model');

        this.setModel(Contact.modelName, Contact);
        this.setModel(Invoice.modelName, Invoice);

        Contact.loadModel();
        Invoice.loadModel();

        require('./routes');
    }
}

module.exports = new InvoiceModule();
