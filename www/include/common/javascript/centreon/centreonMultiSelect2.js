/* global jQuery, navigator, centreonMultiSelectLocales */

function multiSelect(settings, elem) {
    var self = this;

    self.settings = settings;
    self.page = 1;
    self.elem = elem;
    self.elem.addClass('ms-bloc');
    self.ajax = self.settings.multiSelect.ajax;
    self.hasFilteredDatas = false;
    self.selectedDatas = {};
    self.id = self.elem.attr('id');

    self.initElements();
    self.initNiceScroll(elem);
    self.handleEvent();
    self.displayDatas();
}

multiSelect.prototype = {

    initElements: function() {
        var self=this;

        self.elem.parent = jQuery('<div class="multiselect-elem">');
        self.elem.wrap(self.elem.parent);
        self.elem.searchBox = jQuery('<div class="ms-filter">');
        self.elem.before(self.elem.searchBox);
    },

    /**
     * Handle keypress event on search
     */
     handleEvent: function() {
         var self = this,
             keyword,
             input;

         input = jQuery('<input type="text" value="" placeholder="Search..."/>');
         self.elem.searchBox.append(input);

         $(document).on('click', '.checkbox-label', function(e) {
             if(e.which == 1) {
                 let idTarget = e.target.htmlFor.split("elem_");
                 let addElem = true;
                 jQuery.each(self.selectedDatas, function() {
                     jQuery.grep(self.selectedDatas, function (element, index){
                         if(element.id === idTarget[1]) {
                             self.selectedDatas.splice(index, 1);
                             addElem = false;
                             return true;
                         }
                     });
                 });
                 if (addElem !== false) {
                     self.selectedDatas.push({
                         'hide': false,
                         'id': idTarget[1],
                         'text': e.target.innerHTML
                     });
                 }
             }
         });

         let displayDatasOnce = false;

         jQuery(input).on('keyup keypress', function(e) {
             keyword = input.val();

             if (e.which === 13) {
                 e.preventDefault();
                 return false;
             }

             if (keyword.length >= 3) {
                 displayDatasOnce = true;
                 setTimeout(function() {
                     self.searchData(keyword);
                 }, 2000);
             } else if(keyword === "" && displayDatasOnce === true) {
                   self.page = 1;
                   self.displayDatas();
                   displayDatasOnce = false;
             }
         });
     },

    /**
     * Search by keyword and display results
     * @param keyword
     */
     searchData: function(keyword) {
         var self = this,
         url = self.ajax.url + '&q=' + keyword,
         selectedDatas;

         jQuery.ajax({
             url: url,
             type : 'GET',
             dataType: 'json',
             contentType: 'application/json',
             success: function(data) {
                 var datas = '';
                 if (data != null) {
                     jQuery.each(data.items, function(idx,value) {
                         let attrChecked = '';
                         jQuery.grep(self.selectedDatas, function(element, index) {
                             if (element.text == value.text) {
                                 attrChecked = 'checked';
                             }
                         });
                         datas += '<div class="ms-elem">' +
                         '<input type="checkbox"' + attrChecked + ' name="' + self.id + '[]" id="elem_' + value.id + '" value="' + value.id + '" class="advancedForm"/>' +
                         '<label for="elem_' + value.id + '" class="checkbox-label">' + value.text + '</label>' +
                         '</div>';
                     })
                     if (datas == '') {
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
    },

    /**
     * Get selected Datas if they exist
     */
    displayDatas: function() {
        var self = this,
            hasSelectedDatas;
        self.elem.html('');

        if (self.settings.url !== null) {
            if (jQuery.isEmptyObject(self.selectedDatas)) {
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
                    self.getInitialDatas(hasSelectedDatas,self.selectedDatas);
                });
            }
            else {
                hasSelectedDatas = true;
                self.getInitialDatas(hasSelectedDatas,self.selectedDatas);
            }
        } else {
            console.log('url undefined !');
        }
    },

    /**
     * Get datas with infinite scroll
     * @param hasSelectedDatas
     * @param selectedDatas
     */
    getInitialDatas: function(hasSelectedDatas, selectedDatas) {
        var self = this;
        self.getData(self.page, hasSelectedDatas, selectedDatas, false);

        /* Add event to infinite scroll */
        self.elem.on("scroll", function (e) {
            if (self.elem.scrollTop() + self.elem.height() > self.elem.height() * self.page) {
                self.page ++;
                self.getData(self.page, hasSelectedDatas, selectedDatas, false);
            }
        });

        if (hasSelectedDatas) {
            self.renderDatas(selectedDatas, true);
        }
    },

    /**
     * Display Datas
     * @param selectedDatas
     * @param isChecked
     */
     renderDatas: function(selectedDatas, isChecked) {
        var self = this,
            attrChecked = '';

        if (isChecked) {
            attrChecked = 'checked';
        }
        jQuery.each(selectedDatas, function(i, selectedValue) {
            self.elem.append(
                '<div class="ms-elem">' +
                '<input type="checkbox" ' + attrChecked + ' id="elem_' + selectedValue.id
                + '" value="' + selectedValue.id + '" name="' + self.id + '[]" class="advancedForm" />' +
                '<label for="elem_' + selectedValue.id + '"class="checkbox-label">' + selectedValue.text + '</label>' +
                '</div>'
            );
        });
    },

    /**
     * Get datas by ajax call
     * @param nb_page
     * @param hasSelectedDatas
     * @param selectedDatas
     * @param isChecked
     */
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
                    if (data != null) {
                        total = Math.round(Math.ceil(data.total / self.settings.pageLimit));
                        if (nb_page <= total) {
                            if (selectedDatas.length > 0) {
                                let array = [];
                                jQuery.each(data.items, function (idx,value) {
                                    array.push({
                                      id: value.id,
                                      text: value.text
                                    });
                                });
                                jQuery.each(selectedDatas, function(index, element){
                                    array = array.filter(function(el) {
                                        return el.text !== element.text;
                                    });
                                });
                                renderedDatas = array;
                            } else {
                                renderedDatas = data.items;
                            }
                            data = "";
                            self.renderDatas(renderedDatas, isChecked);
                        }
                    }
                }
            });
        }
    },

    /**
     * Init nice scroll
     * @param elem
     */
     initNiceScroll: function(elem) {
         elem.niceScroll({
             cursoropacitymin: 0.2,
             railpadding: {right: 10}
         });
         elem.mouseover(function() {
             elem.getNiceScroll().resize();
         });
     }
};

(function(jQuery) {
    jQuery.fn.centreonMultiSelect2 = function(options) {
        var settings = jQuery.extend({}, jQuery.fn.centreonMultiSelect2.defaults, options);
        this.each(function () {
            var self = jQuery(this);
            that = new multiSelect(settings, self);
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
