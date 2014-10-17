/*global Prism, $, console */
/*jslint plusplus:true*/
$(document).ready(function () {
  "use strict";
  function getMethodData(method) {
    return function (data, status) {
      var
        result = data,
        tr = $("." + method);
      
      tr.show();
      
      $(".access", tr).text(result.access);
      $(".token", tr).text(result.token);
      $(".description", tr).text(result.description);
      
      if (result.params !== undefined) {
        $(".table", tr).show();
        $(".table", tr).bootstrapTable('load', result.params);
      } else {
        $(".table", tr).hide();
      }
      
      $(".response", tr).text(JSON.stringify(result.response, null, 4));
      //$(".response", tr).addClass("language-javascript");
      //Prism.highlightElement($(".response", tr)[0], false);
    };
  }
  
  $('.nav li').on('click', function () {
    $('.nav li').removeClass('active');
    $(this).addClass('active');
    
    if ($(this).attr('id') === 'introButton') {
      $('#introduction').show();
      $('#info').hide();
    } else {
      $("#info tbody").children().hide();
      
      var url = "." + $(this).text().replace(/:/g, '').trim();
      
      $('#introduction').hide();
      $('#info').show();
      $('#info>.panel-heading>.panel-title').text($(this).text());
      
      $.get(url + '/info.json', {}, function (data, status) {
        var methods = data, i, method;
        for (i = 0; i < methods.length; ++i) {
          method = methods[i];
          
          $.get(url + '/' + method + '.json', {}, getMethodData(method));
        }
      });
      

      
    }
  });
});