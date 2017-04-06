/* global jQuery, navigator, centreonMultiSelectLocales */

function mutliSelect(settings, elem) {
    var self = this;

    self.settings = settings;
    self.page = 1;
    self.elem = elem;
    self.elem.addClass('ms-bloc');
    self.ajax = self.settings.multiSelect.ajax;
    self.hasFilteredDatas = false;

    /* Add event to infinite scroll */
    self.elem.on("scroll", function (e) {
        if (self.elem.scrollTop() + self.elem.height() > self.elem.height() * self.page) {
            self.page ++;
            self.getData(self.page);
        }
    });

    self.initElements();
    self.getData(self.page);
    self.initNiceScroll(elem);
    self.searchData();

    console.log('settings : ', self.settings);
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
                self.getData(self.page);
            }
        });

    },

    getUrlForAjax: function() {
        var self = this;

        if (self.settings.url !== null) {
            self.hasFilteredDatas = true;
            self.compareRenderedDatas(self.hasFilteredDatas);
        } else {
            self.getData(self.page);
        }
    },

    compareRenderedDatas: function (hasFilteredDatas) {

        if (hasFilteredDatas) {
            jQuery.ajax({
                url: self.settings.url,
                type : 'GET',
                dataType: 'json',
                contentType: 'application/json',
                success: function(data) {
                    if(data != null) {
                        total = Math.round(Math.ceil(data.total / self.settings.pageLimit));

                        if (nb_page <= total) {
                            jQuery.each(data.items, function(idx,value) {
                                self.elem.append(
                                    '<div class="ms-elem">' +
                                    '<input type="checkbox" id="elem_' + value.id + '" />' +
                                    '<label for="elem_' + value.id + '">' + value.text + '</label>' +
                                    '</div>');
                            })
                        }
                    }
                }
            });
        }
    },

    getData: function(nb_page) {
        var self = this,
            total;

        /*http://10.30.2.170/centreon/include/common/webServices/rest/internal.php?object=centreon_configuration_host&action=list&page_limit=60&page=1
         http://10.30.2.170/centreon/api/index.php?object=centreon_configuration_host&action=list
         http://10.30.2.170/centreon/api/index.php?action=authenticate
         username=superadmin&password=centreon
         */

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
                            jQuery.each(data.items, function(idx,value) {
                                self.elem.append(
                                    '<div class="ms-elem">' +
                                    '<input type="checkbox" id="elem_' + value.id + '" />' +
                                    '<label for="elem_' + value.id + '">' + value.text + '</label>' +
                                    '</div>');
                            })
                        }
                    }
                }
            });
        }

        //var url = self.settings.url + '&page_limit=' + self.settings.pageLimit + '&page=' + nb_page;

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
    multiSelect: {
    }
};