/* global jQuery, navigator, centreonMultiSelectLocales */

function mutliSelect(settings, elem) {
    var self = this;

    self.settings = settings;
    self.page = 1;
    self.elem = elem;
    self.elem.addClass('ms-bloc');

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
}

mutliSelect.prototype = {

    initElements: function() {
        var self=this;

        self.elem.parent = $('<div class="multiselect-elem">');
        self.elem.wrap(self.elem.parent);
        self.elem.searchBox = $('<div class="ms-filter">');
        self.elem.before(self.elem.searchBox);
    },

    searchData: function() {
        var self = this,
            input;

        input = $('<input type="text" value="" placeholder="Search..."/>');
        self.elem.searchBox.append(input);

        $(input).on('keypress', function() {
            var keyword = input.val();

            var url = self.settings.url + '&q=' + keyword;
            if(keyword != '') {
                $.ajax({
                    url: url,
                    type : 'GET',
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function(data) {
                        var datas = '';
                        if (data != null) {
                            $.each(data.items, function(idx,value) {
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

    getData: function(nb_page) {
        var self = this,
            total;

        /*http://10.30.2.170/centreon/include/common/webServices/rest/internal.php?object=centreon_configuration_host&action=list&page_limit=60&page=1

         http://10.30.2.170/centreon/api/index.php?object=centreon_configuration_host&action=list

         http://10.30.2.170/centreon/api/index.php?action=authenticate

         username=superadmin&password=centreon
         */

        var url = self.settings.url + '&page_limit=' + self.settings.limit + '&page=' + nb_page;


        $.ajax({
            url: url,
            type : 'GET',
            dataType: 'json',
            contentType: 'application/json',
            success: function(data) {
                if(data != null) {
                    total = Math.round(Math.ceil(data.total / self.settings.limit));

                    if (nb_page <= total) {
                        $.each(data.items, function(idx,value) {
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
    },

    initNiceScroll: function(elem) {
        elem.niceScroll({
            cursoropacitymin: 0.2,
            railpadding: {right: 10}
        });
    }
};

(function($) {
    $.fn.centreonMultiSelect2 = function(options) {

        var settings = $.extend({}, $.fn.centreonMultiSelect2.defaults, options);

        this.each(function () {
            var self = $(this);
            that = new mutliSelect(settings, self);
        });

        return this;
    };
})(jQuery);

/**
 * defaults options
 */
$.fn.centreonMultiSelect2.defaults = {
    url: null,
    limit: 10
};