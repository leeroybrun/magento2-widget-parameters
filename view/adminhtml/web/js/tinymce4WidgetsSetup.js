/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/* eslint-disable strict */
define([
    'jquery',
    'underscore',
    'wysiwygWidgetsAdapter',
    'module',
    'mage/translate',
    'prototype',
    'mage/adminhtml/events',
    'mage/adminhtml/browser',
    'mage/adminhtml/wysiwyg/tiny_mce/setup',
], function (jQuery, _, wysiwygWidgetsAdapter, module) {
    //var baseConfig = module.config().config || {};
    var baseConfig = {
        isInWidget: true
    };

    var wysiwygWidgetsSetup = Class.create({
        wysiwygInstance: null
    });

    wysiwygWidgetsSetup.prototype = {

        /**
         * @param {*} htmlId
         * @param {Object} config
         */
        initialize: function (htmlId, config) {
            console.log('init wysiwyg setup widgets', htmlId);
            var WysiwygInstancePrototype = new wysiwygWidgetsAdapter.getAdapterPrototype();

            _.bindAll(this, 'openFileBrowser');

            config = _.extend({}, baseConfig, config || {});
            this.wysiwygInstance = new WysiwygInstancePrototype(htmlId, config);
            this.wysiwygInstance.eventBus = this.eventBus = new window.varienEvents();
        },

        /**
         * @param {*} mode
         */
        setup: function (mode) {
            this.wysiwygInstance.setup(mode);
        },

        /**
         * @param {Object} o
         */
        openFileBrowser: function (o) {
            this.wysiwygInstance.openFileBrowser(o);
        },

        /**
         * @return {Boolean}
         */
        toggle: function () {
            return this.wysiwygInstance.toggle();
        },

        /**
         * On form validation.
         */
        onFormValidation: function () {
            this.wysiwygInstance.onFormValidation();
        },

        /**
         * Encodes the content so it can be inserted into the wysiwyg
         * @param {String} content - The content to be encoded
         *
         * @returns {*} - The encoded content
         */
        updateContent: function (content) {
            return this.wysiwygInstance.encodeContent(content);
        }
    };

    window.wysiwygWidgetsSetup = wysiwygWidgetsSetup;

    return wysiwygWidgetsSetup;
});