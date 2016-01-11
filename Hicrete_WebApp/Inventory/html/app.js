.state('Inventory.prodInit', {
            url: '/prodInit',
            templateUrl: 'Inventory/html/productionBatch/inventory_Production_Batch.html',
            controller: 'productionBatchController'
        })
        .state('Inventory.prodSearch', {
            url: '/prodSearch',
            templateUrl: 'Inventory/html/productionBatch/Inventory_prodBatch_Inq.html',
            controller: 'productionBatchController'
        })
        .state('Inventory.prodInq', {
            url: '/prodInq',
            templateUrl: 'Inventory/html/productionBatch/Inventory_prodBatch_InquiryAll.html',
            controller: 'productionBatchController'
        })