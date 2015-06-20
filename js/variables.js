// width of popup form with comments
var _popupWidth = 600;
// popup HTML form url
var _popupImgHTML = "popupImgCommForm.html";
// var _serverURL = "http://localhost:8080/web-comm/";
var _serverURL = "http://localhost:8080/WebComm/rest/imgcomment/";

// tag attribute
var _wcHashIdAttr = 'web-comm-hashId'; 
// image hashId list
var _imgHashIdList; 

// jquery link to popup form
var _jqWebCommImgPopup;
var _tmplImgComm;

// currently commented image
var _jqImage;
var _imgCommData = {};
var _toolTipsterOpenForm;

// brauser language
var _lang;

// localization
var _localTmpls = {
	en: {
		tooltip_create_comment: 'Create comment',
		tooltip_comments: ' comment(s)', 
		form_btn_submit: 'Submit',
		form_btn_show_comments: 'Show comment(s)',
		form_title: 'User:',
		form_comment: 'Comment:',
		comment_list_comments: 'Comments:'

	},
	ru: {
		tooltip_create_comment: 'Создать комментарий',
		tooltip_comments: ' ',
		form_btn_submit: 'Отправить',
		form_btn_show_comments: 'Показать комм-ии',
		form_title: 'Имя:',
		form_comment: 'Комментарий:',
		comment_list_comments: 'Комментарии:'
	}
};