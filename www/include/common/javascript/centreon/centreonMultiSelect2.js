/* global jQuery, navigator, centreonMultiSelectLocales */
(function ($) {
    function CentreonMultiSelect2(settings, $elem) {

        this.internal = new CentreonMultiSelect2Internal(settings, $elem);
    }

    function CentreonMultiSelect2Internal(settings, $elem) {
        this.settings = settings;
        this.$elem = $elem;
        this.parent = $elem.parent();

        this.niceScroll = null;
        this.locale = 'en';
        this.messages = {};
        this.confirmBox = null;
        this.remoteData = false;
        this.extendedAction = false;
        this.ajaxOptions = {};

        this.init();
    }

    CentreonMultiSelect2Internal.prototype = {
        /**
         * Initialize multiSelect
         */
        init: function () {
            var self = this;
            this.multiSelectOptions = this.settings.multiSelect;

            this.initLocale();
            this.initAjax();

            /* Template for result display */
            this.multiSelectOptions.templateResult = function (item) {
                var text = item.text;
                var $result;
                if (self.settings.templateResult !== null) {
                    text = self.settings.templateResult(item);
                }
                if (item.id) {
                    $result = $('<div>')
                        .data('did', item.id)
                        .attr('title', item.text);
                    if (typeof text === 'string') {
                        return $result.text(text);
                    }
                    return $result.append(text);
                }
                return text;
            };
            /* Template for selection */
            this.multiSelectOptions.templateSelection = function (data, container) {
                if (data.hasOwnProperty('element') && data.element.hidden) {
                    $(container).hide();
                }
                return $('<span>')
                    .addClass('multicheckbox-content')
                    .attr('title', data.text)
                    .text(data.text);
            };

            if (this.remoteData) {
                this.multiSelectOptions.ajax = this.ajaxOptions;
            }


            var parentName = this.multiSelectOptions.checkboxparent;

            $.ajax({
                url: this.multiSelectOptions.ajax.url,
                success: function (data) {
                    var i = 0;
                    for (i = 0; i < data.items.length; i++) {
                        html = "<label><input type=\"checkbox\" value=\"" + data.items[i].id + "\" ";
                        html += " name=\"" + parentName + "[]\" ";
                        html += "/>" + data.items[i].text + "</label>";
                        $("#"+ parentName).append(html);
                    }
                }
            });


            this.initNiceScroll();
            this.initEvents();

            if (this.settings.allowClear) {
                this.initAllowClear();
            }
            if (this.settings.multiple) {
                this.initMultiple();
            }

            this.resizeMultiSelect2();
        },
        resizeMultiSelect2: function () {
            var formSpan = jQuery(".formTable span.multicheckbox-container");
            formSpan.css({
                'min-width': '360px',
            });
            formSpan.find('.multicheckbox-selection--multiple .multicheckbox-selection__rendered').css({
                'resize': 'vertical'
            });
        },
        /**
         * Load the locale, if not defined in settings use the browser locale
         */
        initLocale: function () {
            if (this.settings.locale !== null) {
                this.locale = this.settings.locale;
            } else {
                this.locale = navigator.language || navigator.userLanguage;
            }

            if (typeof centreonMultiSelectLocales !== 'undefined' &&
                centreonMultiSelectLocales.hasOwnProperty(this.locale)) {
                this.messages = centreonMultiSelectLocales[this.locale];
            }
        },
        /**
         * Initialize the nice scroll when opening MultiSelect
         */
        initNiceScroll: function () {
            var self = this;

            self.$elem.on('multicheckbox:open', function () {
                $('ul.multicheckbox-results__options').off('mousewheel');
                $('ul.multicheckbox-results__options').niceScroll({
                    cursorcolor: '#818285',
                    cursoropacitymax: 0.6,
                    cursorwidth: 3,
                    horizrailenabled: true,
                    zindex: 5000,
                    autohidemode: false
                });
            });
        },
        /**
         * Initialize geneal events
         */
        initEvents: function () {
            var self = this;

            /* Prevent closing when advanced event is running */
            this.$elem.on('MultiSelect:closing', function (e) {
                if (self.extendedAction) {
                    e.preventDefault();
                }
            });
        },
        /**
         * Initialize ajax options and if using ajax
         */
        initAjax: function () {
            var self = this;

            if (self.settings.multiSelect.hasOwnProperty('ajax') &&
                self.settings.multiSelect.ajax.hasOwnProperty('url')) {
                self.remoteData = true;
                self.ajaxOptions = self.settings.multiSelect.ajax;
                self.ajaxOptions.data = function (params) {
                    return self.ajaxData(params);
                };
                self.ajaxOptions.processResults = function (data, params) {
                    params.page = params.page || 1;
                    if (self.settings.multiple) {
                        self.$totalElements.text(data.total);
                    }
                    return {
                        results: data.items,
                        pagination: {
                            more: (params.page * self.settings.pageLimit) < data.total
                        }
                    };
                }
            }
        },

        /**
         * Select a list of elements
         *
         * @param {Array[Object]} elements - The list of elements
         * @param {String} elements.id - The value of the element
         * @param {String} elements.text - The display test of the element
         */
        selectElements: function (elements) {
            var self = this;
            var item;
            var option;
            var selectedElements;

            if (this.remoteData) {
                /* Append new elements */
                for (var i = 0; i < elements.length; i++) {
                    item = elements[i];

                    /* Create DOM option that is pre-selected by default */
                    option = '<option selected value="' + item.id + '"';
                    if (item.hide === true) {
                        option += ' hidden';
                    }
                    option += '>' + item.text + '</option>';

                    /* Append it to select */
                    self.$elem.append(option);
                }
            } else {
                /* Select existing elements */
                selectedElements = elements.map(function (object) {
                    return object.id;
                });
                self.$elem.val(selectedElements);
            }
            self.$elem.trigger('change');
        },
        /**
         * Select a list of elements
         *
         * @param {Array[Object]} elements - The list of elements
         * @param {String} elements.id - The value of the element
         * @param {String} elements.text - The display test of the element
         */
        unselectElements: function (elements) {
            var self = this;
            var item;
            var option;
            var selectedElements;
            var currentValues;
            var tmpIds;

            if (this.remoteData) {
                /* Remove elements */
                tmpIds = elements.map(function (object) {
                    return object.id;
                });
                self.$elem.find('option').each(function (idx, element) {
                    if (tmpIds.indexOf($(element).val()) >= 0) {
                        $(element).remove();
                    }
                });
            } else {
                /* Select existing elements */
                currentValues = self.$elem.val();
                tmpIds = elements.map(function (object) {
                    return object.id;
                });
                selectedElements = currentValues.filter(function (id) {
                    if (tmpIds.indexOf(id) >= 0) {
                        return true;
                    }
                    return false;
                });
                self.$elem.val(selectedElements);
            }
            self.$elem.trigger('change');
        },

        /**
         * Prepare the data for ajax query
         */
        ajaxData: function (params) {
            var filterKey;
            var value;
            var data = {
                q: params.term,
                page_limit: this.settings.pageLimit,
                page: params.page || 1
            };

            for (filterKey in this.settings.additionnalFilters) {
                if (this.settings.additionnalFilters.hasOwnProperty(filterKey)) {
                    if (typeof this.settings.additionnalFilters[filterKey] === 'string') {
                        value = $(this.settings.additionnalFilters[filterKey]).val();
                    } else {
                        value = this.settings.additionnalFilters[filterKey]();
                    }
                    if (value !== null && value !== undefined && value !== '') {
                        data[filterKey] = value;
                    }
                }
            }

            return data;
        },
        /**
         * Format a string
         *
         * '{0} {1}' (first, second)
         * => first second
         */
        stringFormat: function (format) {
            var args = Array.prototype.slice.call(arguments, 1);
            return format.replace(/{(\d+)}/g, function (match, number) {
                if (typeof args[number] !== 'undefined') {
                    return args[number];
                }
                return match;
            });
        },
        /**
         * Translate a string
         */
        translate: function (message) {
            var parameters = Array.prototype.slice.call(arguments, 1);
            if (this.messages.hasOwnProperty(message)) {
                return this.stringFormat(this.messages[message], parameters);
            }
            return this.stringFormat(message, parameters);
        }
    };

    CentreonMultiSelect2.prototype = {
        /**
         * Action add nice scroll
         */
        addNiceScroll: function () {
            this.internal.niceScroll = this.internal.$elem.next('.multicheckbox-container')
                .find('ul.multicheckbox-selection__rendered')
                .niceScroll(
                    {
                        cursorcolor: '#818285',
                        cursoropacitymax: 0.6,
                        cursorwidth: 3,
                        horizrailenabled: true,
                        autohidemode: true
                    }
                );
        },
        /**
         * Action remove nice scroll
         */
        removeNiceScroll: function () {
            this.internal.niceScroll.remove();
        },
        /**
         * Destroy the element
         */
        destroy: function () {
            this.internal.$elem.MultiSelect('destroy');
            this.internal.$elem.removeData('centreonMultiSelect');
        },
        /**
         * Update MultiSelect settings
         *
         * @param {Object} settings - New settings, only differentials
         */
        updateSettings: function (settings) {
            this.internal.multiSelectOptions = $.extend(
                {},
                this.internal.multiSelectOptions,
                settings
            );
            this.internal.$elem.multiSelect('destroy');
            this.internal.$elem.multiSelect(this.internal.multiSelectOptions);
        }
    };

    $.fn.centreonMultiSelect2 = function (options) {

        var args = Array.prototype.slice.call(arguments, 1);
        var settings = $.extend({}, $.fn.centreonMultiSelect2.defaults, options);
        var methodReturn;
        var $set = this.each(function () {
            var $this = $(this);
            var data = $this.data("centreonMulticheckbox");

            if (!data) {
                $this.data("centreonMulticheckbox", ( data = new CentreonMultiSelect2(settings, $this)));
                data.addNiceScroll();
            }

            if (typeof options === "string") {
                methodReturn = data[options].apply(data, args);
            }
        });

        return (methodReturn === undefined) ? $set : methodReturn;
    };

    $.fn.centreonMultiSelect2.defaults = {
        allowClear: false,
        confirmMinNumber: 0,
        locale: null,
        templateResult: null,
        pageLimit: 20,
        additionnalFilters: {},
        multiSelect: {
            allowClear: true
        }
    };
})(jQuery);

