******凡是修改過的地方都是以update by Asy開頭*******

一、加載順序
1、首先加載angular.js及相關組件，比如cookie、route、translate等
2、其次加載landing-app.js，主要用於展示登錄后的整體頁面佈局，頁面內的跳轉由landing-controller.js掌控
3、驗證成功后跳轉到landing.html頁面，即登錄后的主頁面
4、點form會進入forms.html，單個form編輯是form-builder.html，單個元素編輯是formfield-edit-popover.html
5、點擊editor會進入processes.html主頁面，

任務處理頁面：tasks.html = task.html(task.js) + form-template.html(render-form.js)
條件配置的彈出窗口：condition-expression-popup.html

editor-controller.js	加载模型设计器元素
fetchModel()	<——		url-config.js的getModel

stencil-controller.js
editor中的属性元素点击事件：propertyClicked

toolbar-default-actions.js
$scope.save 保存模型

processes.js
loadProcesses 加载设计模型

app.js	加载tab页签，切换tab时展示




