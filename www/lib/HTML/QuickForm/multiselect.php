<?php
/*
 * Copyright 2005-2015 Centreon
 * Centreon is developped by : Julien Mathis and Romain Le Merlus under
 * GPL Licence 2.0.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation ; either version 2 of the License.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
 * PARTICULAR PURPOSE. See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this program; if not, see <http://www.gnu.org/licenses>.
 *
 * Linking this program statically or dynamically with other modules is making a
 * combined work based on this program. Thus, the terms and conditions of the GNU
 * General Public License cover the whole combination.
 *
 * As a special exception, the copyright holders of this program give Centreon
 * permission to link this program with independent modules to produce an executable,
 * regardless of the license terms of these independent modules, and to copy and
 * distribute the resulting executable under terms of Centreon choice, provided that
 * Centreon also meet, for each linked independent module, the terms  and conditions
 * of the license of that module. An independent module is a module which is not
 * derived from this program. If you modify this program, you may extend this
 * exception to your version of the program, but you are not obliged to do so. If you
 * do not wish to do so, delete this exception statement from your version.
 *
 * For more information : contact@centreon.com
 *
 *
 */

/**
 * Base class for form elements
 */
require_once 'HTML/QuickForm/select.php';


class HTML_QuickForm_multiselect extends HTML_QuickForm_select
{
    /**
     *
     * @var string
     */
    var $_elementHtmlName;

    /**
     *
     * @var string
     */
    var $_elementTemplate;

    /**
     *
     * @var string
     */
    var $_elementCSS;

    /**
     *
     * @var string
     */
    var $_availableDatasetRoute;

    /**
     *
     * @var string
     */
    var $_defaultDatasetRoute;

    /**
     *
     * @var string
     */
    var $_defaultDataset;

    /**
     *
     * @var boolean
     */
    var $_ajaxSource;

    /**
     *
     * @var boolean
     */
    var $_multiple;

    /**
     *
     * @var string
     */
    var $_multipleHtml;

    /**
     *
     * @var string
     */
    var $_defaultSelectedOptions;

    /**
     *
     * @var string
     */
    var $_jsCallback;

    /**
     *
     * @var boolean
     */
    var $_allowClear;

    /**
     *
     * @var string
     */
    var $_linkedObject;

    /**
     *
     * @var type
     */
    var $_defaultDatasetOptions;

    /**
     * @var int The number of element in the pagination
     */
    var $_pagination;

    /**
     *
     * @param string $elementName
     * @param string $elementLabel
     * @param array $options
     * @param array $attributes
     * @param string $sort
     */
    function HTML_QuickForm_multiselect(
        $elementName = null,
        $elementLabel = null,
        $options = null,
        $attributes = null,
        $sort = null
    ) {
        global $centreon;
        $this->_ajaxSource = false;
        $this->HTML_QuickForm_select($elementName, $elementLabel, $options, $attributes);
        $this->_elementHtmlName = $this->getName();
        $this->_defaultDataset = null;
        $this->_defaultDatasetOptions = array();
        $this->_jsCallback = '';
        $this->parseCustomAttributes($attributes);

        $this->_pagination = $centreon->optGen['selectPaginationSize'];
    }

    /**
     *
     * @param array $attributes
     */
    function parseCustomAttributes(&$attributes)
    {
        // Check for
        if (isset($attributes['datasourceOrigin']) && ($attributes['datasourceOrigin'] == 'ajax')) {
            $this->_ajaxSource = true;
            // Check for
            if (isset($attributes['availableDatasetRoute'])) {
                $this->_availableDatasetRoute = $attributes['availableDatasetRoute'];
            }

            // Check for
            if (isset($attributes['defaultDatasetRoute'])) {
                $this->_defaultDatasetRoute = $attributes['defaultDatasetRoute'];
            }
        }

        if (isset($attributes['linkedObject'])) {
            $this->_linkedObject = $attributes['linkedObject'];
        }
    }

    /**
     *
     * @param boolean $raw
     * @param boolean $min
     * @return string
     */
    function getElementJs()
    {
        $jsFile = './include/common/javascript/centreon/centreonMultiSelect2.js';

        $js = '<script type="text/javascript" '
            . 'src="' . $jsFile . '">'
            . '</script>';

        return $js;
    }

