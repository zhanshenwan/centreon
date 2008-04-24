<?php
/*
 * Centreon is developped with GPL Licence 2.0 :
 * http://www.gnu.org/licenses/old-licenses/gpl-2.0.txt
 * Developped by : Julien Mathis - Romain Le Merlus 
 * 
 * The Software is provided to you AS IS and WITH ALL FAULTS.
 * Centreon makes no representation and gives no warranty whatsoever,
 * whether express or implied, and without limitation, with regard to the quality,
 * any particular or intended purpose of the Software found on the Centreon web site.
 * In no event will Centreon be liable for any direct, indirect, punitive, special,
 * incidental or consequential damages however they may arise and even if Centreon has
 * been previously advised of the possibility of such damages.
 * 
 * For information : contact@oreon-project.org
 */
 
	if (!isset($oreon))
		exit();

	$path = dirname(__FILE__);
	$valid = 0;
	
	/* Include pour la création du formulaire */
	require_once "HTML/QuickForm.php";
	require_once 'HTML/QuickForm/Renderer/ArraySmarty.php';
	
	$attrsText = array("size"=>"35");
	
	$query = "SELECT `gopt_id`, `patch_type_stable`, `patch_type_RC`, `patch_type_patch`, `patch_type_secu`, `patch_type_beta`, `patch_path_download` FROM `general_opt` LIMIT 1";
	$DBRESULT =& $pearDB->query($query);
	$gopt = array_map("myDecode", $DBRESULT->fetchRow());
	
	$form = new HTML_QuickForm('patchOption', 'post', "?p=".$p);
	$form->addElement('header', 'title', _("Change update options"));
	
	$tab = array();
	$tab[] = &HTML_QuickForm::createElement('radio', 'patch_type_stable', null, _("Yes"), 'Y');
	$tab[] = &HTML_QuickForm::createElement('radio', 'patch_type_stable', null, _("No"), 'N');
	$form->addGroup($tab, 'patch_type_stable', _("Check stable versions"), '&nbsp;');
	$tab = array();
	$tab[] = &HTML_QuickForm::createElement('radio', 'patch_type_patch', null, _("Yes"), 'Y');
	$tab[] = &HTML_QuickForm::createElement('radio', 'patch_type_patch', null, _("No"), 'N');
	$form->addGroup($tab, 'patch_type_patch', _("Check patches"), '&nbsp;');
	$tab = array();
	$tab[] = &HTML_QuickForm::createElement('radio', 'patch_type_secu', null, _("Yes"), 'Y');
	$tab[] = &HTML_QuickForm::createElement('radio', 'patch_type_secu', null, _("No"), 'N');
	$form->addGroup($tab, 'patch_type_secu', _("Check secu-patches"), '&nbsp;');
	$tab = array();
	$tab[] = &HTML_QuickForm::createElement('radio', 'patch_type_RC', null, _("Yes"), 'Y');
	$tab[] = &HTML_QuickForm::createElement('radio', 'patch_type_RC', null, _("No"), 'N');
	$form->addGroup($tab, 'patch_type_RC', _("Check Release candidate"), '&nbsp;');
	$tab = array();
	$tab[] = &HTML_QuickForm::createElement('radio', 'patch_type_beta', null, _("Yes"), 'Y');
	$tab[] = &HTML_QuickForm::createElement('radio', 'patch_type_beta', null, _("No"), 'N');
	$form->addGroup($tab, 'patch_type_beta', _("Check Beta"), '&nbsp;');
	$form->addElement('hidden', 'gopt_id');
	$form->addElement('text', 'patch_path_download', _("Patch Download path"), $attrsText);
	
	$form->setDefaults($gopt);
	
	$tpl = new Smarty();
	$tpl = initSmartyTpl($path, $tpl);
	
	$subC =& $form->addElement('submit', 'submitC', _("Save"));
	$res =& $form->addElement('reset', 'reset', _("Reset"));
	
	#
	##Picker Color JS
	#
	$tpl->assign('colorJS',"
	<script type='text/javascript'>
		function popup_color_picker(t,name,title)
		{
			var width = 400;
			var height = 300;
			window.open('./include/common/javascript/color_picker.php?n='+t+'&name='+name+'&title='+title, 'cp', 'resizable=no, location=no, width='
						+width+', height='+height+', menubar=no, status=yes, scrollbars=no, menubar=no');
		}
	</script>
	");
	#
	##End of Picker Color
	#
	
	if ($form->validate()) {
		$ret = array();
		$ret = $form->getSubmitValues();
		$query = "UPDATE `general_opt` SET `patch_type_stable` = '" . $ret['patch_type_stable']["patch_type_stable"] . "'";
		$query .= ", `patch_type_patch` = '" . $ret['patch_type_patch']['patch_type_patch'] . "'";
		$query .= ", `patch_type_secu` = '" . $ret['patch_type_secu']['patch_type_secu'] . "'";
		$query .= ", `patch_type_RC` = '" . $ret['patch_type_RC']['patch_type_RC'] . "'";
		$query .= ", `patch_type_beta` = '" . $ret['patch_type_beta']['patch_type_beta'] . "'";
		$query .= ", `patch_path_download`= '" . htmlentities($ret['patch_path_download'], ENT_QUOTES) . "'";
		$query .= " WHERE `gopt_id`=1";
		$pearDB->query($query);
	}
	
	$renderer =& new HTML_QuickForm_Renderer_ArraySmarty($tpl);
	$renderer->setRequiredTemplate('{$label}&nbsp;<font color="red" size="1">*</font>');
	$renderer->setErrorTemplate('<font color="red">{$error}</font><br />{$html}');
	$form->accept($renderer);
	$tpl->assign('form', $renderer->toArray());
	$tpl->assign('valid', $valid);
	$tpl->display("patchOptions.ihtml");
?>