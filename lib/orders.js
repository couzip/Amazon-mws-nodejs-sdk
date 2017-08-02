/**
 * Orders API requests and definitions for Amazon's MWS web services.
 * For information on using, please see examples folder.
 *
 * @author Jakub Gančo, Zdeněk Pečínka
 */

var mws = require('./mws');
var _ = require('underscore');

module.exports = {
    /**
     * @absract Returns the operational status of the Orders API section.
     * @description he GetServiceStatus operation returns the operational status of the Orders API section of Amazon Marketplace Web Service. Status values are GREEN, GREEN_I, YELLOW, and RED.

     The GetServiceStatus operation has a maximum request quota of two and a restore rate of one request every five minutes. For definitions of throttling terminology, see What you should know about the Orders API section.
     * @param {Object} config Configuration file
     * @param {Boolean} xml flag. If true, returns raw xml although returns object
     * @param {Function} cb Callback function
     * @see http://docs.developer.amazonservices.com/en_US/orders/2013-09-01/MWS_GetServiceStatus.html
     */
    GetServiceStatus: function(config, xml, cb) {
        if (typeof xml == 'function') {
            cb = xml;
            xml = false;
        } else if (typeof xml == 'undefined') {
            console.warn("No callback provided. Throwing the request");
            return;
        }
        mws.createRequest({
            'action': 'GetServiceStatus',
            'config': config,
            'parameters': {},
            'type': 'Orders',
            "xml": xml
        }, function(err, data) {
            cb(err, data);
        });
    },

    ListOrders: function(config, params, xml, cb) {
        if (typeof xml == 'function') {
            cb = xml;
            xml = false;
        } else if (typeof xml == 'undefined') {
            console.warn("No callback provided. Throwing the request");
            return;
        }

        if (!_.has(params, 'MarketplaceIdList') || !_.has(params, 'CreatedAfter') || !_.has(params, 'CreatedBefore')) {
            cb({
                "Error": "You need to pass parameter MarketplaceId and CreatedAfter and CreatedBefore"
            }, null);
            return;
        }

        var parameters = {
            "CreatedAfter": params['CreatedAfter'],
            "CreatedBefore": params['CreatedBefore'],
        };

        if (_.has(params, 'MarketplaceIdList')) {
            var counter = 1;
            for (var key in params['MarketplaceIdList']) {
                if (/MarketplaceId.Id.[1-9]+/.test(key)) {
                    parameters[key] = params['MarketplaceIdList'][key];
                }
                counter++;
                if (counter > 20) {
                    break;
                }
            }
        }

        mws.createRequest({
            'action': 'ListOrders',
            'config': config,
            'parameters': parameters,
            'type': 'Orders',
            "xml": xml
        }, function(err, data) {
            cb(err, data);
        });
    },

    /**
     * @absract Returns the next page of orders using the NextToken parameter.
     * @description The ListOrdersByNextToken operation returns the next page of orders using the NextToken value that was returned by your previous request to either ListOrders or ListOrdersByNextToken. If NextToken is not returned, there are no more pages to return.

     The ListOrders and ListOrdersByNextToken operations together share a maximum request quota of six and a restore rate of one request every minute.
     * @param {Object} config Configuration file
     * @param {Object} params Required: NextToken
     * @param {Boolean} xml flag. If true, returns raw xml although returns object
     * @param {Function} cb Callback function
     * @see http://docs.developer.amazonservices.com/en_US/orders-2013-09-01/Orders_ListOrdersByNextToken.html
     */
    ListOrdersByNextToken: function(config, params, xml, cb) {
        if (typeof xml == 'function') {
            cb = xml;
            xml = false;
        } else if (typeof xml == 'undefined') {
            console.warn("No callback provided. Throwing the request");
            return;
        }

        if (!_.has(params, 'NextToken')) {
            cb({
                "Error": "You need to pass parameter NextToken"
            }, null);
            return;
        }

        var parameters = {
            // needs to be encoded since it usually contains special characters
            "NextToken": encodeURIComponent(params['NextToken']),
        };

        mws.createRequest({
            'action': 'ListOrdersByNextToken',
            'config': config,
            'parameters': parameters,
            'type': 'Orders',
            "xml": xml
        }, function(err, data) {
            cb(err, data);
        });
    },

    ListOrderItems: function(config, params, xml, cb) {
        if (typeof xml == 'function') {
            cb = xml;
            xml = false;
        } else if (typeof xml == 'undefined') {
            console.warn("No callback provided. Throwing the request");
            return;
        }

        if (!_.has(params, 'AmazonOrderId')) {
            cb({
                "Error": "You need to pass parameter AmazonOrderId"
            }, null);
            return;
        }

        var parameters = {
            "AmazonOrderId": params['AmazonOrderId'],
        };

        mws.createRequest({
            'action': 'ListOrderItems',
            'config': config,
            'parameters': parameters,
            'type': 'Orders',
            "xml": xml
        }, function(err, data) {
            cb(err, data);
        });
    },

    /**
     * @absract Returns the next page of order items using the NextToken parameter.
     * @description The ListOrderItemsByNextToken operation returns the next page of order items using the NextToken value that was returned by your previous request to either ListOrderItems or ListOrderItemsByNextToken. If NextToken is not returned, there are no more pages to return.

     The ListOrderItems and ListOrderItemsByNextToken operations together share a maximum request quota of 30 and a restore rate of one request every two seconds.
     * @param {Object} config Configuration file
     * @param {Object} params Required: NextToken
     * @param {Boolean} xml flag. If true, returns raw xml although returns object
     * @param {Function} cb Callback function
     * @see http://docs.developer.amazonservices.com/en_US/orders/2013-09-01/Orders_ListOrderItemsByNextToken.html
     */
    ListOrderItemsByNextToken: function(config, params, xml, cb) {
        if (typeof xml == 'function') {
            cb = xml;
            xml = false;
        } else if (typeof xml == 'undefined') {
            console.warn("No callback provided. Throwing the request");
            return;
        }

        if (!_.has(params, 'NextToken')) {
            cb({
                "Error": "You need to pass parameter NextToken"
            }, null);
            return;
        }

        mws.createRequest({
            'action': 'ListOrderItemsByNextToken',
            'config': config,
            'parameters': params,
            'type': 'Orders',
            "xml": xml
        }, function(err, data) {
            cb(err, data);
        });
    },
};