    /**
     *
     * @return type
     */
    function getElementHtmlName()
    {
        return $this->_elementHtmlName;
    }

    /**
     *
     * @return string
     */
    function toHtml()
    {
        $strHtml = '<div id="'.$this->getName().'"></div>';

        $strHtml .= $this->getJsInit();
        return $strHtml;
    }

    /**
     *
     * @return string
     */
    function getJsInit()
    {
        $ajaxOption = '';
        $defaultData = '';
        if ($this->_ajaxSource) {
            $ajaxOption = 'ajax: {
                url: "' . $this->_availableDatasetRoute . '"
            },';

        } else {
            $defaultData = $this->setFixedDatas() . ',';
            $this->setDefaultFixedDatas();
        }

        $additionnalJs .= ' ' . $this->_jsCallback;

        $javascriptString = '<script>
            jQuery(function () {
                var $currentObject' . $this->getName() . ' = jQuery("#' . $this->getName() . '").centreonMultiSelect2({
                    pageLimit: ' . $this->_pagination . ',
                    multiSelect: {
                        ' . $ajaxOption . '
                        ' . $defaultData . '
                        placeholder: "' . $this->getLabel() . '"                    }
                });
                ' . $additionnalJs . '
            });
         </script>';

        return $javascriptString;
    }

    /**
     *
     * @return string
     */
    public function setFixedDatas()
    {
        $datas = 'data: [';

        // Set default values
        $strValues = is_array($this->_values) ? array_map('strval', $this->_values) : array();

        foreach ($this->_options as $option) {
            if (empty($option["attr"]["value"])) {
                $option["attr"]["value"] = -1;
            }

            if (!is_numeric($option["attr"]["value"])) {
                $option["attr"]["value"] = '"' . $option["attr"]["value"] . '"';
            }

            $datas .= '{id: ' . $option["attr"]["value"] . ', text: "' . $option['text'] . '"},';
            if (!empty($strValues) && in_array($option['attr']['value'], $strValues, true)) {
                $option['attr']['selected'] = 'selected';
                $this->_defaultSelectedOptions .= '<div class="ms-elem">'
                    . '<label><input type="checkbox" '
                    . 'name="' . $this->getName() . '"[]"'
                    . $this->_getAttrString($option['attr']) . ' />'
                    . $option['text']
                    . '</label></div>';
            }
        }
        $datas .= ']';

        return $datas;
    }

    var $_memOptions = array();

    /**
     *
     * @param string $event
     * @param string $callback
     */
    public function addJsCallback($event, $callback)
    {
        $this->_jsCallback .= ' jQuery("#' . $this->getName() . '").on("' . $event . '", function(){ '
            . $callback
            . ' }); ';
    }


    /**
     *
     * @return string
     */
    function getFrozenHtml()
    {
        $strFrozenHtml = '';
        return $strFrozenHtml;
    }

    /**
     *
     * @param type $event
     * @param type $arg
     * @param type $caller
     * @return boolean
     */

    function onQuickFormEvent($event, $arg, &$caller)
    {
        if ('updateValue' == $event) {
            $value = $this->_findValue($caller->_constantValues);

            if (null === $value) {
                if (is_null($this->_defaultDataset)) {
                    $value = $this->_findValue($caller->_submitValues);
                } else {
                    $value = $this->_defaultDataset;
                }

                if (null === $value && (!$caller->isSubmitted())) {
                    $value = $this->_findValue($caller->_defaultValues);
                }
            }

            if (null !== $value) {
                if (!is_array($value)) {
                    $value = array($value);
                }
                $this->_defaultDataset = $value;
            }
            return true;
        } else {
            return parent::onQuickFormEvent($event, $arg, $caller);
        }
    }
}

if (class_exists('HTML_QuickForm')) {
    HTML_QuickForm::registerElementType(
        'multiselect',
        'HTML/QuickForm/multiselect.php',
        'HTML_QuickForm_multiselect'
    );
}
