-- 13 08 06
ALTER TABLE  `general_opt` ADD `debug_path` VARCHAR( 255 ) NULL AFTER `ldap_auth_enable`;
ALTER TABLE  `general_opt` ADD `debug_auth` enum('0','1') default NULL AFTER `debug_path`;
ALTER TABLE  `general_opt` ADD `debug_nagios_import` enum('0','1') default NULL AFTER `debug_auth`;
