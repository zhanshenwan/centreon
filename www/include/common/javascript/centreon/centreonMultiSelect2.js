/* global jQuery, navigator, centreonMultiSelectLocales */

function mutliSelect(settings, elem) {
    var self = this;

    self.settings = settings;
    self.page = 1;
    self.elem = elem;
    self.elem.addClass('ms-bloc');
    self.ajax = self.settings.multiSelect.ajax;
    self.hasFilteredDatas = false;
    self.selectedDatas = {};


    self.initElements();
    self.initNiceScroll(elem);
    self.searchData();
    self.displayDatas();
}

mutliSelect.prototype = {

    initElements: function() {
        var self=this;

        self.elem.parent = jQuery('<div class="multiselect-elem">');
        self.elem.wrap(self.elem.parent);
        self.elem.searchBox = jQuery('<div class="ms-filter">');
        self.elem.before(self.elem.searchBox);
    },

    searchData: function() {
        var self = this,
            input;

        input = jQuery('<input type="text" value="" placeholder="Search..."/>');
        self.elem.searchBox.append(input);

        jQuery(input).on('keypress', function() {
            var keyword = input.val();

            var url = self.settings.url + '&q=' + keyword;
            if(keyword != '') {
                jQuery.ajax({
                    url: url,
                    type : 'GET',
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function(data) {
                        var datas = '';
                        if (data != null) {
                            jQuery.each(data.items, function(idx,value) {
                                datas += '<div class="ms-elem">' +
                                    '<input type="checkbox" id="elem_' + value.id + '" />' +
                                    '<label for="elem_' + value.id + '">' + value.text + '</label>' +
                                    '</div>';
                            })
                            if (datas == ''){
                                self.elem.html('<p class="ms-elem">Element not found !</p>');
                            } else {
                                self.elem.html(datas);
                            }

                        } else {
                            console.log('Element not found !');
                        }
                    },
                    error: function() {
                        console.log('Element not found !');
                    }
                });
            } else {
                self.getData(self.page, self.selectedDatas);
            }
        });

    },

    displayDatas: function() {
        var self = this,
            hasSelectedDatas;

        if (self.settings.url !== null) {

            jQuery.ajax({
                url: self.settings.url,
                type : 'GET',
                dataType: 'json',
                contentType: 'application/json',
                success: function(datas) {
                    if (datas != null) {
                            self.selectedDatas = datas;
                    }
                },
                error: function(XMLHttpRequest, textStatus, error) {
                    console.log(error);
                }
            }).done(function() {
                if (self.selectedDatas.length === 0 || self.selectedDatas === undefined) {
                    hasSelectedDatas = false;
                } else {
                    hasSelectedDatas = true;
                }

                self.renderIntialDatas(hasSelectedDatas,self.selectedDatas);
            });

        } else {
            console.log('url undefined !');
        }
    },

    renderIntialDatas: function(hasSelectedDatas, selectedDatas) {
        var self = this;

        self.getData(self.page, hasSelectedDatas, selectedDatas, false);

        /* Add event to infinite scroll */
        self.elem.on("scroll", function (e) {
            if (self.elem.scrollTop() + self.elem.height() > self.elem.height() * self.page) {
                self.page ++;
                //self.displayDatas();
                self.getData(self.page, hasSelectedDatas, selectedDatas, false);
            }
        });

        if (hasSelectedDatas) {
            self.renderSelectedDatas(selectedDatas, true);
        }
    },

    renderSelectedDatas: function(selectedDatas, isChecked) {
        var self = this,
            element,
            attrChecked = '';

            if (isChecked) {
                attrChecked = 'checked';
            }

            jQuery.each(selectedDatas, function(i, selectedValue) {
                self.elem.append(
                    '<div class="ms-elem">' +
                    '<input type="checkbox" ' + attrChecked + ' id="elem_' + selectedValue.id + '" />' +
                    '<label for="elem_' + selectedValue.id + '">' + selectedValue.text + '</label>' +
                    '</div>'
                );
            });
        },

    getData: function(nb_page, hasSelectedDatas, selectedDatas, isChecked) {
        var self = this,
            renderedDatas = [],
            total;

        if (self.settings.multiSelect.hasOwnProperty('ajax')) {

            var url = self.ajax.url + '&page_limit=' + self.settings.pageLimit + '&page=' + nb_page;

            jQuery.ajax({
                url: url,
                type : 'GET',
                dataType: 'json',
                contentType: 'application/json',
                success: function(data) {
                    if(data != null) {
                        total = Math.round(Math.ceil(data.total / self.settings.pageLimit));
                        if (nb_page <= total) {
                            if (hasSelectedDatas) {
                                jQuery.each(data.items, function(idx,value) {
                                    jQuery.each(selectedDatas, function(i, selectedValue) {
                                        if (value.text !== selectedValue.text) {
                                            renderedDatas.push({
                                                id: value.id,
                                                text: value.text
                                            });
                                        }
                                    });
                                });
                            } else {
                                renderedDatas = data.items;
                            }

                            self.renderSelectedDatas(renderedDatas, isChecked);
                        }
                    }
                }
            });
        }
    },

    initNiceScroll: function(elem) {
        elem.niceScroll({
            cursoropacitymin: 0.2,
            railpadding: {right: 10}
        });
    }
};

(function(jQuery) {
    jQuery.fn.centreonMultiSelect2 = function(options) {

        var settings = jQuery.extend({}, jQuery.fn.centreonMultiSelect2.defaults, options);

        this.each(function () {
            var self = jQuery(this);
            that = new mutliSelect(settings, self);
        });

        return this;
    };
})(jQuery);

/**
 * defaults options
 */
jQuery.fn.centreonMultiSelect2.defaults = {
    url: null,
    pageLimit: 10,
    multiSelect: {}
};