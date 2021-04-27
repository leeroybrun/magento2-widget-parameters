define([
    'mage/adminhtml/wysiwyg/tiny_mce/tinymce4Adapter'
], function (tinymce4Adapter) {
    "use strict";

    var tinymce4WidgetsAdapter = Class.create();
    tinymce4WidgetsAdapter.prototype = Object.assign({}, tinymce4Adapter);

    var oldDecodeContent = tinymce4WidgetsAdapter.prototype.decodeContent;
    // https://github.com/magento/magento2/blob/7c6b6365a3c099509d6f6e6c306cb1821910aab0/lib/web/mage/adminhtml/wysiwyg/tiny_mce/tinymce4Adapter.js#L723
    tinymce4WidgetsAdapter.prototype.decodeContent = function (content) {
        content = oldDecodeContent.call(this, content);

        var editor = this.get(this.getId());
        if (!editor || editor.id !== this.activeEditor().id || editor.id.indexOf('widget_param_wysiwyg') == -1) {
            return content;
        }

        return content.replaceAll('"', "'");;
    };

    var oldEncodeContent = tinymce4WidgetsAdapter.prototype.encodeContent;
    // https://github.com/magento/magento2/blob/7c6b6365a3c099509d6f6e6c306cb1821910aab0/lib/web/mage/adminhtml/wysiwyg/tiny_mce/tinymce4Adapter.js#L723
    tinymce4WidgetsAdapter.prototype.encodeContent = function (content) {
        content = oldEncodeContent.call(this, content);

        var editor = this.get(this.getId());
        if (!editor || editor.id !== this.activeEditor().id || editor.id.indexOf('widget_param_wysiwyg') == -1) {
            return content;
        }

        return content.replaceAll('"', "'");
    };

    tinymce4WidgetsAdapter.prototype.getAdapterPrototype = function () {
        return tinymce4WidgetsAdapter;
    };

    return tinymce4WidgetsAdapter.prototype;
});