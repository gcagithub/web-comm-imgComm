var _popupWidth = 600;
var _popupImgHTML = "popupImgCommForm.html";
var _serverURL = "http://localhost:8080/web-comm/";
var _jqWebCommImgPopup;
var _imgSrcs;
var _tmplImgComm;
var _jqImage;
var _imgCommTooltips = {};
var _toolTipsterOpenForm;
var _lang;
var _localTmpls = {
	en: {
		tooltip_create_comment: 'Create comment',
		tooltip_comments: ' comment(s)', 
		form_btn_submit: 'Submit',
		form_btn_show_comments: 'Show comment(s)',
		form_title: 'Title:',
		form_comment: 'Comment:',
		comment_list_comments: 'Comments:'

	},
	ru: {
		tooltip_create_comment: 'Создать комментарий',
		tooltip_comments: ' комментарий(-ев)', 
		form_btn_submit: 'Отправить',
		form_btn_show_comments: 'Показать комм-ии',
		form_title: 'Заголовок:',
		form_comment: 'Комментарий:',
		comment_list_comments: 'Комментарии:'
	},
};